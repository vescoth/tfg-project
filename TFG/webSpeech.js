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
    nuevoSol.setAttribute('material', 'emissive:rgb(255, 255, 255); emissiveIntensity: 1; side: double;');
    nuevoSol.setAttribute('light', 'type: point; intensity: 5; distance: 50; decay: 2; color:rgb(255, 255, 255)');
    nuevoSol.setAttribute('animation', "property: rotation; to: 0 360 0; loop: true; dur: 3000");
    nuevoSol.setAttribute('collect-id-on-click', '');
    nuevoSol.setAttribute('id', `sol-${id}`);
    nuevoSol.setAttribute('onclick', `startEdit('${nuevoSol.id}')`);
    escena.appendChild(nuevoSol);
    id++;
    console.log("Sol creado en la escena.");
}

function crearSpino(position) {
    const escena = document.querySelector('a-scene');
    const nuevoSpino = document.createElement('a-entity');
    console.log(`Pos spino: ${position.x} 3 ${position.z}`);
    nuevoSpino.setAttribute('position', position);
    nuevoSpino.setAttribute('color', '#FFFFFF');
    nuevoSpino.setAttribute('gltf-model', '#spino');
    nuevoSpino.setAttribute('scale', '2 2 2');
    nuevoSpino.setAttribute('rotation', '0 -90 0');
    nuevoSpino.setAttribute('collect-id-on-click', '');
    nuevoSpino.setAttribute('id', `spino-${id}`);
    nuevoSpino.setAttribute('animation-mixer', '');
    nuevoSpino.setAttribute('onclick', `startEdit('${nuevoSpino.id}')`);
    escena.appendChild(nuevoSpino);
    console.log("Spino creado en la escena.");
    id++;
}

function crearRata(position) {
    const escena = document.querySelector('a-scene');
    const nuevaRata = document.createElement('a-entity');
    console.log(`Pos spino: ${position.x} 3 ${position.z}`);
    nuevaRata.setAttribute('position', position);
    nuevaRata.setAttribute('color', '#FFFFFF');
    nuevaRata.setAttribute('gltf-model', '#rat');
    nuevaRata.setAttribute('scale', '2 2 2');
    nuevaRata.setAttribute('rotation', '0 -90 0');
    nuevaRata.setAttribute('collect-id-on-click', '');
    nuevaRata.setAttribute('id', `spino-${id}`);
    nuevaRata.setAttribute('animation-mixer', '');
    nuevaRata.setAttribute('onclick', `startEdit('${nuevaRata.id}')`);
    escena.appendChild(nuevaRata);
    console.log("Spino creado en la escena.");
    id++;
}

function crearRex(position) {
    const escena = document.querySelector('a-scene');
    const nuevoRex = document.createElement('a-entity');
    nuevoRex.setAttribute('position', position);
    nuevoRex.setAttribute('color', '#FFFFFF');
    nuevoRex.setAttribute('gltf-model', '#rex');
    nuevoRex.setAttribute('scale', '2 2 2');
    nuevoRex.setAttribute('rotation', '0 0 0');
    nuevoRex.setAttribute('collect-id-on-click', '');
    nuevoRex.setAttribute('id', `primitive-${id}`);
    nuevoRex.setAttribute('animation-mixer', 'clip: idle');
    nuevoRex.setAttribute('onclick', `startEdit('${nuevoRex.id}')`);
    escena.appendChild(nuevoRex);
    console.log("Rex creado en la escena.");
    id++;
}

function crearEsfera(position) {
    console.log("POSICIÓN esfera:", position);
    const escena = document.querySelector('a-scene');
    const nuevaEsfera = document.createElement('a-sphere');
    nuevaEsfera.setAttribute('position', position);
    nuevaEsfera.setAttribute('material', 'side: double; src: url(https://static.vecteezy.com/system/resources/thumbnails/028/250/102/small/watermelon-peel-seamless-pattern-food-texture-background-wallpaper-of-summer-vector.jpg);');
    nuevaEsfera.setAttribute('color', `#${Math.floor(Math.random()*16777215).toString(16)}`);
    nuevaEsfera.setAttribute('scale', '2 2 2');
    nuevaEsfera.setAttribute('collect-id-on-click', '');
    nuevaEsfera.setAttribute('id', `primitive-${id}`);
    nuevaEsfera.setAttribute('onclick', `startEdit('${nuevaEsfera.id}')`);
    nuevaEsfera.setAttribute('dynamic-body', '');
    escena.appendChild(nuevaEsfera);
    id++;
    console.log("esfera creado en la escena.");
};

function crear(nombreEntidad, position) {
    const primitivePosition = `${position.x} ${position.y} ${position.z - 10}`;
    const modelPosition = `${position.x} 0 ${position.z - 10}`;
    const entidadRecibida = nombreEntidad.trim('');
    if (entidadRecibida.includes('esfera')) {
        crearEsfera(primitivePosition);
    } else if (entidadRecibida.includes('cubo')) {
        crearCubo(primitivePosition);
    } else if (entidadRecibida.includes('suelo')) {
        crearSuelo(primitivePosition);
    } else if (entidadRecibida.includes('piramide')) {
        crearPiramide(primitivePosition);
    }else if (entidadRecibida.includes('sol')) {
        crearSol(primitivePosition);
    } else {
        const escena = document.querySelector('a-scene');
        const nuevaEntidad = document.createElement('a-entity');
        nuevaEntidad.setAttribute('position', modelPosition);
        nuevaEntidad.setAttribute('color', '#FFFFFF');
        nuevaEntidad.setAttribute('gltf-model', `#${entidadRecibida}`);
        nuevaEntidad.setAttribute('scale', '2 2 2');
        nuevaEntidad.setAttribute('rotation', '0 0 0');
        nuevaEntidad.setAttribute('collect-id-on-click', '');
        nuevaEntidad.setAttribute('id', `id-${id}`);
        nuevaEntidad.setAttribute('animation-mixer', 'clip: *; loop: repeat; crossFadeDuration: 0.5');
        nuevaEntidad.setAttribute('onclick', `startEdit('${nuevaEntidad.id}')`);
        escena.appendChild(nuevaEntidad);
        console.log("Entidad creada en la escena.");
        id++;
    }
}

function borrar(id) {
    const objeto = document.getElementById(id);
    objeto.parentNode.removeChild(objeto);
    console.log("Elemento eliminado de la escena.");
}

function crearCubo(position) {
    const escena = document.querySelector('a-scene');
    const nuevoCubo = document.createElement('a-box');
    nuevoCubo.setAttribute('position', position);
    nuevoCubo.setAttribute('scale', '2 2 2');
    nuevoCubo.setAttribute('color', `#${Math.floor(Math.random()*16777215).toString(16)}`);
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
    nuevaPiramide.setAttribute('collect-id-on-click', '');
    nuevaPiramide.setAttribute('id', `piramide-${id}`);
    nuevaPiramide.setAttribute('material', `side: double; src: #textura-piramide`);
    nuevaPiramide.setAttribute('onclick', `startEdit('${nuevaPiramide.id}')`);
    escena.appendChild(nuevaPiramide);
    console.log("piramide creada en la escena.");
    id++;
}

function crearTodo(){
    crearEsfera();
    crearCubo();
    crearSuelo();
    crearPiramide();
}

function editarObjeto(objetoId, newObjectJson) {
    const objeto = document.getElementById(objetoId);
    let position = objeto.getAttribute('position');
    const alto = newObjectJson.scale.y;
    if(objetoId.includes('primitive')) {
        position = `${position.x} 0 ${position.z}`;
    }else{
        position = `${position.x} 0 ${position.z}`;
    }
    objeto.setAttribute('scale', newObjectJson.scale);
    objeto.setAttribute('color', newObjectJson.color);
    objeto.setAttribute('position', position);
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
                        "content": "Eres un asistente que identifica de manera precisa lo que desea generar un usuario.' \
                                    Las posibles figuras a crear son: esfera, cubo, suelo, pared, piramide, sol, espinosaurio, rata, t-rex, drone, flor \
                                    Debes responder con la figura correspondiente en MINUSCULAS. \
                                    Reglas de respuesta: Responde SOLO con el comando correcto en MINUSCULAS. No des explicaciones, \
                                    ni agregues texto adicional. Si no consigues realacionar el mensaje con ningún comando, responde con:'ningún_comando'. \
                                    Ejemplos:\
                                    Usuario: 'Quisiera una bola' Asistente: `esfera` \
                                    Usuario: 'Haz un suelo' Asistente: `suelo` \
                                    Usuario: 'Muéstrame algo con aristas y tridimensional' Asistente: `cubo` \
                                    Usuario: 'Quiero un objeto que simule el sol' Asistente: `sol`\
                                    Usuario: 'Quiero ver un dinosaurio' Asistente: `rex`\
                                    Trata de relacionar el mensaje del usuario con algo que esté en la lista de figuras disponibles.\
                                    Si no consigues relacionar el mensaje con ninguna figura, responde con 'ningún_comando'.\
                                    Recuerda que debes responder únicamente con el comando asociado sin agregar texto adicional."
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
                        "role": "assistant",
                        "content": "Eres una IA que genera o bien un JSON válido con los atributos mencionados a continuación, o bien responde con 'borrar' \
                                    Reglas:\
                                    1. Devuelve un JSON con las siguientes claves:\
                                    - 'color': Un color representado en formato hexadecimal (ejemplo: '#FF5733').\
                                    - 'scale': Un objeto con los valores 'x', 'y' y 'z', representando la escala del objeto en A-Frame.(ejemplo: 'scale': { 'x': 2, 'y': 2, 'z': 2 })\
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
                                    7. La respuesta debe ser un JSON válido sin texto adicional salvo cuando se quiera borrar, en cuyo caso responde simplemente 'borrar'.\
                                    8. La respuesta con el JSON generado DEBE seguir ESTRICTAMENTE el siguiente formato: { 'color': '#FF5733', 'scale': { 'x': 2, 'y': 2, 'z': 2 }}\
                                    Recuerda que si el usuario solicita borrar la figura, NO se responderá con un JSON, SOLO contesta 'borrar'.\
                                    Ejemplos de entrada y salida:\
                                    1.\
                                    Entrada: 'Quiero hacer el objeto más grande y de color amarillo { 'color': '#34AADC', 'scale': { 'x': 2, 'y': 1, 'z': 2 }}'\
                                    Salida: { 'color': '#34AADC', 'scale': { 'x': 4, 'y': 2, 'z': 4 }}\
                                    2.\
                                    Entrada: 'Quiero borrar esto'\
                                    Salida: borrar\
                                    "
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
            try {
                crear(comandoTraducido, position);
            } catch (error) {
                console.error('Error:', error);
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
            if (comandoTraducido.includes('borrar')) {
                borrar(id);
            } else {
                editarObjeto(id, JSON.parse(comandoTraducido));
            }
        });
}


