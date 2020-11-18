
const CanvasSizeRate = 0.6;
const YokoSize = 0.007;
const Colors = {
    Sky: 0xFFE173,
    Ground: 0xAD6E00,
    Road: 0xD99E36,
};
const CameraPosition = {
    Theta: radian(240.0),
    Distance: 5.0,
    Height: 3.0,
    FocusDistance: 10.0,
};

var light = undefined;
var ground = undefined;
var road = undefined;
var yoko = undefined;

onresize = function() {

    if (renderer != undefined) {

        renderer.setSize(window.innerWidth, window.innerWidth * CanvasSizeRate);
    }
};

onInit = function() {

    // Scene
    scene.background = new THREE.Color(Colors.Sky);

    // Camera
    camera.position.set(
        Math.cos(CameraPosition.Theta) * CameraPosition.Distance, 
        CameraPosition.Height, 
        Math.sin(CameraPosition.Theta) * CameraPosition.Distance);
    camera.lookAt(0, 0, CameraPosition.FocusDistance);

    // Directional light
    light = new THREE.DirectionalLight(Colors.Sky, 1.2);
    light.castShadow = true; 
    light.position.set(-10, 12, 0);
    scene.add(light);
    
    // Ground
    var groundGeometry = new THREE.PlaneBufferGeometry(10000, 10000, 8, 8);
    var groundMaterial = new THREE.MeshPhongMaterial({ color: Colors.Ground });
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotateX(Math.PI / -2.0);
    ground.castShadow = true; //default is false
    ground.receiveShadow = true; //default
    scene.add(ground);
    
    // Road
    var roadGeometry = new THREE.BoxGeometry(5, 10000, 0.2);
    var roadMaterial = new THREE.MeshPhongMaterial({ color: Colors.Road });
    road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.castShadow = true; //default is false
    road.receiveShadow = true; //default     
    road.rotation.set(Math.PI / -2.0, 0, 0);

    scene.add(road);

    // Yoko
    loadObject(
        "../obj/yoko/Yoko.obj", 
        "../obj/yoko/textures/EgbertTEX.png", 
        function (objects) {

            yoko = objects.children[0];

            const rate = YokoSize;
            yoko.scale.set(rate, rate, rate);
            yoko.rotation.set(0, Math.PI / 2, 0);
            yoko.position.set(0.5, 0, 0);

            yoko.castShadow = true;
            yoko.receiveShadow = true;

            scene.add(yoko);
        });
}

onUpdate = function(deltaTime) {

    if (yoko != undefined) {

        yoko.position.z += 0.005 * deltaTime;
    }
};

startScene(window.innerWidth, window.innerWidth * CanvasSizeRate);
