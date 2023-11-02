// import * as BABYLON from 'babylonjs';
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.5, 0.5, 0.5);

const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

pointCenter = new BABYLON.Vector3(0, 2, 0);

const points = [];
points.push(new BABYLON.Vector3(2, -2, 2));
points.push(new BABYLON.Vector3(2, 2, 2));
points.push(new BABYLON.Vector3(2, -2, -2));
points.push(new BABYLON.Vector3(2, 2, -2));
points.push(new BABYLON.Vector3(-2, -2, -2));
points.push(new BABYLON.Vector3(-2, 2, -2));
points.push(new BABYLON.Vector3(-2, -2, 2));
points.push(new BABYLON.Vector3(-2, 2, 2));

const linesBottom = []
const lines = [
    [points[0], points[2], points[4], points[6], points[0]],
    [points[1], points[3], points[5], points[7], points[1]],
    [points[0], points[1]],
    [points[2], points[3]],
    [points[4], points[5]],
    [points[6], points[7]]
]

const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.3}, scene);

console.log(lines)

//добавить линии в один объект
const cubeLines = BABYLON.MeshBuilder.CreateLineSystem("cube", {lines: lines})

const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

var sliderX = new BABYLON.GUI.Slider();
sliderX.minimum = -15;
sliderX.maximum = 15;
sliderX.value = 0;
sliderX.height = "30px";
sliderX.width = "250px";
sliderX.color = "black";
sliderX.background = "white";
sliderX.top = "50px";
sliderX.left = "50px";
sliderX.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
sliderX.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
advancedTexture.addControl(sliderX);
sliderX.onValueChangedObservable.add(function (value) {
    cubeLines.position = new BABYLON.Vector3(value, cubeLines.position.y, cubeLines.position.z)
});
var textX = new BABYLON.GUI.TextBlock();
textX.text = "X";
textX.color = "white";
textX.fontSize = 24;
textX.top = "50px";
textX.left = "20px";
textX.zIndex = -1;
textX.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
textX.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
advancedTexture.addControl(textX);

var sliderY = new BABYLON.GUI.Slider();
sliderY.minimum = -15;
sliderY.maximum = 15;
sliderY.value = 0;
sliderY.height = "30px";
sliderY.width = "250px";
sliderY.color = "black";
sliderY.background = "white";
sliderY.top = "100px";
sliderY.left = "50px";
sliderY.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
sliderY.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
advancedTexture.addControl(sliderY);
sliderY.onValueChangedObservable.add(function (value) {
    cubeLines.position = new BABYLON.Vector3(cubeLines.position.x, value, cubeLines.position.z)
});
var textY = new BABYLON.GUI.TextBlock();
textY.text = "Y";
textY.color = "white";
textY.fontSize = 24;
textY.top = "100px";
textY.left = "20px";
textY.zIndex = -1;
textY.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
textY.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
advancedTexture.addControl(textY);

var sliderZ = new BABYLON.GUI.Slider();
sliderZ.minimum = -15;
sliderZ.maximum = 15;
sliderZ.value = 0;
sliderZ.height = "30px";
sliderZ.width = "250px";
sliderZ.color = "black";
sliderZ.background = "white";
sliderZ.top = "150px";
sliderZ.left = "50px";
sliderZ.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
sliderZ.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
advancedTexture.addControl(sliderZ);
sliderZ.onValueChangedObservable.add(function (value) {
    cubeLines.position = new BABYLON.Vector3(cubeLines.position.x, cubeLines.position.y, value)
});
var textZ = new BABYLON.GUI.TextBlock();
textZ.text = "Z";
textZ.color = "white";
textZ.fontSize = 24;
textZ.top = "150px";
textZ.left = "20px";
textZ.zIndex = -1;
textZ.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
textZ.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
advancedTexture.addControl(textZ);

scene.onBeforeRenderObservable.add(() => {
    
});

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});