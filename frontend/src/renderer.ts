import * as THREE from 'three';
import { Map } from './map';
var scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let background: THREE.Scene;
let backgroundCamera: THREE.OrthographicCamera;
var geometry, material, mesh;

let pressed = {};

export function init(map: Map) {
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
    camera.translateZ(map.layers[1].objects[0].y / 64);
    camera.translateX(map.layers[1].objects[0].x / 64);
    camera.rotation.y = -1.5;

    var loader = new THREE.TextureLoader();
    loader.load('textures/walls.png', function (texture) {
        var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
        for (let i = 0; i < map.layers[0].data.length; i++) {
            if (map.layers[0].data[i] != 0) {
                var geometry = new THREE.CubeGeometry(1, 1, 1);
                let tileset = map.tilesets[0];
                let index = map.layers[0].data[i];
                let tw = tileset.tilewidth / tileset.imagewidth;
                let th = tileset.tileheight / tileset.imageheight;
                let tx = (index % tileset.columns) / tileset.columns;
                let ty = 1.0 - th - Math.floor(index / tileset.columns) * th;
                //  var uvs = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)];
                let uvs = [new THREE.Vector2(tx, ty), new THREE.Vector2(tx + tw, ty), new THREE.Vector2(tx + tw, ty + th), new THREE.Vector2(tx, ty + th)];
                geometry.faceVertexUvs[0] = [];
                for (let i = 0; i < 6 * 2; i += 2) {
                    geometry.faceVertexUvs[0][i] = [uvs[3], uvs[0], uvs[2]];
                    geometry.faceVertexUvs[0][i + 1] = [uvs[0], uvs[1], uvs[2]];
                }

                

                let x = i % map.layers[0].width;
                let y = Math.floor(i / map.layers[0].width);
                var mesh = new THREE.Mesh(geometry, material);
                mesh.translateX(x);
                mesh.translateZ(y);
                scene.add(mesh);
               
            }
        }

         background.add(new THREE.Mesh(new THREE.CubeGeometry(2, 1, 1), new THREE.MeshBasicMaterial({ color: "#383838", overdraw: 0.5, depthTest: false })));
                let bottom = new THREE.Mesh(new THREE.CubeGeometry(2, 1, 1), new THREE.MeshBasicMaterial({ color: "#707070", overdraw: 0.5, depthTest: false }));
                bottom.translateY(1);
                background.add(bottom);


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
    let rotation = 0.10;
    if (pressed[37])
        camera.rotateY(rotation);
    else if (pressed[39])
        camera.rotateY(-rotation);

    let speed = 0.05*4;
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