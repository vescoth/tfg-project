import { startEdit, actualizarAtributos, borrarTodo, state } from "./functions.js";

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
        this.el.addEventListener("click", (event) => {
            event.stopPropagation(); // Evitar que el evento se propague a otros elementos
            console.log('Evento click en lanzador activado');
            const creador = document.createElement("a-entity");
            creador.setAttribute('id', `${state.creation_id}`);
            creador.setAttribute('gltf-model', modelo);
            creador.setAttribute('position', '0 2 -5');
            creador.setAttribute('scale', scale);
            creador.setAttribute('rotation', '0 0 0');
            creador.setAttribute('animation-mixer', '');
            creador.setAttribute('creador', '');
            el.appendChild(creador); // Agregar el creador a la escena en lugar del lanzador
            state.creation_id += 1;
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
        });
        this.el.addEventListener("mousedown", (event) => {
            console.log('Evento onmousedown activado');
            event.stopPropagation();
            const elementId = this.el.getAttribute('id');
            console.log('ID del objeto:', elementId);
            startEdit(elementId);
        });
    },
});

// AFRAME.registerComponent('mobile-touch-move', {
//     init: function () {
//     const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
//     if (!isMobile) {
//       console.log("Emulando entorno móvil en el navegador del ordenador.");
//       navigator.__defineGetter__('userAgent', function () {
//         return "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";
//       });
//     }

//       const el = this.el;
//       const moveSpeed = 0.05;
//       let touchInterval = null;

//       function moveCamera(direction = 1) {
//         const dir = new THREE.Vector3();
//         el.object3D.getWorldDirection(dir);
//         el.object3D.position.addScaledVector(dir, moveSpeed * direction);
//       }

//       function startMoving(touches) {
//         let direction = 0;
//         if (touches === 1) direction = -1;
//         else if (touches === 2) direction = 1;
//         if (direction !== 0) {
//           touchInterval = setInterval(() => moveCamera(direction), 1);
//         }
//       }

//       function stopMoving() {
//         clearInterval(touchInterval);
//         touchInterval = null;
//       }

//       window.addEventListener('touchstart', (e) => {
//         if (!touchInterval) {
//           startMoving(e.touches.length);
//         }
//       });

//       window.addEventListener('touchend', stopMoving);
//       window.addEventListener('touchcancel', stopMoving);
//     }
//   });