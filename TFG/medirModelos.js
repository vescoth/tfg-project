// const API_KEY = "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"; // Reemplaza con tu clave de Groq

const models = [
    // 'llama-3.1-8b-instant',
    // 'llama-3.3-70b-versatile',
    // 'llama-3.2-3b-preview',
    // 'qwen-2.5-32b',
    // 'mixtral-8x7b-32768',
    // 'deepseek-r1-distill-llama-70b'
    'llama-guard-3-8b',
    'llama3-8b-8192',
    'gemma2-9b-it',
    'llama-3.2-1b-preview',

];

function medirPrecisionRespuesta(respuestaEsperada, respuestaObtenida) {
    let exactitud;
    if (respuestaEsperada === respuestaObtenida) {
        console.log("La respuesta es exacta. + 1");
        exactitud = 1;
    }else if (respuestaObtenida.includes(respuestaEsperada)) {
        console.log("La respuesta no es exacta pero contiene el valor esperado. (+ 0.5)");
        exactitud = 0.5;
    }else{
        console.log("La respuesta es incorrecta. (+ 0)");
        exactitud = 0;
    }
    return exactitud;
}

async function medirCalidadModeloAI(prompt, modelo, respuestaEsperada) {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: modelo, // Modelo disponible en Groq
                messages: [
                        {
                        "role": "assistant",
                        "content": "Eres un asistente que convierte mensajes en comandos predefinidos.\
                            Dispones de los siguientes comandos:  \
                            - 'crear_esfera' → Para menciones de formas esféricas.  \
                            - 'crear_cubo' → Para menciones de formas cúbicas.  \
                            - 'crear_suelo' → Para cualquier referencia a un suelo.  \
                            - 'crear_todo' → Para conceptos que impliquen totalidad o múltiples elementos.  \
                            - 'borrar_todo' → Para solicitudes de eliminar todo en la escena.  \
                            - 'crear_piramide' → Para menciones de formas piramidales.  \
                            \
                            **Reglas de respuesta:**  \
                            Responde **únicamente** con el comando correspondiente en **minúsculas**, sin explicaciones ni texto adicional.  \
                            Si el mensaje no coincide con ningún comando, responde con `'ningún_comando'`.  \
                            \
                            **Ejemplos:**  \
                            Usuario: 'Quisiera una bola' → Asistente: `crear_esfera`  \
                            Usuario: 'Haz un suelo' → Asistente: `crear_suelo`  \
                            Usuario: 'Muéstrame algo con aristas y tridimensional' → Asistente: `crear_cubo` \
                            Usuario: 'Quiero ver que puedo hacer' → Asistente: `crear_todo`  \
                            Usuario: 'No estoy seguro' → Asistente: `ningún_comando`",
                        },
                        {
                        "role": "user",
                        "content": prompt,
                        }
                    ],
                temperature: 0.0, // Controla la creatividad de las respuestas
                max_completion_tokens: 10, // Longitud máxima de la respuesta
                top_p: 0.0, // Controla la creatividad de las respuestas
                stream: false, // Devuelve todas las respuestas en una sola llamada
            }),
        });
        const data = await response.json();
        console.log("Respuesta obtenida:", data.choices[0].message.content);
        return medirPrecisionRespuesta(respuestaEsperada, data.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function probarModeloAI(modelo) {
    const dic = [
        { prompt: "Quiero ver algo redondo.", expected: "crear_esfera" },
        { prompt: "Haz algo con aristas.", expected: "crear_cubo" },
        { prompt: "Necesito tener una pelota.", expected: "crear_esfera" },
        { prompt: "Me gustaría crear una caja.", expected: "crear_cubo" },
        { prompt: "Genera algo con forma de pirámide.", expected: "crear_piramide" },
        { prompt: "Quiero crear una superficie.", expected: "crear_suelo" },
        { prompt: "Quisiera ver una estructura con base cuadrada y lados triangulares.", expected: "crear_piramide" },
        { prompt: "Necesito algo que pueda rodar.", expected: "crear_esfera" },
        { prompt: "Muéstrame una figura tridimensional con seis caras cuadradas.", expected: "crear_cubo" },
        { prompt: "Quiero una superficie plana para colocar objetos.", expected: "crear_suelo" }
    ];
    const tiempoInicio = performance.now();
    let exactitud = 0;
    for (const item of dic) {
        console.log(`Prompt: ${item.prompt}`);
        exactitud += await medirCalidadModeloAI(item.prompt, modelo, item.expected);
    }
    const tiempoFinal = performance.now();
    console.log(`➡️ Modelo: ${modelo} `);
    console.log(`⏳ Tiempo total de prueba del modelo: ${tiempoFinal - tiempoInicio} ms.`);
    console.log(`📌 Exactitud del modelo: ${exactitud / dic.length * 100}%`);
}

async function main() {
    console.log("Probando modelos de Groq...");
    for (const modelo of models) {
        console.log(`Modelo: ${modelo}`);
        await probarModeloAI(modelo);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    main();
});