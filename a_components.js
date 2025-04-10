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
        creadorLanzador.setAttribute('class', 'clickable');
        

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
        creadorEraser.setAttribute('class', 'clickable');

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
            creador.addEventListener('loaded', () => {
                creador.setAttribute('dynamic-body', {
                    mass: 2,
                    linearDamping: 0.5,
                    angularDamping: 0.7,
                });
            });
            creador.setAttribute('draggable', '');
            creador.setAttribute('class', 'clickable'); 
            el.appendChild(creador); 
            actualizarAtributos();
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

AFRAME.registerComponent('camera-height-control', {
    schema: {
        speed: { default: 0.05 }
    },
    init: function () {
        this.up = false;
        this.down = false;
        window.addEventListener('keydown', e => {
            if (e.code === 'Space') this.up = true;
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.down = true;
        });
        window.addEventListener('keyup', e => {
            if (e.code === 'Space') this.up = false;
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.down = false;
        });
    },
    tick: function () {
        const pos = this.el.object3D.position;
        if (this.up) pos.y += this.data.speed;
        if (this.down) pos.y -= this.data.speed;
    }
});
AFRAME.registerComponent('draggable', {
    init: function () {
        this.grabbed = false;
        this.initialDepth = 0;
        this.initialPosition = new THREE.Vector3();
        this.offset = new THREE.Vector3();

        this.el.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.dragMove.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));

        this.el.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('touchmove', this.dragMove.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));

        this.el.addEventListener('body-loaded', () => {
            this.body = this.el.body;
        });
    },

    startDrag: function (evt) {
        if (this.grabbed) return;

        this.grabbed = true;
        this.el.classList.add('grabbed');

        this.initialPosition.copy(this.el.object3D.position);
        const cameraPosition = this.el.sceneEl.camera.el.object3D.position;
        this.initialDepth = this.initialPosition.distanceTo(cameraPosition);

        if (evt.detail?.intersection) {
            this.offset.copy(this.el.object3D.position).sub(evt.detail.intersection.point);
        } else {
            this.offset.set(0, 0, 0);
        }

        if (this.body) {
            this.body.sleep();
            this.body.collisionFilterGroup = 0;
            this.body.collisionFilterMask = 0;
        }
    },

    dragMove: function (evt) {
        if (!this.grabbed) return;

        const mouse = this.getMousePosition(evt);
        const scene = this.el.sceneEl;
        const camera = scene.camera;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const distance = this.initialDepth || 3;
        const newPosition = raycaster.ray.origin.clone().add(
            raycaster.ray.direction.clone().multiplyScalar(distance)
        ).add(this.offset);

        this.el.object3D.position.copy(newPosition);

        if (this.body) {
            this.body.position.copy(newPosition);
            this.body.velocity.set(0, 0, 0);
            this.body.angularVelocity.set(0, 0, 0);
            this.body.updateMatrixWorld();
        }

        this.el.object3D.updateMatrixWorld(true);
    },

    stopDrag: function () {
        if (!this.grabbed) return;

        this.grabbed = false;
        this.el.classList.remove('grabbed');

        if (this.body) {
            this.body.wakeUp();
            this.body.collisionFilterGroup = 1;
            this.body.collisionFilterMask = 1;
            this.body.updateMatrixWorld();
        }
    },

    getMousePosition: function (evt) {
        const mouse = new THREE.Vector2();
        const canvas = this.el.sceneEl.canvas;

        if (evt.type.includes('touch')) {
            const touch = evt.touches[0] || evt.changedTouches[0];
            mouse.x = (touch.clientX / canvas.clientWidth) * 2 - 1;
            mouse.y = -(touch.clientY / canvas.clientHeight) * 2 + 1;
        } else {
            mouse.x = (evt.clientX / canvas.clientWidth) * 2 - 1;
            mouse.y = -(evt.clientY / canvas.clientHeight) * 2 + 1;
        }

        return mouse;
    }
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