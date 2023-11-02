const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.5, 0.5, 0.5);

//создание камеры
const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
camera.attachControl(canvas, true);

//перемещение камеры
camera.keysUp.push(87); // W
camera.keysDown.push(83); // S
camera.keysLeft.push(65); // A
camera.keysRight.push(68); // D
//настройка скорости и чувствительности камеры
camera.angularSensibility = 4000;
camera.speed = 0.8;

camera.upperBetaLimit = Math.PI / 2.2;

//создание света
const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, -5), scene);


//создание задней стенки с помощью box
const backWall = BABYLON.MeshBuilder.CreateBox("box", {width: 40, height: 40, depth: 0.1}, scene);
backWall.position = new BABYLON.Vector3(0, 0, 0.2);
backWall.material = new BABYLON.StandardMaterial("backWallMaterial", scene);
backWall.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
backWall.material.backFaceCulling = false;

//получение ширины и высоты экрана в пикселях
let width = engine.getRenderWidth();
let height = engine.getRenderHeight();
console.log(width, height);

//create gui rectangle
const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
const rectBack = new BABYLON.GUI.Rectangle();
rectBack.width = "500px";
rectBack.height = "400px";
rectBack.color = "#000000";
rectBack.left = "-740px";
rectBack.top = "-290px";
rectBack.alpha = 0.5;
rectBack.background = "#FFFFFFFF";
rectBack.zIndex = -1;

//create child text of rectangle
const textScale = new BABYLON.GUI.TextBlock();
textScale.text = "Масштаб";
textScale.color = "black";
textScale.fontSize = 36;
textScale.width = "156px";
textScale.height = "40px";
textScale.left = "-157px";
textScale.top = "-170px";
textScale.alpha = 2;
rectBack.addControl(textScale);

//slider справа от textScale child of rectangle
var sliderScale = new BABYLON.GUI.Slider();
sliderScale.minimum = 0.1;
sliderScale.maximum = 1;
sliderScale.value = 0.5;
sliderScale.height = "30px";
sliderScale.width = "250px";
sliderScale.color = "black";
sliderScale.background = "black";
sliderScale.top = "-170px";
sliderScale.left = "50px";
sliderScale.alpha = 2;
rectBack.addControl(sliderScale);
sliderScale.onValueChangedObservable.add(function (value) {
    line.scaling = new BABYLON.Vector3(value, value, value)
});

//create child text es of rectangle
const textEs = new BABYLON.GUI.TextBlock();
textEs.text = "es";
textEs.color = "black";
textEs.fontSize = 36;
textEs.width = "156px";
textEs.height = "40px";
textEs.left = "-157px";
textEs.top = "-120px";
textEs.alpha = 2;
textEs.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
rectBack.addControl(textEs);
//input справа от textEs child of rectangle
var inputEs = new BABYLON.GUI.InputText();
inputEs.width = "250px";
inputEs.height = "30px";
inputEs.color = "black";
inputEs.background = "white";
inputEs.top = "-120px";
inputEs.left = "50px";
inputEs.alpha = 2;
//текст вводимого текста белый
inputEs.focusedBackground = "white";
inputEs.focusedColor = "black";
inputEs.text = "0.055";
rectBack.addControl(inputEs);

//create child text ei of rectangle
const textEi = new BABYLON.GUI.TextBlock();
textEi.text = "ei";
textEi.color = "black";
textEi.fontSize = 36;
textEi.width = "156px";
textEi.height = "40px";
textEi.left = "-157px";
textEi.top = "-70px";
textEi.alpha = 2;
textEi.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
rectBack.addControl(textEi);
//input справа от textEi child of rectangle
var inputEi = new BABYLON.GUI.InputText();
inputEi.width = "250px";
inputEi.height = "30px";
inputEi.color = "black";
inputEi.background = "white";
inputEi.top = "-70px";
inputEi.left = "50px";
inputEi.alpha = 2;
//текст вводимого текста белый
inputEi.focusedBackground = "white";
inputEi.focusedColor = "black";
inputEi.text = "0.006";
rectBack.addControl(inputEi);

//create child text x_ of rectangle
const textX_ = new BABYLON.GUI.TextBlock();
textX_.text = "x_";
textX_.color = "black";
textX_.fontSize = 36;
textX_.width = "156px";
textX_.height = "40px";
textX_.left = "-157px";
textX_.top = "-20px";
textX_.alpha = 2;
textX_.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
rectBack.addControl(textX_);
//input справа от textX_ child of rectangle
var inputX_ = new BABYLON.GUI.InputText();
inputX_.width = "250px";
inputX_.height = "30px";
inputX_.color = "black";
inputX_.background = "white";
inputX_.top = "-20px";
inputX_.left = "50px";
inputX_.alpha = 2;
//текст вводимого текста белый
inputX_.focusedBackground = "white";
inputX_.focusedColor = "black";
inputX_.text = "0.044";
rectBack.addControl(inputX_);

//create child text q of rectangle
const textQ = new BABYLON.GUI.TextBlock();
textQ.text = "q";
textQ.color = "black";
textQ.fontSize = 36;
textQ.width = "156px";
textQ.height = "40px";
textQ.left = "-157px";
textQ.top = "30px";
textQ.alpha = 2;
textQ.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
rectBack.addControl(textQ);
//input справа от textQ child of rectangle
var inputQ = new BABYLON.GUI.InputText();
inputQ.width = "250px";
inputQ.height = "30px";
inputQ.color = "black";
inputQ.background = "white";
inputQ.top = "30px";
inputQ.left = "50px";
inputQ.alpha = 2;
//текст вводимого текста белый
inputQ.focusedBackground = "white";
inputQ.focusedColor = "black";
inputQ.text = "0.012";
rectBack.addControl(inputQ);

//button при котором происходит перерисовка графика child of rectangle
var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Перерисовать");
button.width = "250px";
button.height = "40px";
button.color = "black";
button.background = "white";
button.top = "80px";
button.left = "50px";
button.alpha = 2;
rectBack.addControl(button);

advancedTexture.addControl(rectBack);

//functions
//функция для генерации случайных чисел с нормальным распределением
const rnorm = (cr, SD) => {
    let u1 = Math.random();
    let u2 = Math.random();
    
    var z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * SD + cr;
}

let pointCenter = new BABYLON.Vector3(0, 0, 0);
let minX = -10;
let maxX = 10;
let minY = -10;
let maxY = 10;

//построение осей
const AxisLines = [
    [new BABYLON.Vector3(minX, 0, 0), new BABYLON.Vector3(maxX, 0, 0)],
    [new BABYLON.Vector3(maxX - 0.3, 0.3, 0), new BABYLON.Vector3(maxX, 0, 0), new BABYLON.Vector3(maxX - 0.3, -0.3, 0)],
    [new BABYLON.Vector3(0, minY, 0), new BABYLON.Vector3(0, maxY, 0)],
    [new BABYLON.Vector3(-0.3, maxY - 0.3, 0), new BABYLON.Vector3(0, maxY, 0), new BABYLON.Vector3(0.3, maxY - 0.3, 0)],
]
const Axis = BABYLON.MeshBuilder.CreateLineSystem("Axis", {lines: AxisLines})
Axis.color = new BABYLON.Color3(0, 0, 0);
//входные данные
let es;
let ei;
let x_;
let q;
let line;
let lins;

button.onPointerUpObservable.add(function () {
    if (line) {
        line.dispose();
    }
    if (lins) {
        lins.dispose();
    }
    //перерисовка графика
    es = parseFloat(inputEs.text);
    ei = parseFloat(inputEi.text);
    x_ = parseFloat(inputX_.text);
    q = parseFloat(inputQ.text);
    createGraphic();
});


let createGraphic = () => {
    //заполнение массива случайными числами с нормальным распределением
    let x = [];
    for (let i = 0; i < 20000; i++) {
        x.push(rnorm(x_, q));
    }
    x.sort((x, y) => x - y);

    //построение графика
    let pointsForGraphic = [];
    let count = 0;
    while ( count < x.length) {
        let j1 = 1 / (q * Math.sqrt(2 * Math.PI))
        let j2 = - Math.pow((x[count] - x_), 2) / (2 * Math.pow(q, 2));
        let j3 = Math.exp(j2);
        let j = j1 * j3
        pointsForGraphic.push(new BABYLON.Vector3(100 * x[count], 0.286 * j, 0));
        console.log(`${count} = ${x[count]}  ${j}`)
        count++
    }
    line = BABYLON.MeshBuilder.CreateLines("line", { points: pointsForGraphic }, scene);
    line.color = new BABYLON.Color3(0, 0, 0);

    //построение линий
    let lin = [
        [new BABYLON.Vector3(100 * ei, maxY, 0), new BABYLON.Vector3(100 * ei, minY, 0)],
        [new BABYLON.Vector3(100 * x_, maxY, 0), new BABYLON.Vector3(100 * x_, minY, 0)],
        [new BABYLON.Vector3(100 * es, maxY, 0), new BABYLON.Vector3(100 * es, minY, 0)]
    ]
    lins = BABYLON.MeshBuilder.CreateLineSystem("lin", {lines: lin})
    lins.color = new BABYLON.Color3(0, 0, 0);

}

// createGraphic();

window.addEventListener("resize", function () {
    engine.resize();
});

engine.runRenderLoop(function () {
    scene.render();
});