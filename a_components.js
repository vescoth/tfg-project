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
        creadorLanzador.setAttribute('scale', '1 1 1');
        creadorLanzador.setAttribute('rotation', '-1 0 -1');
        creadorLanzador.setAttribute('gltf-model', "#button");
        creadorLanzador.setAttribute('creador-lanzador', '');
        creadorLanzador.setAttribute('class', 'clickable');


        // Crear señal de lanzador
        const señalLanzador = document.createElement('a-entity');
        señalLanzador.setAttribute('id', 'señal-lanzador');
        señalLanzador.setAttribute('position', '0 1 0');
        señalLanzador.setAttribute('scale', '0.1 0.1 0.1');
        señalLanzador.setAttribute('gltf-model', '#fluido');
        señalLanzador.setAttribute('animation-mixer', '');

        // Crear botón saver
        creadorSaver.setAttribute('id', 'saver');
        creadorSaver.setAttribute('position', '-1 0 0');
        creadorSaver.setAttribute('scale', '1 1 1');
        creadorSaver.setAttribute('rotation', '-1 0 -1');
        creadorSaver.setAttribute('gltf-model', "#button");
        creadorSaver.setAttribute('saver', '');
        creadorSaver.setAttribute('class', 'clickable');
        
        // Crear señal de saver
        const señalSaver = document.createElement('a-entity');
        señalSaver.setAttribute('id', 'señal-saver');
        señalSaver.setAttribute('position', '-1 1 0');
        señalSaver.setAttribute('scale', '2 2 2');
        señalSaver.setAttribute('gltf-model', '#cd');
        señalSaver.setAttribute('animation-mixer', '');

        // Crear botón de borrar
        const creadorEraser = document.createElement('a-entity');
        creadorEraser.setAttribute('id', 'borrar');
        creadorEraser.setAttribute('position', '1 0 0');
        creadorEraser.setAttribute('scale', '1 1 1');
        creadorEraser.setAttribute('rotation', '-1 0 -1');
        creadorEraser.setAttribute('gltf-model', "#button");
        creadorEraser.setAttribute('eraser', '');
        creadorEraser.setAttribute('class', 'clickable');

        // Crear señal de borrar
        const señalBorrar = document.createElement('a-entity');
        señalBorrar.setAttribute('id', 'señal-borrar');
        señalBorrar.setAttribute('position', '1 1 0');
        señalBorrar.setAttribute('gltf-model', "#basura");
        señalBorrar.setAttribute('rotation', '0 90 0');
        señalBorrar.setAttribute('scale', '0.0005 0.0005 0.0005');
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
            creador.setAttribute('draggable', '');
            creador.setAttribute('class', 'clickable');
            el.appendChild(creador);
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
        this.el.addEventListener("mousedown", async (event) => {
            console.log('Evento onmousedown activado');
            event.stopPropagation();
            const elementId = this.el.getAttribute('id');
            console.log('ID del objeto:', elementId);
            await startEdit(elementId);
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
        this.offset = new THREE.Vector3();
        this.cursor = document.querySelector('#gaze-cursor'); // Cursor central
        this.camera = document.querySelector('[camera]');

        // Iniciar arrastre
        this.el.addEventListener('mousedown', this.startDrag.bind(this));
        this.el.addEventListener('touchstart', this.startDrag.bind(this));

        // Terminar arrastre
        this.el.sceneEl.addEventListener('mouseup', this.stopDrag.bind(this));
        this.el.sceneEl.addEventListener('touchend', this.stopDrag.bind(this));

        this.el.addEventListener('body-loaded', () => {
            this.body = this.el.body;
        });
    },

    startDrag: function (evt) {
        if (this.grabbed) return;

        const intersects = this.cursor.components.raycaster.intersections;
        if (!intersects || intersects.length === 0 || intersects[0].object.el !== this.el) return;

        this.grabbed = true;
        this.el.classList.add('grabbed');

        const intersectionPoint = intersects[0].point;
        const objectPosition = this.el.object3D.position;

        this.offset.copy(objectPosition).sub(intersectionPoint);

        const cameraPos = new THREE.Vector3();
        this.camera.object3D.getWorldPosition(cameraPos);
        this.initialDepth = intersectionPoint.distanceTo(cameraPos);

        if (this.body) {
            this.body.sleep();
            this.body.collisionFilterGroup = 0;
            this.body.collisionFilterMask = 0;
        }
    },

    tick: function () {
        if (!this.grabbed) return;

        const raycaster = this.cursor.components.raycaster.raycaster;
        if (!raycaster) return;

        const targetPoint = raycaster.ray.origin.clone().add(
            raycaster.ray.direction.clone().multiplyScalar(this.initialDepth)
        ).add(this.offset);

        this.el.object3D.position.copy(targetPoint);
        this.el.object3D.updateMatrixWorld(true);

        if (this.body) {
            this.body.position.copy(targetPoint);
            this.body.velocity.set(0, 0, 0);
            this.body.angularVelocity.set(0, 0, 0);
        }
    },

    stopDrag: function () {
        if (!this.grabbed) return;

        this.grabbed = false;
        this.el.classList.remove('grabbed');

        if (this.body) {
            this.body.wakeUp();
            this.body.collisionFilterGroup = 1;
            this.body.collisionFilterMask = 1;
        }
    }
});