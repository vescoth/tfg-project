import { state } from './global.js';


export function actualizarAtributos() {
    console.log("Actualizando atributos...");
    const lanzador = document.getElementById('lanzador');
    lanzador.flushToDOM(true);
    console.log("Atributos actualizados.");
}

function updateId(htmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const entities = doc.querySelectorAll('a-entity[id]');
    if (entities.length > 0) {
        const lastEntity = entities[entities.length - 1];
        console.log("Último elemento id:", lastEntity.getAttribute('id'));
        let id_int = parseInt(lastEntity.getAttribute('id'));
        console.log("Último id:", id_int);
        let updated_id = id_int + 1;
        return updated_id;
    } else {
        return null;
    }
}

export async function cargarEscenaGuardada() {
    let scene = document.getElementById("lanzador").innerHTML;
    console.log("Cargando escena guardada...", scene);
    scene = "";
    const sceneFile = "mi-escena.html";
    try {
        const response = await fetch(sceneFile);
        if (response.ok) {
            const text = await response.text();
            state.creation_id = updateId(text);
            document.getElementById("lanzador").innerHTML = text;
            console.log("Escena cargada correctamente.");
        } else {
            console.log("No se encontró una escena guardada.");
        }
    } catch (error) {
        console.error("Error al cargar la escena:", error);
    }
}

document.querySelector("a-scene").addEventListener('loaded', cargarEscenaGuardada); // Cargar la escena guardada al cargar la página