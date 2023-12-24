const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);

const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -50), scene);
camera.attachControl(canvas, true);
camera.keysUp.push(87);
camera.keysDown.push(83);
camera.keysLeft.push(65);
camera.keysRight.push(68);
camera.angularSensibility = 4000;
camera.speed = 0.8;

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

const blackMaterial = new BABYLON.StandardMaterial("textMaterial", scene);
blackMaterial.disableLighting = true;

const pointShape = [
    new BABYLON.Vector3(0, 15, 0), 
    new BABYLON.Vector3(15, 15, 0),
    new BABYLON.Vector3(15, 0, 0), 
    new BABYLON.Vector3(0, 0, 0), 
    new BABYLON.Vector3(0, 15, 0), 
]

const lineSegment = [
    [new BABYLON.Vector3(0, 10, 0), new BABYLON.Vector3(15, 10, 0)],
    [new BABYLON.Vector3(0, 5, 0), new BABYLON.Vector3(15, 5, 0)],
    [new BABYLON.Vector3(5, 15, 0), new BABYLON.Vector3(5, 0, 0)],
    [new BABYLON.Vector3(10, 15, 0), new BABYLON.Vector3(10, 0, 0)],
]

let fontData;
const getFontData = async function () {
    fontData = await (await fetch("https://assets.babylonjs.com/fonts/Droid Sans_Regular.json")).json();
    texts = [
        createText("1001", new BABYLON.Vector3(2.5, 12.5, 0)),
        createText("1010", new BABYLON.Vector3(12.5, 12.5, 0)),
        createText("0110", new BABYLON.Vector3(12.5, 2.5, 0)),
        createText("0101", new BABYLON.Vector3(2.5, 2.5, 0)),
        createText("0001", new BABYLON.Vector3(2.5, 7.5, 0)),
        createText("1000", new BABYLON.Vector3(7.5, 12.5, 0)),
        createText("0010", new BABYLON.Vector3(12.5, 7.5, 0)),
        createText("0100", new BABYLON.Vector3(7.5, 2.5, 0)),
        createText("Window\n  0000", new BABYLON.Vector3(7.5, 7.5, 0)),
    ]
}

const createText = (text, position) => {
    var myText = BABYLON.MeshBuilder.CreateText("myText", text, fontData, {
        size: 0.5,
        resolution: 64, 
        depth: 0.01,
    });
    myText.material = blackMaterial;
    myText.position = position;
    return myText;
}

const createGUI = () => {
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    const stackPanel = new BABYLON.GUI.StackPanel();
    stackPanel.width = "220px";
    stackPanel.height = "100px";
    stackPanel.fontSize = "26px";
    stackPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    stackPanel.isVertical = false;
    stackPanel.top = "10px";
    stackPanel.left = "10px";
    advancedTexture.addControl(stackPanel);

    const button = BABYLON.GUI.Button.CreateSimpleButton("but", "Hide Code");
    button.width = "200px"
    button.height = "40px"
    button.color = "white"
    button.background = "green"
    button.top = "-20px"
    button.left = "10px"
    button.onPointerUpObservable.add(function () {
        if (button.children[0].text === "Hide Code") {
            button.children[0].text = "Show Code";
            texts.forEach(text => {
                text.isVisible = false;
            })
        } else {
            button.children[0].text = "Hide Code";
            texts.forEach(text => {
                text.isVisible = true;
            })
        }
    })
    stackPanel.addControl(button);

    //ввод координат точки А и В и кнопка "проверить"
    const stackPanel2 = new BABYLON.GUI.StackPanel();
    stackPanel2.width = "230px";
    stackPanel2.height = "200px";
    stackPanel2.fontSize = "26px";
    stackPanel2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    stackPanel2.isVertical = false;
    stackPanel2.top = "80px";
    stackPanel2.left = "10px";
    advancedTexture.addControl(stackPanel2);
    
    const textA = new BABYLON.GUI.TextBlock();
    textA.text = "Точка A";
    textA.width = "90px";
    textA.color = "black";
    textA.fontSize = 24;
    textA.top = "0px";
    textA.left = "0px";
    textA.zIndex = -1;
    textA.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textA.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel2.addControl(textA);

    const inputA = new BABYLON.GUI.InputText();
    inputA.width = "90px";
    inputA.height = "40px";
    inputA.color = "black";
    inputA.background = "white";
    inputA.paddingLeft = "-90px";
    inputA.paddingRight = "90px";
    inputA.paddingTop = "-40px";
    inputA.paddingBottom = "40px";
    inputA.text = "3,4";
    inputA.zIndex = -1;
    inputA.focusedBackground = "white";
    inputA.focusedColor = "black";
    inputA.onBlurObservable.add(function () {
        pointCheckLine[0] = new BABYLON.Vector3(+inputA.text.split(",")[0], +inputA.text.split(",")[1], 0);
    })
    stackPanel2.addControl(inputA);

    const textB = new BABYLON.GUI.TextBlock();
    textB.text = "Точка B";
    textB.width = "90px"
    textB.color = "black";
    textB.fontSize = 24;
    textB.paddingLeft = "-40px"
    textB.zIndex = -1;
    textB.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textB.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel2.addControl(textB);

    const inputB = new BABYLON.GUI.InputText();
    inputB.width = "90px";
    inputB.height = "40px";
    inputB.color = "black";
    inputB.background = "white";
    inputB.paddingLeft = "-130px"
    inputB.paddingRight = "130px"
    inputB.paddingTop = "-40px";
    inputB.paddingBottom = "40px";
    inputB.text = "2,7";
    inputB.zIndex = -1;
    inputB.focusedBackground = "white";
    inputB.focusedColor = "black";
    inputB.onBlurObservable.add(function () {
        pointCheckLine[1] = new BABYLON.Vector3(+inputB.text.split(",")[0], +inputB.text.split(",")[1], 0);
    })
    stackPanel2.addControl(inputB);

    const buttonCheck = BABYLON.GUI.Button.CreateSimpleButton("but", "Check");
    buttonCheck.width = "200px"
    buttonCheck.height = "40px"
    buttonCheck.color = "white"
    buttonCheck.background = "green"
    buttonCheck.paddingTop = "10px";
    buttonCheck.paddingBottom = "-10px";
    buttonCheck.paddingLeft = "-360px";
    buttonCheck.paddingRight =  "330px";
    buttonCheck.zIndex = -1;
    buttonCheck.onPointerUpObservable.add(function () {
        console.log(newLine)
        if (newLine) {
            console.log("a")
            newLine.dispose();
            sphereANew.dispose();
            sphereBNew.dispose();
        }
        checkLine.dispose();
        textAObject.dispose();
        textBObject.dispose();
        sphereA.dispose();
        sphereB.dispose();
        createCheckLine(pointCheckLine);
    }
    )
    stackPanel2.addControl(buttonCheck);
}

function cutLine(line, window) {
    let p1 = line[0];
    let p2 = line[1];
    let p3 = window[0];
    let p4 = window[1];
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let t1 = 0;
    let t2 = 1;
    let p = 0;
    let q = 0;
    let r = 0;
    let flag = false;
    for (let edge = 0; edge < 4; edge++) {
        if (edge === 0) {
            p = -dx;
            q = -(p3.x - p1.x);
        }
        if (edge === 1) {
            p = dx;
            q = (p4.x - p1.x);
        }
        if (edge === 2) {
            p = -dy;
            q = -(p3.y - p1.y);
        }
        if (edge === 3) {
            p = dy;
            q = (p4.y - p1.y);
        }
        r = q / p;
        if (p === 0 && q < 0) {
            flag = true;
            break;
        }
        if (p < 0) {
            if (r > t2) {
                flag = true;
                break;
            } else if (r > t1) {
                t1 = r;
            }
        } else if (p > 0) {
            if (r < t1) {
                flag = true;
                break;
            } else if (r < t2) {
                t2 = r;
            }
        }
    }
    if (flag) {
        return null;
    }
    let newLine = [];
    newLine.push(new BABYLON.Vector3(p1.x + t1 * dx, p1.y + t1 * dy, 0));
    newLine.push(new BABYLON.Vector3(p1.x + t2 * dx, p1.y + t2 * dy, 0));
    return newLine;
}

function callCutLine () {
    let newLine = cutLine([new BABYLON.Vector3(4, 6, 0), new BABYLON.Vector3(7, 9, 0)], [new BABYLON.Vector3(5, 10, 0), new BABYLON.Vector3(10, 5, 0)]);
    console.log(newLine);
    if (newLine !== null) {
        const line = BABYLON.MeshBuilder.CreateLines("line", {
            points: [new BABYLON.Vector3(newLine[0]._x, newLine[0]._y, newLine[0]._z), new BABYLON.Vector3(newLine[1]._x, newLine[1]._y, newLine[1]._z)]}, scene)
        line.color = new BABYLON.Color3(1, 0, 0)
    }
    
    
    const rectangle = BABYLON.MeshBuilder.CreateLines("rectangle", {
        points: [new BABYLON.Vector3(5, 10, 0), 
            new BABYLON.Vector3(10, 10, 0), 
            new BABYLON.Vector3(10, 5, 0), 
            new BABYLON.Vector3(5, 5, 0), 
            new BABYLON.Vector3(5, 10, 0)]}, scene);
    
    const windowW = BABYLON.MeshBuilder.CreateLines("window", {
        points: [new BABYLON.Vector3(4, 6, 0), 
            new BABYLON.Vector3(7, 9, 0)]}, scene);
}

const decToBin = (dec) => {
    let bin = "";
    while (dec > 0) {
        bin = (dec % 2) + bin;
        dec = Math.floor(dec / 2);
    }
    return bin;
}

//конъюнкция двух битовых двоичных чисел
const conjunction = (bin1, bin2) => {
    let result = "";
    for (let i = 0; i < bin1.length; i++) {
        if (bin1[i] === "1" && bin2[i] === "1") {
            result += "1";
        } else {
            result += "0";
        }
    }
    return result;
}

const outCode = (line, window) => {
    let code = 0;
    if (line._x < window[0]._x) {
        code += 1;
    }
    if (line._x > window[1]._x) {
        code += 2;
    }
    if (line._y < window[1]._y) {
        code += 4;
    }
    if (line._y > window[0]._y) {
        code += 8;
    }
    code = decToBin(code);
    while (code.length < 4) {
        code = "0" + code;
    }

    return code;
}

const clipLine = (line, window) => {
    while (true) {
        code1 = outCode(line[0], window);
        code2 = outCode(line[1], window);
        // console.log(conjunction(code1, code2));
        if (conjunction(code1, code2) !== "0000") {
            return null;
        }
        if (conjunction(code1, code2) === "0000") {
            points = cutLines(line, window);
            points.sort((a, b) => a._x - b._x)
            points.pop();
            points.shift();
            return points;
        }
    }
}

getPointIntersection = (line, linesWin) => {
    let x1 = line[0]._x;
    let y1 = line[0]._y;
    let x2 = line[1]._x;
    let y2 = line[1]._y;
    let x3 = linesWin[0]._x;
    let y3 = linesWin[0]._y;
    let x4 = linesWin[1]._x;
    let y4 = linesWin[1]._y;
    let x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    let y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    return new BABYLON.Vector3(x, y, 0);
}

cutLines = (line, window) => {
    let linesWin = [];
    linesWin.push([new BABYLON.Vector3(window[0]._x, window[0]._y, 0), new BABYLON.Vector3(window[1]._x, window[0]._y, 0)]);
    linesWin.push([new BABYLON.Vector3(window[1]._x, window[0]._y, 0), new BABYLON.Vector3(window[1]._x, window[1]._y, 0)]);
    linesWin.push([new BABYLON.Vector3(window[1]._x, window[1]._y, 0), new BABYLON.Vector3(window[0]._x, window[1]._y, 0)]);
    linesWin.push([new BABYLON.Vector3(window[0]._x, window[1]._y, 0), new BABYLON.Vector3(window[0]._x, window[0]._y, 0)]);
    let points = [];
    linesWin.forEach(item => {
        points.push(getPointIntersection(line, item));
    });
    return points;
}

let checkLine;
let sphereA;
let sphereB;
let sphereANew;
let sphereBNew;
let textBObject;
let textAObject;


const createCheckLine = (line) => {
    checkLine = BABYLON.MeshBuilder.CreateLines("checkLine", {
        points: line, scene});
    checkLine.enableEdgesRendering();
    checkLine.edgesWidth = 10.0;
    checkLine.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
    textAObject = createText("A", new BABYLON.Vector3(line[0]._x, line[0]._y + 0.5, line[0]._z));
    textBObject = createText("B", new BABYLON.Vector3(line[1]._x, line[1]._y + 0.5, line[1]._z));
    sphereA = createSphere(line[0], new BABYLON.Color3(1, 1, 1));
    sphereB = createSphere(line[1], new BABYLON.Color3(1, 1, 1));
        
    // outCode(pointCheckLine[0], [new BABYLON.Vector3(5, 10, 0), new BABYLON.Vector3(10, 5, 0)]);

    let newPoints;
    newPoints = clipLine(pointCheckLine, [new BABYLON.Vector3(5, 10, 0), new BABYLON.Vector3(10, 5, 0)]);
    if (newPoints) createNewLine(newPoints);
}

const createSphere = (position, color) => {
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.3}, scene);
    sphere.color = color;
    sphere.position = position;
    return sphere;
}

let newLine;

const createNewLine = (line) => {
    newLine = BABYLON.MeshBuilder.CreateLines("newLine", {
        points: line, scene});
    newLine.color = new BABYLON.Color3(1, 0, 0);
    newLine.enableEdgesRendering();
    newLine.edgesWidth = 15.0;
    newLine.edgesColor = new BABYLON.Color4(1, 0, 0, 1);
    sphereANew = createSphere(line[0], new BABYLON.Color3(1, 0, 0));
    sphereBNew = createSphere(line[1], new BABYLON.Color3(1, 0, 0));
}

const pointCheckLine = [
    new BABYLON.Vector3(3, 4, -0.1), 
    new BABYLON.Vector3(2, 7, -0.1),
]
    
const createScene = async function () {
    await getFontData();
    createGUI();
    
    const shape = BABYLON.MeshBuilder.CreateLines("shape", {points: pointShape}, scene);
    shape.color = new BABYLON.Color3(0, 0, 0);
    const segment = BABYLON.MeshBuilder.CreateLineSystem("segment", {lines: lineSegment}, scene);
    segment.color = new BABYLON.Color3(0, 0, 0);
    
    createCheckLine(pointCheckLine);
}

createScene();
    
scene.onBeforeRenderObservable.add(() => {
    
});

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});