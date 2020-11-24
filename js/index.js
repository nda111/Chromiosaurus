
// #region 게임 설정값
const MaxCoordZ = 100; // 그림자가 정상적으로 발생하는 범위. if (coord >= MaxCoord) coord -= MaxCoord;
const ObstacleRenderDistance = 100; // 장애물 생성 거리

const ObstacleGenDelay = 2.0;   // 장애물 생성 시간 간격 (초)
const DecorationGenDelay = 0.5; // 장식물 생성 시간 간격 (초)

const DecorationHorizontalRegion = [-50.0, 100.0] // 장식물이 생성되는 범위
const DecorationVerticalBias = 3.0;
const MinDecorationsPerRow = 1; // 한 번에 생성되는 최소 장식물 수
const MaxDecorationsPerRow = 5; // 한 번에 생성되는 최대 장식물 수

const ObjectDisposeThreshold = -10.0; // 장애물, 데코를 폐기하는 좌표

const RoadWidth = 10.0; // 길 너비
const CanvasSizeRate = 0.6; // 캔버스의 세로/가로 비율
const Pallete = { // 게임에 사용되는 색상 리스트
    Sky: { // 하늘 색
        Day: 0xFFE173,    // 낮 하늘 색
        Night: 0x0E1626,  // 밤 하늘 색
    },
    Light: { // 빛 색
        Sun: 0xFFE173,      // 햇빛
        Moon: 0xCCFFFF,     // 달빛
        Flash: 0xFFFFFF,    // 조명
    },
    Ground: 0xAD6E00, // 길 외의 바닥 색
    Road: 0xD99E36,   // 길 색
};
const CameraPosition = { // 캐릭터에 상대적인 카메라 좌표를 설정하는 파라미터
    Distance: 13.0,         // 카메라와 캐릭터 사이의 거리
    Theta: radian(230.0),   // zx평면에 대한 극좌표
    Phi: radian(40.0),      // (zx)y 평면에 대한 극좌표
    FocusDistance: 10.0,    // lookAt(0, 0, FocusDistance)
};
const FlashLightSetup = { // 밤에 보이는 플래시라이트 좌표 설정
    Offset: [0.0, 3.0, 1.0],        // 카메라에 상대적인 플래시라이트 좌표
    TargetOffset: [0.0, -1.0, 1.0], // 플래시라이트에 상대적인 타겟 상대좌표
};

var RunningDuration = -1; // 달리기 애니메이션 주기

// #endregion
 
// #region 전역 변수
// three.js 오브젝트
var sunLight = undefined;   // 빛 객체: PointLight
var moonLight = undefined;  // 빛 객체: DirectionalLight
var flashLight = undefined; // 빛 객체: SpotLight
var ground = undefined; // 길이 아닌 바닥 객체: PlaneBufferGeometry
var road = undefined;   // 길 객체: BoxGeometry
var robot = { // 로봇 객체의 데이터 집합
    model: undefined,       // 모델 그룹: Group
    animations: undefined,  // 애니메이션 집합: Clip[]
};
var animationMixer = undefined; // 애니메이션 믹서
var currentAction = undefined;  // 현재 실행 중인 애니메이션

// 게임 플레이 관련
var speed = 15; // 플레이어 달리기 속도 (1.0/초)
var jumpTime = -Infinity; // 점프 시작 시간
var jumpFlag = false; // true라면 점프 중, 아니라면 false
var jumpDuration = 0.5; // 점프 지속 시간 (밀리초)

// 장애물, 데코 등 모델
var cactus = undefined;
var rocks = [];
var decoRocks = [];

// 장애물, 데코레이션 큐
var obstacleTimer = 0;
var decoTimer = 0;
var obstacles = new THREE.Group();
var decorations = new THREE.Group();

// #endregion

// #region 유틸리티 함수
 /**
  * 애니메이션을 자연스럽게 전환한다.
  * @param {number} i 다음에 실행할 애니메이션의 인덱스
  * @param {number} duration 애니메이션 fading 시간
  */
function fadeToAction(i, duration) {

    const clip = robot.animations[i];

    previousAction = currentAction;
    currentAction = mixer.clipAction(clip);
    currentAction.clampWhenFinished = true;

    if (previousAction !== currentAction) {

        // 애니메이션을 전환하는 경우, 이전 애니메이션을 부드럽게 종료
        previousAction.fadeOut(duration);
    }

    // 새로운 애니메이션을 시작
    currentAction
        .reset() 
        .setEffectiveTimeScale(1) 
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();
}

/**
 * 그림자가 생성되는 범위를 벗어나지 않도록 좌표를 조정한다.
 * 
 * @param {number} pos 조정 이전의 좌표 값
 */
function loopPosition(pos) {

    if (pos >= MaxCoordZ) {

        return pos - MaxCoordZ;
    } else {

        return pos;
    }
}

/**
 * 점프할 때 시간에 따른 높이 값을 계산한다.
 * 
 * @param {number} time 점프 이벤트 이후 시간
 */
function getJumpHeight() {

    const max_height = 5;
    const duration_half = jumpDuration / 2.0;

    const time = playTime - jumpTime;
    if (time > jumpDuration) {

        jumpFlag = false;
        return 0;
    }
    
    const sq = (time % jumpDuration) - duration_half;
    return (-max_height * 4 / (jumpDuration * jumpDuration)) * sq * sq + max_height;
}

/**
 * 윈도우 크기가 조정되면 캔버스 크기를 비율에 맞게 조정한다.
 */
onresize = function() {

    if (renderer != undefined) {

        renderer.setSize(window.innerWidth, window.innerWidth * CanvasSizeRate);
    }
};

/**
 * 키보드가 눌렸을 때 발생하는 이벤트
 */
onkeydown = function(e) {

    switch (e.code) {

        case "Space": // 스페이스바를 누르면 점프함
            if (jumpFlag == false) {

                jumpTime = playTime; 
            }
            jumpFlag = true;
            break;

        default:
            break;
    }
}

//#endregion

// #region 게임 이벤트
/**
 * 게임이 시작될 때 오브젝트를 초기화한다.
 */
onInit = function(done) {

    /// 리소스 모델을 불러온다.
    const errorHandler = function (error) { console.error(error); };
    // Robot
    const proms = [
        loadGLB(
            "../obj/robot.glb",
            function (gltf) {

                robot.model = gltf.scene;
                robot.animations = gltf.animations;

                robot.model.traverse(function (child) {

                    if (child instanceof THREE.Mesh) {

                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
            }, errorHandler),

        // Cactus
        loadObject(
            "../obj/cactus/model.obj",
            "../obj/cactus/textures/SmallCactus4_default_albedo.jpeg",
            function (object) {

                const scale = 3.5;

                cactus = object.children[2];
                cactus.scale.set(scale, scale, scale);
                cactus.position.set(-1.5, 0, 0);

                cactus.castShadow = true;
                cactus.receiveShadow = true;
            }, errorHandler),

        // Rocks
        loadObject(
            "../obj/rock2/RockPackByPava.obj",
            "../obj/rock2/GreyRockTexture.png",
            function (object) {

                const s = 3.5;
                for (let i = 0; i < object.children.length; i++) {

                    let rock = object.children[i];

                    if (rock instanceof THREE.Mesh) {

                        rock.castShadow = true;
                        rock.receiveShadow = true;

                        decoRocks.push(rock.clone());
                        
                        rock.scale.set(s * (Math.random() + 1), s, s);
                        rock.position.set(0, 1, 0);
                        rocks.push(rock);
                    }
                }
            }, errorHandler)
    ];
    
    Promise.all(proms).then(_ => {

        // Scene
        scene.background = new THREE.Color(Pallete.Sky.Night);

        // Camera
        const cosTheta = Math.cos(CameraPosition.Theta);
        const sinTheta = Math.sin(CameraPosition.Theta);
        const cosPhi = Math.cos(CameraPosition.Phi);
        const sinPhi = Math.sin(CameraPosition.Phi);
        camera.position.set(
            CameraPosition.Distance * sinTheta * cosPhi,
            CameraPosition.Distance * sinPhi,
            CameraPosition.Distance * cosTheta * cosPhi);
        CameraPosition.z = camera.position.z;
        camera.lookAt(0, 0, CameraPosition.FocusDistance);

        // Point light: Sun
        sunLight = new THREE.PointLight(Pallete.Light.Sun, 1.2);
        sunLight.castShadow = true;
        sunLight.position.set(-10, 12, 0);
        sunLight.shadow.camera.left = 0;
        sunLight.shadow.camera.right = MaxCoordZ / 2.0 + ObstacleRenderDistance;
        sunLight.shadow.camera.top = 1000;
        sunLight.shadow.camera.bottom = -1000;
        sunLight.shadow.mapSize.width = 2048;
        scene.add(sunLight);

        // Directional Light: Moon
        moonLight = new THREE.DirectionalLight(Pallete.Light.Moon, 0.3);
        moonLight.castShadow = true;
        moonLight.shadow.camera.left = MaxCoordZ / 2.0;
        moonLight.shadow.camera.right = MaxCoordZ + ObstacleRenderDistance;
        moonLight.shadow.camera.top = 1000;
        moonLight.shadow.camera.bottom = -1000;
        scene.add(moonLight);

        // Spot Light: Flash
        const lightPos = new THREE.Vector3(FlashLightSetup.Offset[0], FlashLightSetup.Offset[1], FlashLightSetup.Offset[2]);
        const targetPos = new THREE.Vector3(lightPos.x, lightPos.y - 1.0, lightPos.z + 1.0);
        flashLight = new THREE.SpotLight(Pallete.Light.Flash, 1.0);
        flashLight.castShadow = true;
        flashLight.position.set(lightPos.x, lightPos.y, lightPos.z);
        flashLight.target.position.set(targetPos.x, targetPos.y, targetPos.z);
        flashLight.angle = radian(55);
        flashLight.distance = 60.0;
        flashLight.shadow.camera.left = MaxCoordZ / 2.0;
        flashLight.shadow.camera.right = MaxCoordZ + ObstacleRenderDistance;
        flashLight.shadow.camera.top = 1000;
        flashLight.shadow.camera.bottom = -1000;
        scene.add(flashLight);
        scene.add(flashLight.target);

        // Ground
        var groundGeometry = new THREE.PlaneBufferGeometry(10000, 10000, 8, 8);
        var groundMaterial = new THREE.MeshPhongMaterial({
            color: Pallete.Ground
        });
        ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotateX(Math.PI / -2.0);
        ground.castShadow = true; //default is false
        ground.receiveShadow = true; //default
        scene.add(ground);

        // Road
        var roadGeometry = new THREE.BoxGeometry(RoadWidth, 10000, 0.2);
        var roadMaterial = new THREE.MeshPhongMaterial({
            color: Pallete.Road
        });
        road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.castShadow = true; //default is false
        road.receiveShadow = true; //default     
        road.rotation.set(Math.PI / -2.0, 0, 0);
        scene.add(road);

        // Robot
        const clip = robot.animations[6]; // 달리기 애니메이션
        RunningDuration = clip.duration;
        animationMixer = new THREE.AnimationMixer(robot.model);
        currentAction = animationMixer.clipAction(clip);
        currentAction.clampWhenFinished = true;
        currentAction.play();
        scene.add(robot.model);

        // Obstacles, Decorations
        scene.add(obstacles);
        scene.add(decorations);

        done();
    });
};

/**
 * 프레임마다 오브젝트를 업데이트한다.
 * 
 * @param {number} deltaTime 이전 프레임 이후 지난 시간 (초)
 */
onUpdate = function(deltaTime) {

    // 애니메이션 업데이트
    animationMixer.update(deltaTime);

    // 플레이어 위치 계산
    const yPos = getJumpHeight();
    var zPos = speed * deltaTime + robot.model.position.z;

    // 장애물, 데코 추가
    const newObjectCoordZ = zPos + ObstacleRenderDistance;
    obstacleTimer += deltaTime;
    decoTimer += deltaTime;
    if (obstacleTimer > ObstacleGenDelay) { // 타이머가 종료되면

        // 타이머를 초기화하고
        obstacleTimer -= ObstacleGenDelay;

        let obj;
        let bCactus = Math.random() >= 0.7;
        if (bCactus) { // 50% 확률로 선인장

            obj = cactus;
        } else { // 50% 확률로 돌을

            let idx = Math.round(Math.random() * (rocks.length - 1)); // 균일한 확률로 돌들 중 한 개를
            obj = rocks[idx];
        }
        let newObstacle = obj.clone(); // 복제하고
        newObstacle.position.z = newObjectCoordZ; // 위치를 설정해

        // 장애물 목록과 scene 오브젝트에 추가한다.
        obstacles.add(newObstacle);
    }
    if (decoTimer > DecorationGenDelay) {

        decoTimer -= DecorationGenDelay;

        const RoadWidthHalf = RoadWidth / 2.0;
        const numDeco = Math.round(Math.random() * (MaxDecorationsPerRow - MinDecorationsPerRow) + MinDecorationsPerRow);
        for (let i = 0; i < numDeco; i++) {

            const xPos = Math.random() * (DecorationHorizontalRegion[1] - DecorationHorizontalRegion[0]) + DecorationHorizontalRegion[0];
            if (-RoadWidthHalf <= xPos && xPos <= RoadWidthHalf) {

                continue;
            }

            const zBias = Math.random() * DecorationVerticalBias;

            const idx = Math.round(Math.random() * (decoRocks.length - 1));
            let newDeco = decoRocks[idx].clone();

            newDeco.position.x = xPos;
            newDeco.position.z = newObjectCoordZ + zBias;

            decorations.add(newDeco);
        }
    }

    // 사용되지 않는 장애물, 장식물을 폐기한다.
    const disposeZ = zPos + ObjectDisposeThreshold; // 폐기 역치 z좌표
    // 장애물 폐기
    var numDelete = 0;
    for (let obstacle of obstacles.children) {

        if (obstacle.position.z < disposeZ) {

            numDelete++;
        } else {

            break;
        }
    }
    obstacles.children.splice(0, numDelete);
    // 장식물 폐기
    numDelete = 0;
    for (let deco of decorations.children) {

        if (deco.position.z < disposeZ) {

            numDelete++;
        } else {

            break;
        }
    }
    decorations.children.splice(0, numDelete);

    // 블레이어 위치 업데이트
    if (zPos > MaxCoordZ) {

        zPos -= MaxCoordZ;

        const thres = MaxCoordZ + ObjectDisposeThreshold;
        for (let obstacle of obstacles.children) {

            if (obstacle.position.z > thres) {

                obstacle.position.z -= MaxCoordZ;
            } else {

                break;
            }
        }
        for (let deco of decorations.children) {

            if (deco.position.z > thres) {

                deco.position.z -= MaxCoordZ;
            }
        }
    }

    // 플레이어의 yz좌표 업데이트
    robot.model.position.z = zPos;
    robot.model.position.y = yPos;

    // 카메라 z좌표 업데이트
    camera.position.z = zPos + CameraPosition.z;

    // 태양 각위치 계산
    const theta = zPos * Math.PI * 2 / MaxCoordZ;

    // 태양 직교좌표 계산, 업데이트
    sunLight.position.set(
        30 * Math.cos(theta),
        30 * Math.sin(theta),
        camera.position.z + 30);

    if (zPos > MaxCoordZ / 2.0) { // 밤에만 플래시라이트 보임

        // 플래시라이트 좌표 계산, 업데이트
        const lightPos = [
            FlashLightSetup.Offset[0], 
            FlashLightSetup.Offset[1] + yPos, 
            FlashLightSetup.Offset[2] + zPos];
        const targetPos = [
            lightPos[0] + FlashLightSetup.TargetOffset[0], 
            lightPos[1] + FlashLightSetup.TargetOffset[1], 
            lightPos[2] + FlashLightSetup.TargetOffset[2]];
        flashLight.position.set(lightPos[0], lightPos[1], lightPos[2]);
        flashLight.target.position.set(targetPos[0], targetPos[1], targetPos[2]);
    } else { // 낮에는 안 보임

        flashLight.position.set(0, -1, 0);
    }

    // 배경 색 계산, 업데이트
    let rate = 0;
    if (zPos < MaxCoordZ / 2.0) {

        rate = Math.sin(zPos * Math.PI * 2 / MaxCoordZ);
    }
    scene.background = new THREE.Color(mixColor(
        Pallete.Sky.Day,
        Pallete.Sky.Night,
        rate
    ));

    // TODO: Merge obstacles into a group.

    // TODO: Hit test with obstacle here.

    /// Test perspective
    // camera.position.set(0, 30, zPos);
    // camera.lookAt(0, 0, zPos);
    // camera.rotateZ(radian(180));
};

// #endregion

// 캔버스에 그리기 작업을 시작한다.
startScene(window.innerWidth, window.innerWidth * CanvasSizeRate, 60);
