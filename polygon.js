const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.5, 0.5, 0.5);

const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 40, new BABYLON.Vector3(0, 0, 0));
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

const PointLocation = {
    LEFT: 1,
    RIGHT: -1,
    BEHIND: -1,
    BEYOND: 1,
    ORIGIN: 0,
    DESTINATION: 0,
    BETWEEN: 0
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = 0;
    }

    classify(p1, p2) {
        let p = this;
        let a = new Point(p2.x - p1.x, p2.y - p1.y);
        let b = new Point(p.x - p1.x, p.y - p1.y);
        let sa = a.x * b.y - b.x * a.y;
        if (sa > 0.0)
            return 1; //LEFT
        if (sa < 0.0)
            return -1; //RIGHT
        if ((a.x * b.x < 0.0) || (a.y * b.y < 0.0))
            return -1; //BEHIND
        if (a.length() < b.length())
            return 1; //BEYOND
        if (p1.equals(p))
            return 0; //ORIGIN
        if (p2.equals(p))
            return 0; //DESTINATION
        return 0; //BETWEEN
    }

    polarAngle() {
        let p = this;
        if (p.x == 0.0 && p.y == 0.0)
            return -1.0;
        if (p.x == 0.0)
            return (p.y > 0.0) ? 90.0 : 270.0;
        let theta = Math.atan(p.y / p.x) * 180.0 / Math.PI;
        if (p.x > 0.0)
            return (p.y >= 0.0) ? theta : 360.0 + theta;
        else
            return 180.0 + theta;
    }

    length() {
        let p = this;
        return Math.sqrt(p.x * p.x + p.y * p.y);
    }

    distance(p1, p2) {
        let dx = p1.x - p2.x;
        let dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    myOrientation(p0, p1, p2) {
        let a = new Point(p1.x - p0.x, p1.y - p0.y);
        let b = new Point(p2.x - p0.x, p2.y - p0.y);
        let sa = a.x * b.y - b.x * a.y;
        if (sa > 0.0)
            return 1; //против часовой
        if (sa < 0.0)
            return -1; //по часовой
        if ((a.x * b.x < 0.0) || (a.y * b.y < 0.0))
            return -1; //ONLINE_BACK
        if (a.length() < b.length())
            return 1; //ONLINE_FRONT
        if (p1.equals(p3))
            return 0; //ON_SEGMENT
        return 0; //ON_LINE
    }

    draw(color) {
        let p = this;
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.3 }, scene);
        sphere.position = new BABYLON.Vector3(p.x, p.y, p.z);

        sphere.material = new BABYLON.StandardMaterial("material", scene);
        sphere.material.diffuseColor = color || new BABYLON.Color3(0, 0, 0);
    }

    comparePoints(a, b) {
        if (a.x === b.x) {
            return a.y - b.y;
        }
        return a.x - b.x;
    }
}

class Polygon {
    constructor(points) {
        this.points = points;
        this.points = this.createPolygon(points);
    }
    
    createPolygon() {
        if (points.length < 3) {
            return points;
        }

        points.sort(points.comparePoints);

        // Построение верхней оболочки
        const upperHull = [];
        for (let i = 0; i < points.length; i++) {
            while (
                upperHull.length >= 2 &&
                points[i].myOrientation(
                    upperHull[upperHull.length - 2],
                    upperHull[upperHull.length - 1],
                    points[i]
                ) !== -1
            ) {
                upperHull.pop();
            }
            upperHull.push(points[i]);
        }

        // Построение нижней оболочки
        const lowerHull = [];
        for (let i = points.length - 1; i >= 0; i--) {
            while (
                lowerHull.length >= 2 &&
                points[i].myOrientation(
                    lowerHull[lowerHull.length - 2],
                    lowerHull[lowerHull.length - 1],
                    points[i]
                ) !== -1
            ) {
                lowerHull.pop();
            }
            lowerHull.push(points[i]);
        }

        // Объединяем обе оболочки
        const convexHull = upperHull
            .slice(0, upperHull.length - 1)
            .concat(lowerHull.slice(0, lowerHull.length - 1));

        return convexHull;
    }

    //нарисовать полигон
    draw() {
        let p = this.points;
        let n = p.length;
        for (let i = 0; i < n; i++) {
            let j = (i + 1) % n;
            let line = BABYLON.MeshBuilder.CreateLines("lines", { points: [new BABYLON.Vector3(p[i].x, p[i].y, p[i].z), new BABYLON.Vector3(p[j].x, p[j].y, p[j].z)] }, scene);
        }
    }

    //проверка на выпуклость
    isConvex() {
        let p = this.points;
        let n = p.length;
        let flag = 0;
        for (let i = 0; i < n; i++) {
            let j = (i + 1) % n;
            let k = (i + 2) % n;
            let z = (p[j].x - p[i].x) * (p[k].y - p[j].y);
            z -= (p[j].y - p[i].y) * (p[k].x - p[j].x);
            if (z < 0) {
                flag |= 1;
            }
            else if (z > 0) {
                flag |= 2;
            }
            if (flag == 3) {
                return false;
            }
        }
        if (flag != 0) {
            return true;
        }
        else {
            return false;
        }
    }

    size() {
        return this.points.length;
    }
    

    //проверка на принадлежность точки полигону
    inside(p) {
        let poly = this.points;
        let n = poly.length;
        let angle = 0.0;
        let p1x = poly[0].x - p.x;
        let p1y = poly[0].y - p.y;
        for (let i = 1; i <= n; i++) {
            let p2x = poly[i % n].x - p.x;
            let p2y = poly[i % n].y - p.y;
            let d = p1x * p2y - p2x * p1y;
            let t = p1x * p2x + p1y * p2y;
            angle += Math.atan2(d, t);
            p1x = p2x;
            p1y = p2y;
        }
        if (Math.abs(angle) < Math.PI) {
            return false;
        }
        else {
            return true;
        }
    }
}

pointInConvexPolygon = function (point, polygon) {
    if (polygon.size() == 1) return (point == polygon.points());
    if (polygon.size() == 2) {
        c = point.classify(polygon.points[0], polygon.points[1]);
        return (c == PointLocation.BETWEEN || c == PointLocation.ORIGIN || c == PointLocation.DESTINATION);
    }
    for (let i = 0; i < polygon.size() - 1; i++) {
        if (point.classify(polygon.points[i], polygon.points[i+1]) == PointLocation.LEFT) {
            return false;
        }
    }
    return true;
}

function leftToRightCmp (a, b) {
    if (a.x < b.x) {
        return -1;
    }
    if (a.x > b.x) {
        return 1;
    }
    if (a.y < b.y) {
        return -1;
    }
    if (a.y > b.y) {
        return 1;
    }
    return 0; 
}

function rightToLeftCmp (a, b) {
    return leftToRightCmp(b, a);
}

function leastPoint(polygon, func) {
    let least = polygon.points[0];
    for (let i = 1; i < polygon.size(); i++) {
        if (func(polygon.points[i], least) < 0) {
            least = polygon.points[i];
        }
    }
    return least;
}

const points = [
    new Point(1, 6),
    new Point(2, 2),
    new Point(5, 2),
    new Point(8, 4),
    new Point(4, 10),
];

points.forEach(point => {
    point.draw();
});

let polygon = new Polygon(points);
polygon.draw();
if (polygon.isConvex()) {
    console.log("Полигон выпуклый");
}
else {
    console.log("Полигон невыпуклый");
}

let pointsCheck = [
    new Point(1, 1),
    new Point(5, 5),
    new Point(8, 8),
];


leastPoint(polygon, leftToRightCmp).draw(new BABYLON.Color3(0, 0, 1));
leastPoint(polygon, rightToLeftCmp).draw(new BABYLON.Color3(0, 1, 1));

function insideOrOutside(polygon, point) {
    if (pointInConvexPolygon(point, polygon)) point.draw(new BABYLON.Color3(1, 0, 0));
    else point.draw(new BABYLON.Color3(0, 1, 0));
}

pointsCheck.forEach(point => {
    insideOrOutside(polygon, point);
});

//gui для ввода координат x и y и добавление точки на сцену в верхнем левом углу
const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
const panel = new BABYLON.GUI.StackPanel();
panel.width = "300px";
panel.fontSize = "26px";
panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
advancedTexture.addControl(panel);

const header = new BABYLON.GUI.TextBlock();
header.text = "Добавление точки";
header.height = "50px";
header.color = "white";
header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
header.paddingLeft = "10px";
header.paddingTop = "10px";
panel.addControl(header);

//два текста расположенных горизонтально с названием x и y. Под ними два окна ввода для ввода координат x и y
const xText = new BABYLON.GUI.TextBlock();
xText.text = "x:";
xText.height = "50px";
xText.color = "white";
xText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
xText.paddingLeft = "10px";
xText.paddingTop = "10px";
xText.right = "10px";
panel.addControl(xText);

const xInput = new BABYLON.GUI.InputText();
xInput.width = "100px";
xInput.height = "50px";
xInput.color = "white";
xInput.background = "black";
xInput.text = "0";
xInput.paddingTop = "-35px";
xInput.paddingBottom = "45px";
xInput.paddingLeft = "-40px";
panel.addControl(xInput);

const yText = new BABYLON.GUI.TextBlock();
yText.text = "y:";
yText.height = "50px";
yText.color = "white";
yText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
yText.paddingLeft = "10px";
yText.paddingTop = "-50px";
panel.addControl(yText);

const yInput = new BABYLON.GUI.InputText();
yInput.width = "100px";
yInput.height = "50px";
yInput.color = "white";
yInput.background = "black";
yInput.text = "0";
yInput.paddingTop = "-65px";
yInput.paddingBottom = "75px";
yInput.paddingLeft = "-40px";
panel.addControl(yInput);

const button = BABYLON.GUI.Button.CreateSimpleButton("but", "Добавить точку");
button.width = "240px";
button.height = "50px";
button.color = "white";
button.background = "black";
button.paddingTop = "-50px";
button.paddingBottom = "55px";
button.paddingLeft = "10px";
button.onPointerUpObservable.add(function () {
    let x = xInput.text;
    let y = yInput.text;
    let point = new Point(x, y);
    insideOrOutside(polygon, point);
});
panel.addControl(button);

scene.onBeforeRenderObservable.add(() => {
    
});

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});