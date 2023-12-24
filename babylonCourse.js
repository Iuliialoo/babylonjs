const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    // const light = new BABYLON.PointLight("light2", new BABYLON.Vector3(-10, 10, -10), scene);
    // light.intensity = 0.8;
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    // const groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
    // groundMaterial.emissiveTexture = new BABYLON.Texture("/assets/img/grass.jpg", scene)

    const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
    largeGroundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png");

    const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "/assets/img/villageheightmap.png", 
    {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10});
    largeGround.material = largeGroundMat;

    // Создание земли деревни
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/villagegreen.png");
    groundMat.diffuseTexture.hasAlpha = true;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:24, height:24});
    ground.material = groundMat;

    largeGround.position.y = -0.01;


    //sky
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/assets/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "/assets/img/palm.png", 2000, {width: 512, height: 1024}, scene);

    //We create trees at random positions
    for (let i = 0; i < 500; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (-30);
        tree.position.z = Math.random() * 20 + 8;
        tree.position.y = 0.5;
    }

    for (let i = 0; i < 500; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (25) + 7;
        tree.position.z = Math.random() * -35  + 8;
        tree.position.y = 0.5;
    }

    const spriteManagerUFO = new BABYLON.SpriteManager("UFOManager","https://assets.babylonjs.com/environments/ufo.png", 1, {width: 128, height: 76});
    const ufo = new BABYLON.Sprite("ufo", spriteManagerUFO);
    ufo.playAnimation(0, 16, true, 125);
    ufo.position.y = 3;
    ufo.position.z = 0;
    ufo.width = 2;
    ufo.height = 1;


    camera.upperBetaLimit = Math.PI / 2.2;
        
    //house
    BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon").then((result) => {
        // const house1 = scene.getMeshByName("detached_house");
        const ground = result.meshes[0];
        ground.setEnabled(false);
        const house1 = result.meshes[1];
        const house2 = result.meshes[2];
    });
    
    const car = buildCar();

    const wheelUV = [];
    wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
    wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

    //car material
    const wheelMat = new BABYLON.StandardMaterial("wheelMat");
    wheelMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png");
    
    const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: wheelUV})
    wheelRB.material = wheelMat;
    wheelRB.parent = car;
    wheelRB.position.z = -0.1;
    wheelRB.position.x = -0.2;
    wheelRB.position.y = 0.035;
    
    wheelRF = wheelRB.clone("wheelRF");
    wheelRF.position.x = 0.1;
    
    wheelLB = wheelRB.clone("wheelLB");
    wheelLB.position.y = -0.2 - 0.035;
    
    wheelLF = wheelRF.clone("wheelLF");
    wheelLF.position.y = -0.2 - 0.035;
    
    car.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0);
    car.position = new BABYLON.Vector3(0, (0.2 - 0.035) * 1.8, -3);
    car.scaling = new BABYLON.Vector3(1.8, 1.8, 1.8);
    
    //Animate the Wheels
    const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    const wheelKeys = []; 

    wheelKeys.push({
        frame: 0,
        value: 0
    });

    wheelKeys.push({
        frame: 30,
        value: 2 * Math.PI
    });

    animWheel.setKeys(wheelKeys);
    wheelRB.animations = [];
    wheelRB.animations.push(animWheel);
    wheelRF.animations = [];
    wheelRF.animations.push(animWheel);
    wheelLB.animations = [];
    wheelLB.animations.push(animWheel);
    wheelLF.animations = [];
    wheelLF.animations.push(animWheel);
    
    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);

    const animCar = new BABYLON.Animation("carAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const carKeys = []; 
    carKeys.push({
        frame: 0,
        value: -3
    });
    carKeys.push({
        frame: 150,
        value: 6
    });
    carKeys.push({
        frame: 200,
        value: 6
    });
    animCar.setKeys(carKeys);

    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 100, true);

    BABYLON.SceneLoader.ImportMeshAsync("him", "/assets/human/", "dude.babylon", scene).then((result) => {
        var dude = result.meshes[0];
        dude.position = new BABYLON.Vector3(0, 0, -1);
        dude.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        dude.rotation = new BABYLON.Vector3(0, Math.PI * 2, 0);
                
        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
    });

    createFountain(scene);
    crateLamp(scene);

    return scene;
};

const buildCar = () => {
    const outline = [
        new BABYLON.Vector3(-0.3, 0, -0.1),
        new BABYLON.Vector3(0.2, 0, -0.1),
    ]

    for (let i = 0; i < 20; i++) {
        outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
    }

    outline.push(new BABYLON.Vector3(0, 0, 0.1));
    outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

    const faceUV = [];
    faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
    faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

    //car material
    const carMat = new BABYLON.StandardMaterial("carMat");
    carMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/car.png");

    const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2, faceUV: faceUV, wrap: true});
    car.material = carMat;

    return car;
}

// const Cube = () => {
//     const points = [];
//     points.push(new BABYLON.Vector3(2, 10, 2));
//     points.push(new BABYLON.Vector3(2, 14, 2));
//     points.push(new BABYLON.Vector3(2, 10, -2));
//     points.push(new BABYLON.Vector3(2, 14, -2));
//     points.push(new BABYLON.Vector3(-2, 10, -2));
//     points.push(new BABYLON.Vector3(-2, 14, -2));
//     points.push(new BABYLON.Vector3(-2, 10, 2));
//     points.push(new BABYLON.Vector3(-2, 14, 2));

//     const pointsCubeTop = [];
//     for (let i = 0; i < points.length; i += 2) {
//         pointsCubeTop.push(points[i])
//     }
//     pointsCubeTop.push(pointsCubeTop[0]);

//     const pointsCubeBottom = [];
//     for (let i = 1; i < points.length; i += 2) {
//         pointsCubeBottom.push(points[i])
//     }
//     pointsCubeBottom.push(pointsCubeBottom[0]);

//     BABYLON.MeshBuilder.CreateLines("cubeTop", {points: pointsCubeTop})
//     BABYLON.MeshBuilder.CreateLines("cubeBottom", {points: pointsCubeBottom})
//     for (let i = 0; i < points.length; i += 2) {
//         BABYLON.MeshBuilder.CreateLines("cubeH", {points: [points[i], points[i+1]]})
//     }
// }

const createFountain = (scene) => {
    //partical
    let switched = false;
    const pointerDown = (mesh) => {
        if (mesh === fountain) {
            switched = !switched;
            if(switched) {
                // Start the particle system
                particleSystem.start();
            }
            else {
                // Stop the particle system
                particleSystem.stop();
            }
        }

    }

    scene.onPointerObservable.add((pointerInfo) => {      	
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if(pointerInfo.pickInfo.hit) {
                    pointerDown(pointerInfo.pickInfo.pickedMesh)
                }
                break;
        }
    });

    const fountainProfile = [
		new BABYLON.Vector3(0, 0, 0),
		new BABYLON.Vector3(10, 0, 0),
        new BABYLON.Vector3(10, 4, 0),
		new BABYLON.Vector3(8, 4, 0),
        new BABYLON.Vector3(8, 1, 0),
        new BABYLON.Vector3(1, 2, 0),
		new BABYLON.Vector3(1, 15, 0),
		new BABYLON.Vector3(3, 17, 0)
	];
	
	//Create lathe
	const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    fountain.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    fountain.position.x = 5;

    var particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/flare.png", scene);

    // Where the particles come from
    particleSystem.emitter = new BABYLON.Vector3(5, 1.7, 0); // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.3;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 3.5;

    // Emission rate
    particleSystem.emitRate = 1500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-1, 3, 1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 3, -1);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.025;

    // Start the particle system
    particleSystem.start();

}

const crateLamp = (scene) => {
    const lampLight = new BABYLON.SpotLight("lampLight", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0), Math.PI, 1, scene);
    lampLight.diffuse = BABYLON.Color3.Yellow();

	//shape to extrude
	const lampShape = [];
    for(let i = 0; i < 20; i++) {
        lampShape.push(new BABYLON.Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
    }
	lampShape.push(lampShape[0]); //close shape

	//extrusion path
    const lampPath = [];
	lampPath.push(new BABYLON.Vector3(0, 0, 0));
	lampPath.push(new BABYLON.Vector3(0, 10, 0));
    for(let i = 0; i < 20; i++) {
        lampPath.push(new BABYLON.Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
    }
    lampPath.push(new BABYLON.Vector3(3, 11, 0));

    const yellowMat = new BABYLON.StandardMaterial("yellowMat");
    yellowMat.emissiveColor = BABYLON.Color3.Yellow();

	//extrude lamp
	const lamp = BABYLON.MeshBuilder.ExtrudeShape("lamp", {cap: BABYLON.Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5});
	
    //add bulb
    const bulb = BABYLON.MeshBuilder.CreateSphere("bulb", {diameterX: 1.5, diameterZ: 0.8});
    
    bulb.material = yellowMat;
    bulb.parent = lamp;
    bulb.position.x = 2;
    bulb.position.y = 10.5;

    lampLight.parent = bulb;

    lamp.position = new BABYLON.Vector3(-3, 0, -2);
    lamp.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
}



const scene = createScene(); 

const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.25});
sphere.position = new BABYLON.Vector3(2, 5, 2);

const points = [];
points.push(new BABYLON.Vector3(2, 5, 2));
points.push(new BABYLON.Vector3(2, 5, -2));
points.push(new BABYLON.Vector3(-2, 5, -2));
points.push(points[0]);

BABYLON.MeshBuilder.CreateLines("triangle", {points: points})

const slide = function (turn, dist) { // после покрытия dist применяем поворот
    this.turn = turn;
    this.dist = dist;
}

const track = [];
track.push(new slide(Math.PI / 2, 4));  // длина первой стороны 4
track.push(new slide(3 * Math.PI / 4, 8));// на финише второй стороны пройденное расстояние 4 + 4
track.push(new slide(3 * Math.PI / 4, 8 + 4 * Math.sqrt(2))); // все три стороны покрывают расстояние 4 + 4 + 4 * sqrt(2)

let distance = 0;
let step = 0.05;
let p = 0;

scene.onBeforeRenderObservable.add(() => {
    sphere.movePOV(0, 0, step);
    distance += step;
            
    if (distance > track[p].dist) {        
        sphere.rotate(BABYLON.Axis.Y, track[p].turn, BABYLON.Space.LOCAL);
        p +=1;
        p %= track.length;
        if (p === 0) {
            distance = 0;
            sphere.position = new BABYLON.Vector3(2, 5, 2); //reset to initial conditions
            sphere.rotation = BABYLON.Vector3.Zero();//prevents error accumulation
        }
    }
});

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});