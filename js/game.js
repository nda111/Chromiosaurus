
// #region 전역 변수
// 프레임 렌더링 관련
var scene;  // Scene 객체
var camera; // 카메라 객체
var renderer = undefined; // 렌더러 오브젝트

// 시간 관리
var prevTime = undefined; // 이전 프레임의 시간 (밀리초)
var playTime = 0;         // 게임 시작 이후 플레이 시간 (초)
var interval = undefined; // 프레임 간의 시간 간격 (밀리초)

// 게임 이벤트
var onInit = undefined;   // 게임이 시작될 때 오브젝트를 초기화한다.
var onUpdate = undefined; // 프레임마다 오브젝트를 업데이트한다.

// #endregion

// #region 게임 실행 관련 함수
/**
 * 캔버스에 그리기 작업을 시작한다.
 * 
 * @param {*} width 캔버스의 가로 크기
 * @param {*} height 캔버스의 세로 크기
 * @param {*} fps 1초 당 렌더링 횟수
 */
function startScene(width, height, fps = 60) {

    // Scene과 카메라, 렌더러 객체를 만든다
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.shadowMap.enabled = true; // 그림자 렌더링 활성화
    renderer.setSize(width, height); // 뷰포트 크기 설정
    document.body.appendChild(renderer.domElement); // html 문서에 캔버스 추가

    if (onInit != undefined) {

        // 객체 초기화
        onInit();
    }

    // 게임 시작 시간 등록
    prevTime = Date.now();

    // frame rate 적용, 타이머 시작
    setFrameRate(fps);
}

/**
 * 프레임마다 수행할 동작
 */
function onFrame() {

    const now = Date.now();
    const elapsed = now - prevTime;
    prevTime = now;

    playTime += elapsed;

    if (onUpdate != undefined) {
    
        // 초 단위 지난 시간을 파라미터로 패스하고
        // 프레임 업데이트를 수행한다.
        onUpdate(elapsed / 1000.0);
    }

    // 렌더링 camera를 가지고 현재 scene을 렌더링한다.
    renderer.render(scene, camera);
}

/**
 * frame rate을 적용한다
 * 
 * @param {*} fps 초당 렌더링 횟수
 */
function setFrameRate(fps) {

    if (interval != undefined) {

        // 이전 타이머가 있다면 해제하고
        clearInterval(interval);
    }

    // 새로운 타이머를 시작한다.
    interval = setInterval(onFrame, 1000 / fps);
}

// #endregion
