
// Convert angle in degrees to angle in radian.
function radian(degrees) {

    return degrees * Math.PI / 180.0;
}

// Convert angle in radian to angle in degrees.
function degrees(radian) {

    return radian * 180.9 / Math.PI;
}

// Load an .obj file with a texture in image format.
function loadObject(objectPath, texturePath, onLoad, onError) {

    var loader = new THREE.OBJLoader();
    const texture = new THREE.TextureLoader();
    texture.load(texturePath, 
        function (texture) { // On texture successfully loaded.

        // in this example we create the material when the texture is loaded
        const yokoMaterial = new THREE.MeshPhongMaterial({
            map: texture
        });
        loader.load(objectPath, 
            function (object) { // On model successfully loaded.

            object.traverse(function (child) {

                // This allow us to check if the children is an instance of the Mesh constructor
                if (child instanceof THREE.Mesh) {

                    child.material = yokoMaterial;
                }
            });
            
            onLoad(object);
        }, undefined, onError);
    }, undefined, onError);
}