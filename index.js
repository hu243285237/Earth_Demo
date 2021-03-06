/*
    需要在本地搭服务器才能运行

    否则会有跨域的问题
*/

// 提示文本框
var prompt = document.getElementById("prompt");

// 初始化渲染器
var renderer;
function initThree() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, height);
    document.getElementById("canvas-frame").appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);
    renderer.setClearAlpha(0.5);
}

// 初始化摄像机
var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1200;
}

// 初始化场景
var scene;
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
}

// 初始化灯光
var light1;
var light2;
function initLight() {
    light1 = new THREE.AmbientLight(0xFFFFFF, 10.0, 0);
    light2 = new THREE.DirectionalLight(0xFFFFFF, 15);
    light2.position.set(0, 0, 100);
    scene.add(light1);
    scene.add(light2);
}

// 初始化物体
var earth;
function initObject() {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load("./models/earth/earth.mtl", function(material) {
        prompt.innerText = "材质加载完毕，准备加载模型...";
        // 按顺序加载物体和贴图
        Promise.resolve().then(() => { return loadObj("./models/earth/earth.obj", "地球"); })
        .then(() => { return loadTexture("./models/earth/4096_earth.jpg", "4096_earth"); })
        .then(() => { return loadTexture("./models/earth/4096_bump.jpg", "4096_bump"); })
        .then(() => { return loadTexture("./models/earth/4096_normal.jpg", "4096_normal"); })
        .then(() => { return loadTexture("./models/earth/4096_night_lights.jpg", "4096_night_lights"); })
        .then(() => { return loadTexture("./models/earth/4096_clouds.jpg", "4096_clouds"); })
        .then(() => { prompt.innerText = "所有资源已加载完毕，鼠标拖动可旋转，滚轮可缩放"; });
        // 加载物体的 Promise 方法
        function loadObj(url, name) {
            return new Promise((resolve, reject) => {
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(material);
                objLoader.load(url, function(object) {
                    resolve();
                    prompt.innerText = `${name}模型加载完毕，准备加载贴图...`;
                    object.position.set(0, 0, 0);
                    earth = object;
                    scene.add(object);
                }, function(xhr) {
                    prompt.innerText = `加载${name}模型中，${((xhr.loaded/xhr.total)*100).toFixed(0)}%...`;
                }, function(err) {
                    reject();
                    prompt.innerText = "加载模型出错！";
                });
            });
        }
        // 加载贴图的 Promise 方法
        function loadTexture(url, name) {
            return new Promise((resolve, reject) => {
                mtlLoader.load(url, function(texture) {
                    resolve();
                    prompt.innerText = `贴图${name}加载完毕，准备加载下一张贴图...`;
                }, function(xhr) {
                    prompt.innerText = `加载贴图${name}中，${((xhr.loaded/xhr.total)*100).toFixed(0)}%...`;
                }, function(err) {
                    reject();
                    prompt.innerText = "加载贴图出错！";
                });
            });
        }
    }, function(xhr) {
        prompt.innerText = `加载材质中，${((xhr.loaded/xhr.total)*100).toFixed(0)}%...`;
    }, function(err) {
        prompt.innerText = "加载材质出错！";
    });
}

// 画板自适应屏幕
function initResizeScreen() {
    window.onresize = function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}

// 初始化鼠标点击事件
var mouse = {};
function initMouseButtonEvent() {
    mouse.delX = 0;
    mouse.delY = 0;
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

// 初始化鼠标滚轮事件
function initMouseRollerEvent() {
    mouse.delRoller = 0;
    function scroll(e) {
        // 兼容 IE 谷歌 火狐
        e = e || window.event;
        e.wheelDelta = e.wheelDelta || e.detail;
        mouse.delRoller += e.wheelDelta / 10;
    }
    // 添加事件
    if (document.addEventListener) { // 火狐
        document.addEventListener("DOMMouseScroll", scroll);
    }
    window.onmousewheel = scroll; // IE 谷歌
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
    initResizeScreen();
    initMouseButtonEvent();
    initMouseRollerEvent();
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
    // 滚轮移动摄像机
    mouse.delRoller /= 1.1;
    camera.position.z = THREE.Math.lerp(camera.position.z, camera.position.z - mouse.delRoller, 0.25);
    // 限制摄像机的范围
    if (camera.position.z > 1500) {
        camera.position.z = 1500;
    } else if (camera.position.z < 800) {
        camera.position.z = 800;
    }
    // 增大云层缩放 以防止旋转时穿模
    earth.children[1].scale.set(1.01, 1.01, 1.01);
    // 云层自旋转
    earth.children[1].rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.002);
}