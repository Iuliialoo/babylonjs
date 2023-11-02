//рисование графика y = x^2 

let pointsForGraphic = [];
let count = -10;
while ( count < 10) {
    pointsForGraphic.push(new BABYLON.Vector3(count, Math.pow(count, 2), 0));
    count += 0.1
}
let line = BABYLON.MeshBuilder.CreateLines("line", { points: pointsForGraphic }, scene);
line.color = new BABYLON.Color3(0, 0, 0);

//текст для системы координат