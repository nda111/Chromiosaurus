
// Convert angle in degrees to angle in radian.
function radian(degrees) {

    return degrees * Math.PI / 180.0;
}

// Convert angle in radian to angle in degrees.
function degrees(radian) {

    return radian * 180.0 / Math.PI;
}

/**
 * Mix the two color with their ratio.
 * 
 * @param {*} c1 
 * @param {*} c2 
 * @param {*} rate 
 */
function mixColor(c1, c2, rate) {

    console.assert(0 <= rate && rate <= 1);

    const _rate = 1 - rate;

    r1 = (c1 >> 16) & 0xFF;
    g1 = (c1 >> 8) & 0xFF;
    b1 = c1 & 0xFF;

    r2 = (c2 >> 16) & 0xFF;
    g2 = (c2 >> 8) & 0xFF;
    b2 = c2 & 0xFF;

    r3 = r1 * rate + r2 * _rate;
    g3 = g1 * rate + g2 * _rate;
    b3 = b1 * rate + b2 * _rate;

    return (r3 << 16) | (g3 << 8) | b3;
}

// Load an .obj file with a texture in image format.
function loadObject(objectPath, texturePath, onLoad, onError) {

    var loader = new THREE.OBJLoader();
    const texture = new THREE.TextureLoader();
    texture.load(texturePath, 
        function (texture) { // On texture successfully loaded.

        // In this example we create the material when the texture is loaded
        const yokoMaterial = new THREE.MeshPhongMaterial({
            map: texture
        });
        loader.load(objectPath, 
            function (objects) { // On model successfully loaded.

            objects.traverse(function (child) {

                // This allow us to check if the children is an instance of the Mesh constructor
                if (child instanceof THREE.Mesh) {

                    child.material = yokoMaterial;
                }
            });
            
            onLoad(objects);
        }, undefined, onError);
    }, undefined, onError);
}

// Load an .glb file and execute onLoad(gltf), onError(error)
// gltf.scene -> model, gltf.animations -> animations
function loadGLB(glbPath, onLoad, onError) {

    const loader = new THREE.GLTFLoader();
    loader.load(glbPath, onLoad, undefined, onError);
}
