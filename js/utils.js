
/**
 * 60분법 각을 라디안 각으로 변환한다.
 * 
 * @param {number} degrees 60분법 각도
 */
function radian(degrees) {

    return degrees * Math.PI / 180.0;
}

/**
 * 라디안 각을 60분법 각으로 변환한다.
 * 
 * @param {number} radian 라디안 각도
 */
function degrees(radian) {

    return radian * 180.0 / Math.PI;
}

/**
 * 두 개의 색을 {c1} : {c2} = {rate} : {1-rate} 비율로 섞는다
 * 
 * @param {number} c1 첫 번째 색상 (0xRRGGBB)
 * @param {number} c2 두 번째 색상 (0xRRGGBB)
 * @param {number} rate 첫 번째 색상의 혼합 비율
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

/**
 * 약간 투명해진 색상 코드를 "#AARRGGBB" 형식의 문자열로 변환한다.
 * 
 * @param {number} color 
 */
function getTransparentColorString(color) {

    const HexChars = "0123456789ABCDEF";

    const values = [
        (color >> 24) & 0xFF,
        (color >> 16) & 0xFF,
        (color >> 8) & 0xFF,
        (color >> 0) & 0xFF,
    ];

    var result = "#";
    for (let value of values) {

        result += HexChars[value >> 4];
        result += HexChars[value & 0xF];
    }

    return result;
}

/**
 * .obj파일을 이미지 형식의 텍스쳐와 함께 불러온다.
 * 
 * @param {String} objectPath .obj 파일의 상대 혹은 절대경로
 * @param {String} texturePath 텍스쳐 파일의 상대 혹은 절대경로
 * @param {Function} onLoad .obj 파일을 읽은 후 - function (object)
 * @param {Function} onError 파일 읽기에 실패한 후 - function (error)
 */
function loadObject(objectPath, texturePath, onLoad, onError) {

    return new Promise(resolve => {
        new THREE.TextureLoader().load(texturePath,
            function (texture) { 

                const material = new THREE.MeshPhongMaterial({
                    map: texture
                });
                new THREE.OBJLoader().load(objectPath,
                    function (objects) { 

                        objects.traverse(function (child) {

                            // This allow us to check if the children is an instance of the Mesh constructor
                            if (child instanceof THREE.Mesh) {

                                child.material = material;
                            }
                        });

                        onLoad(objects);
                        resolve();
                    }, undefined, onError);
            }, undefined, onError);
    });
}


/**
 * .glb 파일을 불러온다.
 *
 * @param {String} glbPath .glb 파일의 상대 혹은 절대경로
 * @param {Function} onLoad .glb 파일을 읽은 후 - function (object)
 * @param {Function} onError 파일 읽기에 실패한 후 - function (error)
 */
function loadGLB(glbPath, onLoad, onError) {

    return new Promise(resolve => {

        new THREE.GLTFLoader().load(glbPath, function (obj) {

            onLoad(obj);
            resolve();
        }, undefined, onError);
    });
}
