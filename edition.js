import { state } from './global.js';
import { API_KEY } from './global.js';
import { recordAudio, recognizeSpeech } from './recorder.js';

export function borrar(id) {
    const objeto = document.getElementById(id);
    objeto.parentNode.removeChild(objeto);
    console.log("Elemento eliminado de la escena.");
}

export function borrarTodo() {
    const lanzador = document.getElementById('lanzador');
    lanzador.innerHTML = '';
    state.creation_id = 0;
    console.log("Elementos eliminados de la escena. ID actual:", state.creation_id);
}

function multiplicarObjeto(objetoId, objectJson){
    const objeto = document.getElementById(objetoId);
    let position = objectJson.position;
    let rotation = objectJson.rotation;
    let multiplicador = objectJson.multiplicador;
    console.log("id actual:", state.creation_id);
    for (let i = 1; i <= multiplicador; ++i) {
        let nuevoObjeto = objeto.cloneNode(true);
        state.creation_id += 1;
        console.log("Nuevo ID:", state.creation_id);
        nuevoObjeto.setAttribute('id', state.creation_id);
        nuevoObjeto.setAttribute('position', `${position.x + i*5} ${position.y} ${position.z}`);
        nuevoObjeto.setAttribute('rotation', rotation);
        objeto.parentNode.appendChild(nuevoObjeto);
    }
}

export async function editarObjeto(objetoId, newObjectJson) {
    const objeto = document.getElementById(objetoId);
    let modelo = newObjectJson.model.trim();
    let position = newObjectJson.position;
    let rotation = newObjectJson.rotation;
    console.log("Modelo:", `#${modelo}`);
    let scale = newObjectJson.scale;
    if (modelo != "" && modelo != undefined) {
        try {
            await fetch(`./Modelos/${modelo}.glb`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Modelo no encontrado.");
                    }
                    objeto.setAttribute('gltf-model', `./Modelos/${modelo}.glb`);
                });
        } catch (error) {
            console.error("Error al cargar el modelo:", error);
        }
    }

    objeto.setAttribute('scale', scale);
    objeto.setAttribute('position', position);
    objeto.setAttribute('rotation', rotation);

    objeto.flushToDOM(true);

    if (newObjectJson.multiplicador > 0) {
        console.log("Antes de multiplicar id es:", state.creation_id);
        multiplicarObjeto(objetoId, newObjectJson, newObjectJson.multiplicador);
    }

    console.log("Nuevo objeto:", objeto);

    console.log("Objeto editado en la escena.");
}

export async function startEdit(id) {
    let el = document.getElementById(id);
    let position = document.getElementById(id).getAttribute('position');
    let rotation = document.getElementById(id).getAttribute('rotation');
    let modelPath = document.getElementById(id).getAttribute('gltf-model');
    let modelName = modelPath.split('/')[2].split('.')[0];
    let scale = document.getElementById(id).getAttribute('scale');

    const recorder = await recordAudio();
    recorder.start();
    console.log("Grabando... el id es", state.creation_id);
    document.addEventListener('mouseup', async (event) => {
        event.stopPropagation();
        const audio = await recorder.stop();
        console.log("Grabación detenida.");
        const transcript = await recognizeSpeech(audio.audioBlob);
        console.log('Comando detectado:', transcript);
        if (transcript.toLowerCase().includes('gemma') || transcript.toLowerCase().includes('gema')) {
            const promptToEdit = transcript.toLowerCase() + 
                ` { "model": "${modelName}", \
                "scale": { "x": ${scale.x}, "y": ${scale.y}, "z": ${scale.z} }, \
                "position": { "x": ${position.x}, "y": ${position.y}, "z": ${position.z} },\
                "rotation": { "x": ${rotation.x}, "y": ${rotation.y}, "z": ${rotation.z} } }`;
            
            console.log('Prompt:', promptToEdit);
            identifyEdition(promptToEdit).then(comandoTraducido => {
                if (comandoTraducido.includes('borrar')) {
                    borrar(id);
                } else {
                    editarObjeto(id, JSON.parse(comandoTraducido));
                }
            });
        }
    }, { once: true });
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
                                    'model', 'scale', 'position', 'rotation' y 'multiplicador'.\
                                    Tu misión es elegir los valores de estos elementos que más se adecúen a la solicitud del usuario.\
                                    NO APLIQUES NINGÚN FORMATO ADICIONAL A TU RESPUESTA, SOLO DEVUELVE EL JSON EN TEXTO PLANO O 'borrar'.\
                                    Responde lo más rápido posible"
                    },
                    {
                        "role": "assistant",
                        "content": 'Instrucciones:\
                                    1. Identifica la figura solicitada basándote en las palabras clave del mensaje del usuario (por ejemplo, "esfera", "cubo", "suelo", etc.).\
                                    - "model": Nombre del modelo que se desea visualizar (ejemplo: "model": cubo)\
                                    2. Modifica el valor de "scale" basándote en las instrucciones dadas por el usuario. \
                                    Si se menciona "más grande", "más alto", etc., ajusta los valores de x, y, z según la intensidad de la instrucción.\
                                    - "scale": Un objeto con los valores "x", "y" y "z", representando la escala del objeto en A-Frame.(ejemplo: "scale": { "x": 2, "y": 2, "z": 2 })\
                                    3. Modifica los valores de "position" basándote en si el usuario quiere colocar el objeto arriba, abajo, izquierda o derecha (pueden combinarse).\
                                    - "position": Un objeto con los valores "x", "y" y "z", representando la posición del objeto en A-Frame. (ejemplo: position: { "x": 0, "y": 2, "z": 0 })\
                                    4. Modifica los valores de "rotation" basándote en si el usuario quiere rotar el objeto (pueden combinarse).\
                                    - "rotation": Un objeto con los valores "x", "y" y "z", representando la rotación del objeto en A-Frame. (ejemplo: rotation: { "x": 0, "y": 0, "z": 0 })\
                                    "Girar" o "rotar" se refiere a la rotación del objeto en el espacio 3D. Por ejemplo, si el usuario dice "gira a la derecha", puedes ajustar la rotación en el eje Y.\
                                    5. Asigna un valor numérico a "multiplicador" si el usuario menciona "multiplicar" o similares para generar el número especificado de objetos iguales. Si no se menciona\
                                    ningún número asigna uno en función de la frase/preposición del usuario. Si no se menciona nada sobre multiplicar los objetos o generar más del mismo tipo,\
                                    este valor será siempre cero (0)\
                                    6. El estado del objeto vendrá en la entrada en formato JSON después de la instrucción y este se\
                                    deberá modificar para cumplir con las nuevas instrucciones.\
                                    \
                                    7. Los valores modificados de "scale" serán acordes a la intensidad de la instrucción.\
                                    8. La respuesta debe ser un JSON válido sin texto adicional salvo cuando se quiera borrar, en cuyo caso responde simplemente "borrar".\
                                    9. La respuesta con el JSON generado DEBE seguir ESTRICTAMENTE el siguiente formato: { "model": "modelo", "scale": { "x": 2, "y": 2, "z": 2 }}\
                                    10. El modelo solo podrá tener letras minúsculas y no tendrá ninguna tilde.\
                                    11. Si no se menciona ningún modelo, se deberá responder con el modelo que ya tiene el objeto.\
                                    Recuerda que si el usuario solicita borrar la figura, NO se responderá con un JSON, SOLO contesta "borrar".\
                                    Ejemplos de entrada y salida:\
                                    1.\
                                    Entrada: "Quiero tener/generar/crear un xxx { "model": "esfera", "scale": { "x": 4, "y": 4, "z": 4 }}, "position": { "x": 1, "y": 1, "z": 1 }, "rotation: { "x": 0, "y": 0, "z": 0 })"\
                                    Salida: { "model": "xxx", "scale": { "x": 1, "y": 1, "z": 1 }, "position": { "x": 1, "y": 1, "z": 1 }, "rotation: { "x": 0, "y": 0, "z": 0 }, "multiplicador": 0 }\
                                    2.\
                                    Entrada: "Quiero borrar esto"\
                                    Salida: borrar\
                                    3.\
                                    Entrada: "Quiero que sea tremendamente grande { "model": "rex", "scale": { "x": 1, "y": 1, "z": 1 }, "position": { "x": 1, "y": 1, "z": 1 }}, "rotation": { "x": 0, "y": 0, "z": 0 }} \
                                    Salida: { "model": "rex", "scale": { "x": 10, "y": 10, "z": 10 }, "position": { "x": 1, "y": 1, "z": 1 }, "rotation": { "x": 0, "y": 0, "z": 0 }, "multiplicador": 0}\
                                    4.\
                                    Entrada: "Quiero que sea más alto{ "model: "rex", "scale": { "x": 1, "y": 1, "z": 1 }, "position": { "x": 1, "y": 1, "z": 1 }, "rotation: { "x": 0, "y": 0, "z": 0 })"\
                                    Salida: { "model": "rex", "scale": { "x": 1, "y": 2, "z": 1 }, "position": { "x": 1, "y": 1, "z": 1 }, "rotation: { "x": 0, "y": 0, "z": 0 }, "multiplicador": 0}\
                                    5.\
                                    Entrada: "Ponlo en el suelo y genera 10 más { "model": "rex", "scale": { "x": 1, "y": 1, "z": 1 }, "position": { "x": 1, "y": 1, "z": 1 }, "rotation: { "x": 0, "y": 0, "z": 0 }}"\
                                    Salida: { "model": "rex", "scale": { "x": 1, "y": 1, "z": 1 }, "position": { "x": 1, "y": 0, "z": 1 }, "rotation: { "x": 0, "y": 0, "z": 0 }, "multiplicador": 10}\
                                    La lista de modelos disponibles que deberás identificar según el prompt del usuario es la siguiente:\
                                    - "rex", "flor", "dron", "fenix", "dragon", "coche", "boton", "basura", "casa-arbol", "antorcha", "piedra", "madera", "hierba", "casa"\
                                    "ventana", "casa-arbol", "cofre", "abeja", "lampara"'
                                    
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