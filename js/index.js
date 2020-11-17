
const CanvasSizeRate = 0.6;

var light;
var yoko;

onresize = function() {

    if (renderer != undefined) {

        renderer.setSize(window.innerWidth, window.innerWidth * CanvasSizeRate);
    }
};

onInit = function() {

    // Camera
    camera.position.y = 2.5;
    camera.position.z = 7;
    
    // Directional light
    light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.castShadow = true; 
    light.position.set(0, 5, 1);
    scene.add(light);
    
    // Ground
    var groundGeometry = new THREE.PlaneBufferGeometry(5, 5, 8, 8);
    var groundMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotateX(-Math.PI / 2);

    scene.add(ground);

    // Yoko
    loadObject(
        "../obj/yoko/Yoko.obj", 
        "../obj/yoko/textures/EgbertTEX.png", 
        function (obj) {

            yoko = obj;

            const rate = 1.0E-2;
            yoko.scale.set(rate, rate, rate);
            yoko.position.set(0, 0, 0);
            scene.add(obj);
        });
}

onUpdate = function(deltaTime) {

    if (yoko != undefined) {

        yoko.rotation.y += 0.001 * deltaTime;
    }
}

startScene(window.innerWidth, window.innerWidth * CanvasSizeRate);
