const API_KEY = "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"; // Reemplaza con tu clave de Groq
// const URL = "https://api.groq.com/openai/v1/chat/completions";a

function crearEsfera(position) {
    console.log("POSICIÓN esfera:", position);
    const escena = document.querySelector('a-scene');
    const nuevaEsfera = document.createElement('a-sphere');
    nuevaEsfera.setAttribute('position', position);
    nuevaEsfera.setAttribute('material', 'src: url(https://static.vecteezy.com/system/resources/thumbnails/028/250/102/small/watermelon-peel-seamless-pattern-food-texture-background-wallpaper-of-summer-vector.jpg);');
    nuevaEsfera.setAttribute('color', `#${Math.floor(Math.random()*16777215).toString(16)}`);
    nuevaEsfera.setAttribute('animation', `property: rotation ; to: 0 360 0; loop: true; dur: 3000`);
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
    escena.appendChild(nuevoSuelo);
    console.log("suelo creado en la escena.");
}

function crearPiramide(position) {
    const escena = document.querySelector('a-scene');
    const nuevaPiramide = document.createElement('a-cone');
    nuevaPiramide.setAttribute('position', position);
    nuevaPiramide.setAttribute('color', `#${Math.floor(Math.random()*16777215).toString(16)}`);
    nuevaPiramide.setAttribute('segments-radial', '4');
    nuevaPiramide.setAttribute('radius-bottom', '2');
    nuevaPiramide.setAttribute('height', '2.5');
    nuevaPiramide.setAttribute('rotation', '0 0 0;');
    nuevaPiramide.setAttribute('animation', "property: rotation; to: 0 360 0; loop: true; dur: 3000");
    escena.appendChild(nuevaPiramide);
    console.log("piramide creada en la escena.");
}

function crearTodo(){
    crearEsfera();
    crearCubo();
    crearSuelo();
    crearPiramide();
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
                                    3.'crear_suelo' → cuando el usuario mencione algo que implique un suelo. \
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

async function startListening(id) {
    console.log("ID:", id);
    let position = document.getElementById(id).getAttribute('position');
    position = `${position.x} ${position.y} ${position.z - 10}`;
    console.log(position);
    const recorder = await recordAudio();
    recorder.start();

    console.log("Grabando...");

        await sleep(5000);
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
            } else {
                console.log('Comando no reconocido.');
            }
        });
}


