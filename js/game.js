
var scene;
var camera;
var renderer = undefined;

var prevTime = undefined;
var interval = undefined;

var onInit = undefined;
var onUpdate = undefined;


function startScene(width, height, fps = 60) {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    if (onInit != undefined) {

        onInit();
    }

    prevTime = Date.now();
    setFrameRate(fps);
}

function onFrame() {

    const now = Date.now();
    const elapsed = now - prevTime;
    prevTime = now;

    if (onUpdate != undefined) {
    
        onUpdate(elapsed);
    }

    renderer.render(scene, camera);
}

function setFrameRate(fps) {

    if (interval != undefined) {

        clearInterval(interval);
    }

    interval = setInterval(onFrame, 1000 / fps);
}
