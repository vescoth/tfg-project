import { startEdit } from "./functions.js";

let creation_id = 0;

AFRAME.registerComponent('collect-id-on-click', {
    init: function () {
        this.el.addEventListener('click', () => {
            const elementId = this.el.getAttribute('id');
            console.log('ID del objeto:', elementId);
            // Aquí puedes agregar cualquier lógica adicional que necesites
        });
    }
});

AFRAME.registerComponent('creador-ui', {
    init: function () {
        console.log('Creando UI');
        const el = this.el;
        const creadorLanzador = document.createElement('a-entity');
        creadorLanzador.setAttribute('id', 'lanzador');
        creadorLanzador.setAttribute('position', '0 0 0');
        creadorLanzador.setAttribute('scale', '5 5 5');
        creadorLanzador.setAttribute('rotation', '-1 0 -1');
        creadorLanzador.setAttribute('gltf-model', "#button");
        creadorLanzador.setAttribute('creador-lanzador', '');
        el.appendChild(creadorLanzador);
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