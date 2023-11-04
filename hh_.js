const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.5, 0.5, 0.5);

//создание камеры
const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -50), scene);
camera.attachControl(canvas, true);

//перемещение камеры
camera.keysUp.push(87);
camera.keysDown.push(83);
camera.keysLeft.push(65);
camera.keysRight.push(68);
//скорости и чувствительности камеры
camera.angularSensibility = 4000;
camera.speed = 0.8;

//создание света
const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, -10), scene);

let baseSize = 20;
let scaling = 1;

let textOnGraphicX;
let textOnGraphicY;
let textOnGraphicEs;
let textOnGraphicEi;
let textOnGraphicX_;

//координаты заднего фона
let minX = -20;
let maxX = 20;
let minY = -20;
let maxY = 20;

//входные данные
let es = 0.055;
let ei = 0.006;
let x_ = 0.026;
let q = 0.012;
//график
let line;
let lins;
let Axis;
//создание задней стенки с помощью box
const backWall = BABYLON.MeshBuilder.CreateBox("box", {width: 2 * maxX + 2, height: 2 * maxY + 2, depth: 0.1}, scene);
backWall.position = new BABYLON.Vector3(0, 0, 0.2);
backWall.material = new BABYLON.StandardMaterial("backWallMaterial", scene);
backWall.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
backWall.material.backFaceCulling = false;

//создание черного материала для текста
const textMaterial = new BABYLON.StandardMaterial("textMaterial", scene);
textMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
textMaterial.disableLighting = true;

//ФУНКЦИИ
//подгружаем шрифт
let fontData;
const getFontData = async function () {
    fontData = await (await fetch("https://assets.babylonjs.com/fonts/Droid Sans_Regular.json")).json();
    console.log(fontData);
    textOnGraphicX = createText("x");
    textOnGraphicX.position = new BABYLON.Vector3(maxX + 0.5, 0, 0);
    textOnGraphicY = createText("y");
    textOnGraphicY.position = new BABYLON.Vector3(0, maxY + 0.5, 0);
    //текст с 0 в центре координат
    const text0 = createText("0");
    text0.position = new BABYLON.Vector3(-0.5, -0.6, 0);
}
getFontData();

//создание текста, назначение черного материала
const createText = (text) => {
    var myText = BABYLON.MeshBuilder.CreateText("myText", text, fontData, {
        size: 0.5,
        resolution: 64, 
        depth: 0.1,
    });
    myText.material = textMaterial;
    return myText;
}

//функция масштабирования
const changeScaling = (value) => {
    minX = -baseSize * value;
    maxX = baseSize * value;
    // minY = -baseSize * value;
    // maxY = baseSize * value;
    scaling = value;
    if (line) {
        line.scaling = new BABYLON.Vector3(scaling, scaling, scaling)
        lins.dispose();
        
        textOnGraphicEs.position = new BABYLON.Vector3(scaling * 100 * es + 0.5, maxY + 0.5, 0);
        textOnGraphicEi.position = new BABYLON.Vector3(scaling * 100 * ei + 0.5, maxY + 0.5, 0);
        textOnGraphicX_.position = new BABYLON.Vector3(scaling * 100 * x_ + 0.5, maxY + 0.5, 0);
        textOflineMaxYOnAxis.position = new BABYLON.Vector3(-1.3, scaling * 0.286 * maxYOnAxisY, 0);
        lineMaxYOnAxis.position = new BABYLON.Vector3(0, scaling * 0.286 * maxYOnAxisY, 0);
        createLins();
    }
}

const createGUI = () => {
    //создание заднего фона
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

    //текста масштаба
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
    //слайдер масштаба
    var sliderScale = new BABYLON.GUI.Slider();
    sliderScale.minimum = 0.1;
    sliderScale.maximum = 2;
    sliderScale.value = 1;
    sliderScale.height = "30px";
    sliderScale.width = "250px";
    sliderScale.color = "black";
    sliderScale.background = "black";
    sliderScale.top = "-170px";
    sliderScale.left = "50px";
    sliderScale.alpha = 2;
    rectBack.addControl(sliderScale);
    sliderScale.onValueChangedObservable.add(function(value){
        changeScaling(value);
    });

    //создание текста ES
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
    //создание поля ввода для ES
    var inputEs = new BABYLON.GUI.InputText();
    inputEs.width = "250px";
    inputEs.height = "30px";
    inputEs.color = "black";
    inputEs.background = "white";
    inputEs.top = "-120px";
    inputEs.left = "50px";
    inputEs.alpha = 2;
    inputEs.focusedBackground = "white";
    inputEs.focusedColor = "black";
    inputEs.text = "0.055";
    rectBack.addControl(inputEs);

    //создание текста EI
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
    //создание поля ввода EI
    var inputEi = new BABYLON.GUI.InputText();
    inputEi.width = "250px";
    inputEi.height = "30px";
    inputEi.color = "black";
    inputEi.background = "white";
    inputEi.top = "-70px";
    inputEi.left = "50px";
    inputEi.alpha = 2;
    inputEi.focusedBackground = "white";
    inputEi.focusedColor = "black";
    inputEi.text = "0.006";
    rectBack.addControl(inputEi);

    //создание текста X_
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
    //создание поля ввода для X_
    var inputX_ = new BABYLON.GUI.InputText();
    inputX_.width = "250px";
    inputX_.height = "30px";
    inputX_.color = "black";
    inputX_.background = "white";
    inputX_.top = "-20px";
    inputX_.left = "50px";
    inputX_.alpha = 2;
    inputX_.focusedBackground = "white";
    inputX_.focusedColor = "black";
    inputX_.text = "0.044";
    rectBack.addControl(inputX_);

    //создание текста Q
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
    //создание поля ввода для Q
    var inputQ = new BABYLON.GUI.InputText();
    inputQ.width = "250px";
    inputQ.height = "30px";
    inputQ.color = "black";
    inputQ.background = "white";
    inputQ.top = "30px";
    inputQ.left = "50px";
    inputQ.alpha = 2;
    inputQ.focusedBackground = "white";
    inputQ.focusedColor = "black";
    inputQ.text = "0.012";
    rectBack.addControl(inputQ);

    //создание кнопки для построения
    var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Посторить");
    button.width = "250px";
    button.height = "40px";
    button.color = "black";
    button.background = "white";
    button.top = "80px";
    button.left = "50px";
    button.alpha = 2;
    rectBack.addControl(button);
    advancedTexture.addControl(rectBack);

    button.onPointerUpObservable.add(function () {
        if (line) {
            line.dispose();
            lins.dispose();
            textOnGraphicEs.dispose();
            textOnGraphicEi.dispose();
            textOnGraphicX_.dispose();
            lineMaxYOnAxis.dispose();
            textOflineMaxYOnAxis.dispose();
        }
        //перерисовка графика
        es = parseFloat(inputEs.text);
        ei = parseFloat(inputEi.text);
        x_ = parseFloat(inputX_.text);
        q = parseFloat(inputQ.text);
        createGraphic();
    });
}

createGUI();

//functions
//функция для генерации случайных чисел с нормальным распределением
const rnorm = (cr, SD) => {
    let u1 = Math.random();
    let u2 = Math.random();
    
    var z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * SD + cr;
}

//построение осей
const createAxis = () => {
    let AxisLines = [
        [new BABYLON.Vector3(minX, 0, 0), new BABYLON.Vector3(maxX, 0, 0)],
        [new BABYLON.Vector3(maxX - 0.3, 0.3, 0), new BABYLON.Vector3(maxX, 0, 0), new BABYLON.Vector3(maxX - 0.3, -0.3, 0)],
        [new BABYLON.Vector3(0, minY, 0), new BABYLON.Vector3(0, maxY, 0)],
        [new BABYLON.Vector3(-0.3, maxY - 0.3, 0), new BABYLON.Vector3(0, maxY, 0), new BABYLON.Vector3(0.3, maxY - 0.3, 0)],
    ]
    Axis = BABYLON.MeshBuilder.CreateLineSystem("Axis", {lines: AxisLines})
    Axis.enableEdgesRendering();
    Axis.edgesWidth = 10.0;
    Axis.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
}
createAxis();

//входные данные


let x = [];
let y = [];
let pointsForGraphic = [];
let createGraphic = () => {
    x = [];
    y = [];
    pointsForGraphic = [];
    //заполнение массива случайными числами с нормальным распределением
    for (let i = 0; i < 20000; i++) {
        x.push(rnorm(x_, q));
    }
    x.sort((x, y) => x - y);

    //построение графика
    let count = 0;
    while ( count < x.length) {
        let y1 = 1 / (q * Math.sqrt(2 * Math.PI))
        let y2 = - Math.pow((x[count] - x_), 2) / (2 * Math.pow(q, 2));
        let y3 = Math.exp(y2);
        let y0 = y1 * y3
        y.push(y0)
        pointsForGraphic.push(new BABYLON.Vector3(100 * x[count], 0.286 * y0, 0));
        // console.log(`${count} = ${x[count]}  ${j}`)
        count++
    }
    line = BABYLON.MeshBuilder.CreateLines("line", { points: pointsForGraphic }, scene);
    line.color = new BABYLON.Color3(0, 0, 0);
    line.scaling = new BABYLON.Vector3(scaling, scaling, scaling)
    createLins();
    createTexts();
    createNumberOfAxis();
}

const createLins = () => {
    let lin = [
        [new BABYLON.Vector3(scaling * 100 * x_, baseSize, 0), new BABYLON.Vector3(scaling * 100 * x_, -baseSize, 0)],
        [new BABYLON.Vector3(scaling * 100 * ei, baseSize, 0), new BABYLON.Vector3(scaling * 100 * ei, -baseSize, 0)],
        [new BABYLON.Vector3(scaling * 100 * es, baseSize, 0), new BABYLON.Vector3(scaling * 100 * es, -baseSize, 0)]
    ]
    lins = BABYLON.MeshBuilder.CreateLineSystem("lin", {lines: lin})
    lins.color = new BABYLON.Color3(0, 0, 0);
}

let lineMaxYOnAxis;
let maxYOnAxisY;
let textOflineMaxYOnAxis;
const createNumberOfAxis = () => {
    maxYOnAxisY = Math.max.apply(null, y);
    console.log(maxYOnAxisY)
    //создать линию из двух точек
    let points = [
        new BABYLON.Vector3(0.3, 0, 0),
        new BABYLON.Vector3(-0.3, 0, 0)
    ]
    lineMaxYOnAxis = BABYLON.MeshBuilder.CreateLines("lineMaxY", { points: points }, scene);
    lineMaxYOnAxis.position = new BABYLON.Vector3(0, scaling * 0.286 * maxYOnAxisY, 0)
    lineMaxYOnAxis.color = new BABYLON.Color3(0, 0, 0);
    lineMaxYOnAxis.enableEdgesRendering();
    lineMaxYOnAxis.edgesWidth = 10.0;
    lineMaxYOnAxis.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
    textOflineMaxYOnAxis = createText(`${maxYOnAxisY.toFixed(1)}`);
    textOflineMaxYOnAxis.position = new BABYLON.Vector3(-1.3, scaling * 0.286 * maxYOnAxisY, 0);
}

// function readJSON(file, callback) {
//     let rawFile = new XMLHttpRequest();
//     rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", file, true);
//     rawFile.onreadystatechange = function() {
//         if (rawFile.readyState === 4 && rawFile.status == "200") {
//             callback(rawFile.responseText);
//         }
//     }
//     rawFile.send(null);
// }

// let fontData;

// readJSON("/fontData.json", function(text){
//     fontData = JSON.parse(text);
//     console.log(fontData);
// });

// //создать 3d text 
// const createText = (text, position, scene) => {
//     const text3d = new BABYLON.MeshBuilder.CreateText("text", text, fontData, scene);
//     text3d.position = position;
//     text3d.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
//     text3d.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
//     return text3d;
// }

//создание текста для осей
// const textX = createText("x", new BABYLON.Vector3(maxX + 0.5, 0, 0), scene);
// const textY = createText("y", new BABYLON.Vector3(0, maxY + 0.5, 0), scene);
// const textEs = createText("es", new BABYLON.Vector3(scaling * 100 * es, maxY + 0.5, 0), scene);
// const textEi = createText("ei", new BABYLON.Vector3(scaling * 100 * ei, maxY + 0.5, 0), scene);
// const textX_ = createText("x_", new BABYLON.Vector3(scaling * 100 * x_, maxY + 0.5, 0), scene);

const createTexts = () => {
    textOnGraphicEs = createText(`${es}`);
    textOnGraphicEs.position = new BABYLON.Vector3(scaling * 100 * es + 0.5, maxY + 0.5, 0);
    textOnGraphicEi = createText(`${ei}`);
    textOnGraphicEi.position = new BABYLON.Vector3(scaling * 100 * ei + 0.5, maxY + 0.5, 0);
    textOnGraphicX_ = createText(`${x_}`);
    textOnGraphicX_.position = new BABYLON.Vector3(scaling * 100 * x_ + 0.5, maxY + 0.5, 0);
}

// createGraphic();

window.addEventListener("resize", function () {
    engine.resize();
});

engine.runRenderLoop(function () {
    scene.render();
});