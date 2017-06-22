import * as THREE from 'three';
var scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let background: THREE.Scene;
let backgroundCamera: THREE.OrthographicCamera;
var geometry, material, mesh;

let pressed = {};

export function init() {
    document.body.onkeydown = (e) => {
        pressed[e.keyCode] = true;
        console.log(e.keyCode);
    }
    document.body.onkeyup = (e) => {
        pressed[e.keyCode] = false;
    }

    background = new THREE.Scene();
    backgroundCamera = new THREE.OrthographicCamera(0, 1, 0, 1, 0, 1000);


    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera.rotation.y = 1.5;
    camera.position.z = 9;
    camera.position.x = 6;
    camera.position.y = 0;
    var loader = new THREE.TextureLoader();
    loader.load('textures/walls.png', function (texture) {
        for (let i = 0; i < test.layers[0].data.length; i++) {
            if (test.layers[0].data[i] != 0) {
                var geometry = new THREE.CubeGeometry(1, 1, 1);
                let tileset = test.tilesets[0];
                let index = test.layers[0].data[i];
                let tw = tileset.tilewidth / tileset.imagewidth;
                let th = tileset.tileheight / tileset.imageheight;
                let tx = (index % tileset.columns) / tileset.columns;
                let ty = 1.0 - th - Math.floor(index / tileset.columns) * th;
                console.log(tx);
                console.log(ty);
                //  var uvs = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)];
                let uvs = [new THREE.Vector2(tx, ty), new THREE.Vector2(tx + tw, ty), new THREE.Vector2(tx + tw, ty + th), new THREE.Vector2(tx, ty + th)];
                geometry.faceVertexUvs[0] = [];
                for (let i = 0; i < 6 * 2; i += 2) {
                    geometry.faceVertexUvs[0][i] = [uvs[3], uvs[0], uvs[2]];
                    geometry.faceVertexUvs[0][i + 1] = [uvs[0], uvs[1], uvs[2]];
                }

                var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });

                let x = i % 16;
                let y = Math.floor(i / 16);
                var mesh = new THREE.Mesh(geometry, material);
                mesh.translateX(x);
                mesh.translateZ(y);
                scene.add(mesh);
                background.add(new THREE.Mesh(new THREE.CubeGeometry(2, 1, 1), new THREE.MeshBasicMaterial({ color: "#383838", overdraw: 0.5, depthTest: false })));
                let bottom = new THREE.Mesh(new THREE.CubeGeometry(2, 1, 1), new THREE.MeshBasicMaterial({ color: "#707070", overdraw: 0.5, depthTest: false }));
                bottom.translateY(1);
                background.add(bottom);
            }
        }


        animate();
    });


    renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false;
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

export function animate() {

    requestAnimationFrame(animate);
    //  mesh.rotation.x += 0.01;
    //  mesh.rotation.y += 0.02;
    let rotation = 0.05;
    if (pressed[37])
        camera.rotateY(rotation);
    else if (pressed[39])
        camera.rotateY(-rotation);

    let speed = 0.05;
    let v = new THREE.Vector3();
    if (pressed[38])
        camera.translateZ(-speed);
    else if (pressed[40])
        camera.translateZ(speed);

    renderer.autoClear = false;
    renderer.clear();
    renderer.render(background, backgroundCamera);
    renderer.render(scene, camera);


}

var test = {
    "height": 16,
    "layers": [
        {
            "data": [1, 1, 1, 7, 1, 1, 0, 0, 15, 15, 15, 15, 15, 15, 0, 0, 1, 0, 0, 0, 0, 1, 15, 15, 15, 0, 0, 0, 0, 15, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 15, 0, 0, 1, 0, 0, 0, 0, 1, 15, 15, 15, 0, 0, 0, 0, 15, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 0, 15, 15, 0, 0, 0, 33, 33, 33, 33, 33, 33, 0, 0, 0, 33, 0, 33, 0, 0, 0, 0, 33, 0, 0, 0, 0, 33, 0, 0, 0, 33, 0, 33, 0, 0, 0, 0, 33, 0, 105, 0, 0, 33, 33, 33, 33, 33, 0, 33, 0, 0, 0, 0, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 33, 0, 0, 0, 0, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "height": 16,
            "name": "Tile Layer 1",
            "opacity": 1,
            "type": "tilelayer",
            "visible": true,
            "width": 16,
            "x": 0,
            "y": 0
        }],
    "nextobjectid": 1,
    "orientation": "orthogonal",
    "renderorder": "right-down",
    "tiledversion": "1.0.1",
    "tileheight": 64,
    "tilesets": [
        {
            "columns": 6,
            "firstgid": 1,
            "image": "textures\/walls.png",
            "imageheight": 1216,
            "imagewidth": 384,
            "margin": 0,
            "name": "walls",
            "spacing": 0,
            "tilecount": 114,
            "tileheight": 64,
            "tilewidth": 64
        }],
    "tilewidth": 64,
    "type": "map",
    "version": 1,
    "width": 16
}