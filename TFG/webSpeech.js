const API_KEY = "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";
// const URL = "https://api.groq.com/openai/v1/chat/completions";a

AFRAME.registerComponent('collect-id-on-click', {
    init: function () {
        this.el.addEventListener('click', () => {
            const id = this.el.getAttribute('id');
            console.log('ID del objeto:', id);
            // Aquí puedes agregar cualquier lógica adicional que necesites
        });
    }
});

let id = 0; // cada objeto debería tener un ID único (NO SOL-0 CUBO-1)

function crearSol(position) {
    const escena = document.querySelector('a-scene');
    const nuevoSol = document.createElement('a-sphere');
    nuevoSol.setAttribute('position', position);
    nuevoSol.setAttribute('radius', '1.5');
    nuevoSol.setAttribute('color', '#FFFFFF');
    nuevoSol.setAttribute('material', 'emissive:rgb(255, 0, 0); emissiveIntensity: 1; side: double;');
    nuevoSol.setAttribute('light', 'type: point; intensity: 5; distance: 50; decay: 2; color:rgb(255, 0, 0)');
    nuevoSol.setAttribute('animation', "property: rotation; to: 0 360 0; loop: true; dur: 3000");
    nuevoSol.setAttribute('collect-id-on-click', '');
    nuevoSol.setAttribute('id', `sol-${id}`);
    nuevoSol.setAttribute('onclick', `startEdit('${nuevoSol.id}')`);
    escena.appendChild(nuevoSol);
    console.log("Sol creado en la escena.");
}

function crearEsfera(position) {
    id++;
    console.log("POSICIÓN esfera:", position);
    const escena = document.querySelector('a-scene');
    const nuevaEsfera = document.createElement('a-sphere');
    nuevaEsfera.setAttribute('position', position);
    nuevaEsfera.setAttribute('material', 'side: double; src: url(https://static.vecteezy.com/system/resources/thumbnails/028/250/102/small/watermelon-peel-seamless-pattern-food-texture-background-wallpaper-of-summer-vector.jpg);');
    nuevaEsfera.setAttribute('color', `#${Math.floor(Math.random()*16777215).toString(16)}`);
    nuevaEsfera.setAttribute('animation', `property: rotation ; to: 0 360 0; loop: true; dur: 3000`);
    nuevaEsfera.setAttribute('scale', '2 2 2');
    nuevaEsfera.setAttribute('collect-id-on-click', '');
    nuevaEsfera.setAttribute('id', `esfera-${id}`);
    nuevaEsfera.setAttribute('onclick', `startEdit('${nuevaEsfera.id}')`);
    escena.appendChild(nuevaEsfera);
    console.log("esfera creado en la escena.");
};

function crearCubo(position) {
    const escena = document.querySelector('a-scene');
    const nuevoCubo = document.createElement('a-box');
    nuevoCubo.setAttribute('position', position);
    nuevoCubo.setAttribute('scale', '2 2 2');
    nuevoCubo.setAttribute('color', `#${Math.floor(Math.random()*16777215).toString(16)}`);
    nuevoCubo.setAttribute('animation', "property: rotation; to: 0 360 0; loop: true; dur: 3000");
    nuevoCubo.setAttribute('collect-id-on-click', '');
    nuevoCubo.setAttribute('material', `side: double;`);
    nuevoCubo.setAttribute('id', `cubo-${id}`);
    nuevoCubo.setAttribute('onclick', `startEdit('${nuevoCubo.id}')`);
    escena.appendChild(nuevoCubo);
    console.log("Cubo creado en la escena.");
};

function crearSuelo(position) {
    const escena = document.querySelector('a-scene');
    const nuevoSuelo = document.createElement('a-plane');
    nuevoSuelo.setAttribute('position', position);
    nuevoSuelo.setAttribute('material', 'src: url(https://www.ukflooringdirect.co.uk/cdn/shop/files/Series_Woods_10mm_Laminate_Flooring_Tawny_Oak_01_trade_1200x1200.jpg?v=1729084348);');
    nuevoSuelo.setAttribute('rotation', '-90 0 0;');
    nuevoSuelo.setAttribute('scale', '5 5 5');
    nuevoSuelo.setAttribute('animation', "property: rotation; to: -90 360 0; loop: true; dur: 3000");
    nuevoSuelo.setAttribute('collect-id-on-click', '');
    nuevoSuelo.setAttribute('id', `suelo-${id}`);
    nuevoSuelo.setAttribute('onclick', `startEdit('${nuevoSuelo.id}')`);
    escena.appendChild(nuevoSuelo);
    console.log("suelo creado en la escena.");
}

function crearPiramide(position) {
    const escena = document.querySelector('a-scene');
    const nuevaPiramide = document.createElement('a-cone');
    nuevaPiramide.setAttribute('position', position);
    nuevaPiramide.setAttribute('color', ``);
    nuevaPiramide.setAttribute('segments-radial', '4');
    nuevaPiramide.setAttribute('radius-bottom', '2');
    // nuevaPiramide.setAttribute('height', '2.5');
    nuevaPiramide.setAttribute('scale', '2 2 2');
    nuevaPiramide.setAttribute('rotation', '0 0 0;');
    nuevaPiramide.setAttribute('animation', "property: rotation; to: 0 360 0; loop: true; dur: 3000");
    nuevaPiramide.setAttribute('collect-id-on-click', '');
    nuevaPiramide.setAttribute('id', `piramide-${id}`);
    nuevaPiramide.setAttribute('material', `side: double; src: #textura-piramide`);
    nuevaPiramide.setAttribute('onclick', `startEdit('${nuevaPiramide.id}')`);
    escena.appendChild(nuevaPiramide);
    console.log("piramide creada en la escena.");
}

function crearTodo(){
    crearEsfera();
    crearCubo();
    crearSuelo();
    crearPiramide();
}

function editarObjeto(objetoId, newObjectJson) {
    let position = objetoId.getAttribute('position');
    const alto = newObjectJson.scale.y;
    position = `${position.x} ${alto/2} ${position.z}`;
    objetoId.setAttribute('scale', newObjectJson.scale);
    objetoId.setAttribute('color', newObjectJson.color);
    objetoId.setAttribute('position', position);
    console.log("Objeto editado.");

}

function borrarTodo() {
    const escena = document.querySelector('a-scene');
    escena.innerHTML = '';
    console.log("Elementos eliminados de la escena.");
}

async function identifyCommand(prompt) {
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
                        "role": "assistant",
                        "content": "Eres un asistente que convierte mensajes en comandos predefinidos. \
                                    Tienes los siguientes comandos disponibles: \
                                    1.'crear_esfera' → cuando el usuario mencione formas esféricas. \
                                    2.'crear_cubo' → cuando el usuario mencione formas cúbicas \
                                    3.'crear_sol' → cuando el usuario mencione algo que implique luz, bola de fuego, sol, etc.. \
                                    4.'crear_todo' → cuando el usuario mencione conceptos que sugieran totalidad o quiera varias cosas. \
                                    5.'borrar_todo' → cuando el usuario mencione que quiere eliminar todo lo que hay en la escena. \
                                    6.'crear_piramide' → cuando el usuario mencione formas piramidales. \
                                    Reglas de respuesta: Responde SOLO con el comando correcto en MINUSCULAS. No des explicaciones, \
                                    ni agregues texto adicional. Si no consigues realacionar el mensaje con ningún comando, responde con:'ningún_comando'. \
                                    Ejemplos: Usuario: 'Quisiera una bola' Asistente: `crear_esfera` \
                                    Usuario: 'Haz un suelo' Asistente: `crear_suelo` \
                                    Usuario: 'Muéstrame algo con aristas y tridimensional' Asistente: `crear_cubo` \
                                    Usuario: 'Quiero ver que puedo hacer' Asistente: `crear_todo` \
                                    Usuario: 'Quiero ver que puedo hacer' 'Asistente': `ningún_comando`",
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
        console.log('Success:', data);
        console.log('Respuesta:', data.choices[0].message.content);
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function identifyEdition(prompt) {
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
                        "content": "Eres una máquina que genera SOLO y ÚNICAMENTE un JSON válido con los siguientes \
                                    atributos para un objeto en A-Frame. No debes generar ningún otro tipo de contenido,\
                                    solo el JSON de respuesta.\
                                    Reglas:\
                                    1. Devuelve un JSON con las siguientes claves:\
                                    - 'color': Un color representado en formato hexadecimal (ejemplo: '#FF5733').\
                                    - 'scale': Un objeto con los valores 'x', 'y' y 'z', representando la escala del objeto en A-Frame.\
                                    2. El estado del objeto vendrá en la entrada en formato JSON después de la instrucción y este se\
                                    deberá modificar para cumplir con las nuevas instrucciones.\
                                    3. Ajusta los valores de 'scale' según la instrucción recibida:\
                                    - 'Más/menos grande/pequeña': Modifica 'x', 'y' y 'z'.\
                                    - 'Más/menos alto/bajo': Modifica solo 'y', manteniendo 'x' y 'z' iguales.\
                                    - 'Más/menos ancho/fino': Modifica solo 'x', manteniendo 'y' y 'z' iguales.\
                                    - 'Más/menos profundo': Modifica solo 'z', manteniendo 'x' y 'y' iguales.\
                                    4. Si en la instrucción se menciona un color, cambia 'color' al valor especificado en formato\
                                    hexadecimal.\
                                    5. Los valores de modificación de 'scale' deben ser números enteros.\
                                    6. Los valores de modificación de 'scale' serán acordes a la intensidad de la instrucción.\
                                    Valores de corrección según intensidad:\
                                    (Un poco: 1.5\, Más/Menos: 2\, Mucho más/menos: 3\, Muchísimo más/menos: 5\, Extremo/Exagerado: 10)\
                                    Te encargarás de asignar la intensidad en función de la instrucción recibida.\
                                    7. La respuesta SIEMPRE debe ser un JSON válido sin texto adicional.\
                                    Ejemplos de entrada y salida:\
                                    Entrada:\
                                    'Quiero hacer el objeto más grande y de color amarillo\
                                    { 'color': '#34AADC', 'scale': { 'x': 2, 'y': 1, 'z': 2 }}'\
                                    Salida:\
                                    '{ 'color': '#34AADC',\'scale': { 'x': 4, 'y': 2, 'z': 4 }}'\
                                    Responde estrictamente con un JSON y sin incluir ninguna otra información."
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

// document.addEventListener("DOMContentLoaded", function () {
//     if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         const recognition = new SpeechRecognition();
//         recognition.lang = 'es-ES';
//         recognition.continuous = true;
//         recognition.interimResults = false;
//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
//             console.log('Comando detectado:', transcript);
//             identifyCommand(transcript).then(comandoTraducido => {
//                 if (comandoTraducido.includes('crear_esfera')) {
//                     crearEsfera();
//                 } else if (comandoTraducido.includes('crear_cubo')) {
//                     crearCubo();
//                 } else if (comandoTraducido.includes('crear_suelo')) {
//                     crearSuelo();
//                 } else if (comandoTraducido.includes('crear_todo')) {
//                     crearTodo();
//                 } else if (comandoTraducido.includes('borrar_todo')) {
//                     borrarTodo();
//                 } else if (comandoTraducido.includes('crear_piramide')) {
//                     crearPiramide();
//                 } else {
//                     console.log('Comando no reconocido.');
//                 }
//             });
//         };

//         recognition.onerror = (event) => {
//             console.error('Error en el reconocimiento de voz:', event.error);
//         };

//         // Iniciar reconocimiento automáticamente
//         recognition.start();
//         console.log("Reconocimiento de voz activado...");
//     } else {
//         console.error('Tu navegador no soporta Web Speech API.');
//     }
// });
const recordAudio = () => {
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

async function startCreating(id) {
    console.log("ID:", id);
    let position = document.getElementById(id).getAttribute('position');
    position = `${position.x} ${Math.round(position.y)} ${position.z - 10}`;
    console.log(position);
    const recorder = await recordAudio();
    recorder.start();

    console.log("Grabando...");

        await sleep(3000);
        const audio = await recorder.stop();
        console.log("Grabación detenida.");

        const transcript = await recognizeSpeech(audio.audioBlob);
        console.log('Comando detectado:', transcript);
        identifyCommand(transcript.toLowerCase()).then(comandoTraducido => {
            if (comandoTraducido.includes('crear_esfera')) {
                crearEsfera(position);
            } else if (comandoTraducido.includes('crear_cubo')) {
                crearCubo(position);
            } else if (comandoTraducido.includes('crear_suelo')) {
                crearSuelo(position);
            } else if (comandoTraducido.includes('crear_todo')) {
                crearTodo(position);
            } else if (comandoTraducido.includes('borrar_todo')) {
                borrarTodo(position);
            } else if (comandoTraducido.includes('crear_piramide')) {
                crearPiramide(position);
            } else if (comandoTraducido.includes('crear_sol')) {
                crearSol(position);
            } else {
                console.log('Comando no reconocido.');
            }
        });
}

async function startEdit(id) {
    console.log("ID:", id);
    let position = document.getElementById(id).getAttribute('position');
    let color = document.getElementById(id).getAttribute('color');
    let scale = document.getElementById(id).getAttribute('scale');
    console.log(scale);
    position = `${position.x} ${position.y} ${position.z - 10}`;
    console.log(position);
    const recorder = await recordAudio();
    recorder.start();

    console.log("Grabando...");

        await sleep(3000);
        const audio = await recorder.stop();
        console.log("Grabación detenida.");

        const transcript = await recognizeSpeech(audio.audioBlob);
        console.log('Comando detectado:', transcript);
        const promptToEdit = transcript.toLowerCase() + ` { "color": "${color}", "scale": { "x": ${scale.x}, "y": ${scale.y}, "z": ${scale.z} } }`;
        console.log('Prompt:', promptToEdit);
        identifyEdition(promptToEdit).then(comandoTraducido => {
            editarObjeto(document.getElementById(id), JSON.parse(comandoTraducido));
        });
}


