/*
    需要在本地搭服务器才能运行

    否则会有跨域的问题
*/

// 初始化渲染器
var renderer;
function initThree() {
    width = document.getElementById("canvas-frame").clientWidth;
    height = document.getElementById("canvas-frame").clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    document.getElementById("canvas-frame").appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);
}

// 初始化摄像机
var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.x = 0;
    camera.position.y = 50;
    camera.position.z = 1000;
}

// 初始化场景
var scene;
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
}

// 初始化灯光
var light;
function initLight() {
    light1 = new THREE.AmbientLight(0xFFFFFF, 10.0, 0);
    light2 = new THREE.DirectionalLight(0xFFFFFF, 12.0, 0);
    light2.position.set(100, 100, 200);
    scene.add(light1);
    scene.add(light2);
}

// 初始化物体
var earth;
function initObject() {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load("./models/earth/earth.mtl", function(material) {
        material.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(material);
        objLoader.load("./models/earth/earth.obj", function(object) {
            object.position.set(0, 0, 0);
            earth = object;
            scene.add(object);
        });
    });
}

// 初始化鼠标事件
var mouse;
function initMouseEvent() {
    mouse = { delX: 0, delY: 0 };
    let isMouseDown = false;
    let lastFramePoint = { x: 0, y: 0 };
    window.addEventListener("mousedown", e => {
        isMouseDown = true;
        lastFramePoint.x = e.pageX;
        lastFramePoint.y = e.pageY;
    });
    window.addEventListener("mouseup", e => { 
        isMouseDown = false;
    });
    window.addEventListener("mousemove", e => {
        if (!isMouseDown) return;
        mouse.delX = (e.clientX - lastFramePoint.x) / 200;
        mouse.delY = (e.clientY - lastFramePoint.y) / 200;
        lastFramePoint.x = e.clientX;
        lastFramePoint.y = e.clientY;
    });
}

// 实时渲染
function render() {
    update();
    renderer.clear();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

// 开始
function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    initMouseEvent();
    render();
}

// update 每帧逻辑代码
function update() {
    // 如果模型还未加载出来 则返回
    if (!earth) return;
    // 模型旋转
    earth.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), mouse.delX);
    earth.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), mouse.delY);
    // 旋转量逐渐减少 使之有缓冲效果
    mouse.delX = mouse.delX > 0 ? mouse.delX / 1.1 : 0;
    mouse.delY = mouse.delY > 0 ? mouse.delY / 1.1 : 0;
}