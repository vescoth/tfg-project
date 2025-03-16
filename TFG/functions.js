const API_KEY = "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";

let id = 0;

export function actualizarAtributos() {
    console.log("Actualizando atributos...");
    const lanzador = document.getElementById('lanzador');
    lanzador.flushToDOM(true);
    console.log("Atributos actualizados.");
}

async function cargarEscenaGuardada() {
    await AFRAME.scenes[0].hasLoaded;
    let scene = document.getElementById("lanzador").innerHTML;
    console.log("Cargando escena guardada...", scene);
    scene = "";
    const sceneFile = "mi-escena.html";
    try {
        const response = await fetch(sceneFile);
        if (response.ok) {
            const text = await response.text();
            console.log("Escena guardada mi-escena.html:", text);
            document.getElementById("lanzador").innerHTML = text;
            console.log("Escena cargada correctamente.");
        } else {
            console.log("No se encontró una escena guardada.");
        }
    } catch (error) {
        console.error("Error al cargar la escena:", error);
    }
}

// document.querySelector("a-scene").addEventListener('loaded', cargarEscenaGuardada); // Cargar la escena guardada al cargar la página

export function borrar(id) {
    const objeto = document.getElementById(id);
    objeto.parentNode.removeChild(objeto);
    console.log("Elemento eliminado de la escena.");
}

function crearCubo(position) {
    const escena = document.querySelector('a-scene');
    const nuevoCubo = document.createElement('a-box');
    nuevoCubo.setAttribute('position', position);
    nuevoCubo.setAttribute('scale', '2 2 2');
    nuevoCubo.setAttribute('color', `#${Math.floor(Math.random() * 16777215).toString(16)}`);
    nuevoCubo.setAttribute('collect-id-on-click', '');
    nuevoCubo.setAttribute('material', `side: double;`);
    nuevoCubo.setAttribute('id', `cubo-${id}`);
    nuevoCubo.setAttribute('onclick', `startEdit('${nuevoCubo.id}')`);
    escena.appendChild(nuevoCubo);
    id++;
    console.log("Cubo creado en la escena.");
};

function crearSuelo(position) {
    const escena = document.querySelector('a-scene');
    const nuevoSuelo = document.createElement('a-plane');
    nuevoSuelo.setAttribute('position', position);
    nuevoSuelo.setAttribute('material', 'src: url(https://www.ukflooringdirect.co.uk/cdn/shop/files/Series_Woods_10mm_Laminate_Flooring_Tawny_Oak_01_trade_1200x1200.jpg?v=1729084348);');
    nuevoSuelo.setAttribute('rotation', '-90 0 0;');
    nuevoSuelo.setAttribute('scale', '5 5 5');
    nuevoSuelo.setAttribute('collect-id-on-click', '');
    nuevoSuelo.setAttribute('id', `suelo-${id}`);
    nuevoSuelo.setAttribute('onclick', `startEdit('${nuevoSuelo.id}')`);
    escena.appendChild(nuevoSuelo);
    id++;
    console.log("suelo creado en la escena.");
}

export function editarObjeto(objetoId, newObjectJson) {
    const objeto = document.getElementById(objetoId);
    let modelo = newObjectJson.model.trim();
    let position = newObjectJson.position;
    console.log("Modelo:", `#${modelo}`);
    let scale = newObjectJson.scale;
    if (modelo != "" && modelo != undefined) {
        objeto.setAttribute('gltf-model', `./Modelos/${modelo}.glb`);
    }
    
    objeto.setAttribute('scale', scale);
    objeto.setAttribute('position', position);

    console.log("Nuevo objeto:", objeto);

    console.log("Objeto editado en la escena.");
}

export function borrarTodo() {
    const lanzador = document.getElementById('lanzador');
    lanzador.innerHTML = '';
    console.log("Elementos eliminados de la escena.");
}

export async function identifyEdition(prompt) {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "gemma2-9b-it", // Modelo disponible en Groq
                messages: [
                    {
                        "role": "system",
                        "content": "Eres un asistente que se encarga de generar un JSON válido o responder con 'borrar'. El JSON tendrá los elementos\
                                    'model', 'scale' y 'position'.\
                                    Tu misión es elegir los valores de estos elementos que más se adecúen a la solicitud del usuario."
                    },
                    {
                        "role": "assistant",
                        "content": 'Instrucciones:\
                                    1. Identifica la figura solicitada basándote en las palabras clave del mensaje del usuario (por ejemplo, "esfera", "cubo", "suelo", etc.).\
                                    - "modelo": Nombre del modelo que se desea visualizar (ejemplo: "modelo": cubo)\
                                    2. Modifica el valor de "scale" basándote en las instrucciones dadas por el usuario. \
                                    Si se menciona "más grande", "más alto", etc., ajusta los valores de x, y, z según la intensidad de la instrucción.\
                                    - "scale": Un objeto con los valores "x", "y" y "z", representando la escala del objeto en A-Frame.(ejemplo: "scale": { "x": 2, "y": 2, "z": 2 })\
                                    3. Modifica los valores de "position" en basándote en si el usuario quiere colocar el objeto arriba, abajo, izquierda o derecha (pueden combinarse).\
                                    - "position": Un objeto con los valores "x", "y" y "z", representando la posición del objeto en A-Frame. (ejemplo: position: { "x": 0, "y": 2, "z": 0 })\
                                    3. El estado del objeto vendrá en la entrada en formato JSON después de la instrucción y este se\
                                    deberá modificar para cumplir con las nuevas instrucciones.\
                                    \
                                    5. Los valores modificados de "scale" serán acordes a la intensidad de la instrucción.\
                                    6. La respuesta debe ser un JSON válido sin texto adicional salvo cuando se quiera borrar, en cuyo caso responde simplemente "borrar".\
                                    7. La respuesta con el JSON generado DEBE seguir ESTRICTAMENTE el siguiente formato: { "model": "modelo", "scale": { "x": 2, "y": 2, "z": 2 }}\
                                    8. El modelo solo podrá tener letras minúsculas y no tendrá ninguna tilde.\
                                    9. Si no se menciona ningún modelo, se deberá responder con el modelo que ya tiene el objeto.\
                                    Recuerda que si el usuario solicita borrar la figura, NO se responderá con un JSON, SOLO contesta "borrar".\
                                    Ejemplos de entrada y salida:\
                                    1.\
                                    Entrada: "Quiero tener un T-rex { "modelo": "esfera", "scale": { "x": 4, "y": 4, "z": 4 }}"\
                                    Salida: { "modelo": "rex", "scale": { "x": 1, "y": 1, "z": 1 }}\
                                    2.\
                                    Entrada: "Quiero borrar esto"\
                                    Salida: borrar\
                                    3.\
                                    Entrada: "Quiero que sea tremendamente grande { "modelo": "rex", "scale": { "x": 1, "y": 1, "z": 1 }, "position": { "x": 1, "y": 1, "z": 1 }}" \
                                    Salida: { "modelo": "rex", "scale": { "x": 10, "y": 10, "z": 10 }, "position": { "x": 1, "y": 1, "z": 1 }}\
                                    4.\
                                    Entrada: "Quiero que sea más bajo{ "modelo": "rex", "scale": { "x": 1, "y": 1, "z": 1 }, "position": { "x": 1, "y": 1, "z": 1 }}"\
                                    Salida: { "modelo": "rex", "scale": { "x": 1, "y": 12, "z": 1 }, "position": { "x": 1, "y": 1, "z": 1 }}\
                                    5.\
                                    Entrada: "Ponlo en el suelo { "modelo": "rex", "scale": { "x": 1, "y": 1, "z": 1 }, "position": { "x": 1, "y": 1, "z": 1 }}"\
                                    Salida: { "modelo": "rex", "scale": { "x": 1, "y": 1, "z": 1 }, "position": { "x": 1, "y": 0, "z": 1 }}\
                                    '
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                temperature: 0.0, // Controla la creatividad de las respuestas
                // , // Longitud máxima de la respuesta
                top_p: 0.0, // Controla la creatividad de las respuestas
                stream: false, // Devuelve todas las respuestas en una sola llamada
            }),
        });
        const data = await response.json();
        console.log('Success:', data);
        console.log('Respuesta:', data.choices[0].message.content);
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
    }
}

export const recordAudio = () => {
    return new Promise(async resolve => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });

        const start = () => mediaRecorder.start();

        const stop = () => {
            return new Promise(resolve => {
                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    const play = () => audio.play();
                    resolve({ audioBlob, audioUrl, play });
                });

                mediaRecorder.stop();
            });
        };

        resolve({ start, stop });
    });
};

const recognizeSpeech = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('language', 'es');

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: formData
    });

    const data = await response.json();
    return data.text;
};


const sleep = time => new Promise(resolve => setTimeout(resolve, time));

export async function startEdit(id) {
    console.log("ID:", id);
    let position = document.getElementById(id).getAttribute('position');
    let modelPath = document.getElementById(id).getAttribute('gltf-model');
    let modelName = modelPath.split('/')[2].split('.')[0];
    console.log(modelName);
    let scale = document.getElementById(id).getAttribute('scale');
    console.log(scale);
    console.log(position);
    const recorder = await recordAudio();
    recorder.start();

    console.log("Grabando...");

    await sleep(3000);
    const audio = await recorder.stop();
    console.log("Grabación detenida.");

    const transcript = await recognizeSpeech(audio.audioBlob);
    console.log('Comando detectado:', transcript);
    const promptToEdit = transcript.toLowerCase() + ` { "model": "${modelName}", "scale": { "x": ${scale.x}, "y": ${scale.y}, "z": ${scale.z} }, "position": { "x": ${position.x}, "y": ${position.y}, "z": ${position.z} } }`;
    console.log('Prompt:', promptToEdit);
    identifyEdition(promptToEdit).then(comandoTraducido => {
        if (comandoTraducido.includes('borrar')) {
            borrar(id);
        } else {
            editarObjeto(id, JSON.parse(comandoTraducido));
        }
    });
}


