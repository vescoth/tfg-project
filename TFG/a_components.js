import { startEdit, actualizarAtributos, borrarTodo, creation_id } from "./functions.js";

AFRAME.registerComponent('creador-ui', {
    init: function () {
        console.log('Creando UI');
        const el = this.el;
        const creadorLanzador = document.createElement('a-entity');
        const creadorSaver = document.createElement('a-entity');

        // Crear botón lanzador
        creadorLanzador.setAttribute('id', 'lanzador');
        creadorLanzador.setAttribute('position', '0 0 0');
        creadorLanzador.setAttribute('scale', '5 5 5');
        creadorLanzador.setAttribute('rotation', '-1 0 -1');
        creadorLanzador.setAttribute('gltf-model', "#button");
        creadorLanzador.setAttribute('creador-lanzador', '');

        // Crear señal de lanzador
        const señalLanzador = document.createElement('a-entity');
        señalLanzador.setAttribute('id', 'señal-lanzador');
        señalLanzador.setAttribute('position', '0 5 0');
        señalLanzador.setAttribute('scale', '1 1 1');
        señalLanzador.setAttribute('gltf-model', '#fluido');
        señalLanzador.setAttribute('animation-mixer', '');

        // Crear botón saver
        creadorSaver.setAttribute('id', 'saver');
        creadorSaver.setAttribute('position', '-10 0 0');
        creadorSaver.setAttribute('scale', '5 5 5');
        creadorSaver.setAttribute('rotation', '-1 0 -1');
        creadorSaver.setAttribute('gltf-model', "#button");
        creadorSaver.setAttribute('saver', '');

        // Crear señal de saver
        const señalSaver = document.createElement('a-entity');
        señalSaver.setAttribute('id', 'señal-saver');
        señalSaver.setAttribute('position', '-10 5 0');
        señalSaver.setAttribute('scale', '20 20 20');
        señalSaver.setAttribute('gltf-model', '#cd');
        señalSaver.setAttribute('animation-mixer', '');

        // Crear botón de borrar
        const creadorEraser = document.createElement('a-entity');
        creadorEraser.setAttribute('id', 'borrar');
        creadorEraser.setAttribute('position', '10 0 0');
        creadorEraser.setAttribute('scale', '5 5 5');
        creadorEraser.setAttribute('rotation', '-1 0 -1');
        creadorEraser.setAttribute('gltf-model', "#button");
        creadorEraser.setAttribute('eraser', '');

        // Crear señal de borrar
        const señalBorrar = document.createElement('a-entity');
        señalBorrar.setAttribute('id', 'señal-borrar');
        señalBorrar.setAttribute('position', '10 4 0');
        señalBorrar.setAttribute('gltf-model', "#basura");
        señalBorrar.setAttribute('rotation', '0 90 0');
        señalBorrar.setAttribute('scale', '0.005 0.005 0.005');
        señalBorrar.setAttribute('animation-mixer', '');



        // Agregar elementos a la escena
        el.appendChild(creadorLanzador);
        el.appendChild(señalLanzador);
        el.appendChild(creadorSaver);
        el.appendChild(señalSaver);
        el.appendChild(creadorEraser);
        el.appendChild(señalBorrar);
    }
});

AFRAME.registerComponent("creador-lanzador", {
    init: function () {
        console.log('Creando lanzador');
        const el = this.el;
        const modelo = "#fluido";
        const scale = '1 1 1';
        const position = this.el.getAttribute('position');
        console.log('Posición del lanzador:', position);
        console.log('Elemento lanzador:', el);
        this.el.addEventListener("click", () => {
            const creador = document.createElement("a-entity");
            creador.setAttribute('id', `${creation_id}`);
            creador.setAttribute('gltf-model', modelo);
            creador.setAttribute('position', '0 2 -5');
            creador.setAttribute('scale', scale);
            creador.setAttribute('animation-mixer', '');
            creador.setAttribute('creador', '');
            el.appendChild(creador);
            creation_id++;
        });
    },
});

AFRAME.registerComponent("saver", {
    init: function () {
        console.log('Creando saver');
        this.el.addEventListener("click", () => {
            actualizarAtributos();
            const scene = document.getElementById('lanzador').innerHTML;
            const sceneBlob = new Blob([scene], { type: 'text/plain' });
            const sceneURL = URL.createObjectURL(sceneBlob);
            const sceneLink = document.createElement('a');
            sceneLink.href = sceneURL;
            sceneLink.download = 'mi-escena.html';
            sceneLink.click();
        });
    },
});

AFRAME.registerComponent("eraser", {
    init: function () {
        console.log('Creando eraser');
        this.el.addEventListener("click", () => {
            borrarTodo();
        });
    },
});

AFRAME.registerComponent("creador", {
    init: function () {
        console.log('Creando objeto');
        console.log('Elemento objeto:', this.el);
        this.el.addEventListener("click", (event) => {
            event.stopPropagation();
            const elementId = this.el.getAttribute('id');
            console.log('ID del objeto:', elementId);
            startEdit(elementId);
        });
    },
});