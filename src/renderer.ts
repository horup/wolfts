import * as THREE from 'three';
import * as Model from './model';
var scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let background: THREE.Scene;
let backgroundCamera: THREE.OrthographicCamera;
var geometry, material, mesh;

let mouseDown = false;
let mouseX = 0;
let mouseY = 0;
let startMouseX = 0;
let startMouseY = 0;
let pressed = {};

export function init(map: Model.Map) {

    document.body.onmousedown = (e) =>
    {
        mouseDown = true;
        startMouseX = e.offsetX;
        startMouseY = e.offsetY;
        document.body.onmousemove(e);
    }
    document.body.onmouseup = (e) =>
    {
        mouseDown = false;
    }
    document.body.onmousemove = (e) =>
    {
        let x = e.offsetX - startMouseX;
        let y = e.offsetY - startMouseY;
        mouseX = x / document.body.clientWidth * 2;
        mouseY = y / document.body.clientHeight * 2;
        console.log(mouseY);
    }

    document.addEventListener('touchstart', (e)=>
    {
        document.body.onmousedown({offsetX:e.touches[0].clientX, offsetY:e.touches[0].clientY} as any);
    });

     document.addEventListener('touchmove', (e)=>
    {
        document.body.onmousemove({offsetX:e.touches[0].clientX, offsetY:e.touches[0].clientY} as any);
    });

    document.addEventListener('touchend', (e)=>
    {
        document.body.onmouseup({offsetX:0, offsetY:0} as any);
    });

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
   /* loader.load('textures/walls.png', function (texture) {
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
    });*/
    loader.load("textures/sprites.png", (spritesTextuure) => {
        spritesTextuure.magFilter = THREE.NearestFilter;
        spritesTextuure.minFilter = THREE.NearestFilter;
        {
            let material = new THREE.MeshBasicMaterial({ map: spritesTextuure, overdraw: 0.5, transparent: true, alphaTest: 0.5 });
            for (let sprite of map.layers[1].objects)
            {
              /*  let px = 1.0 / map.tilesets[1].imagewidth;
                let geometry = new THREE.CubeGeometry(1, 1, 1);
                let tileset = map.tilesets[1];
                let index = sprite.gid - 256 - 1;
                let tw = tileset.tilewidth / tileset.imagewidth - px;
                let th = tileset.tileheight / tileset.imageheight;
                let tx = (index % tileset.columns) / tileset.columns + px / 2;
                let ty = 1.0 - th - Math.floor(index / tileset.columns) * th;
                let uvs = [new THREE.Vector2(tx, ty), new THREE.Vector2(tx + tw, ty), new THREE.Vector2(tx + tw, ty + th), new THREE.Vector2(tx, ty + th)];
                geometry.faceVertexUvs[0] = [];
                for (let i = 0; i < 6 * 2; i += 2) {
                    geometry.faceVertexUvs[0][i] = [uvs[3], uvs[0], uvs[2]];
                    geometry.faceVertexUvs[0][i + 1] = [uvs[0], uvs[1], uvs[2]];
                }

                geometry.translate(sprite.x/64, 0, sprite.y/64);
                var mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);*/
                let px = 1.0 / map.tilesets[1].imagewidth;
                let geometry = new THREE.CubeGeometry(1, 1, 1);
                let tileset = map.tilesets[1];
                let index = sprite.gid - 256 - 1;
                let tw = tileset.tilewidth / tileset.imagewidth - px;
                let th = tileset.tileheight / tileset.imageheight;
                let tx = (index % tileset.columns) / tileset.columns + px / 2;
                let ty = 1.0 - th - Math.floor(index / tileset.columns) * th;
                let uvs = [new THREE.Vector2(tx, ty), new THREE.Vector2(tx + tw, ty), new THREE.Vector2(tx + tw, ty + th), new THREE.Vector2(tx, ty + th)];
                geometry.faceVertexUvs[0] = [];
                for (let i = 0; i < 6 * 2; i += 2) {
                    geometry.faceVertexUvs[0][i] = [uvs[3], uvs[0], uvs[2]];
                    geometry.faceVertexUvs[0][i + 1] = [uvs[0], uvs[1], uvs[2]];
                }

                geometry.translate(sprite.x/64, 0, sprite.y/64);
                var mesh = new THREE.Mesh(geometry, material);

                let tex = spritesTextuure.clone();
                tex.uuid = spritesTextuure.uuid;

                tex.offset.x = tx;
                tex.offset.y = ty;
                tex.repeat.x = 1/16;
                tex.repeat.y = 1/16;
                
                                tex.needsUpdate = true;
                let sp = new THREE.Sprite(new THREE.SpriteMaterial({map:tex}));
                sp.translateX(sprite.x / 64);
                sp.translateZ(sprite.y / 64);
                scene.add(sp);
                

            }
        }

        {
            loader.load('textures/walls.png', function (wallsTexture) {
                wallsTexture.magFilter = THREE.NearestFilter;
                wallsTexture.minFilter = THREE.NearestFilter;
                let mapGeometry = new THREE.Geometry();
                let material = new THREE.MeshBasicMaterial({ map: wallsTexture, overdraw: 0.5 });
                for (let i = 0; i < map.layers[0].data.length; i++) {
                    if (map.layers[0].data[i] != 0) {
                        let px = 1.0 / map.tilesets[0].imagewidth;
                        let geometry = new THREE.CubeGeometry(1, 1, 1);
                        let tileset = map.tilesets[0];
                        let index = map.layers[0].data[i] - 1;
                        let tw = tileset.tilewidth / tileset.imagewidth - px;
                        let th = tileset.tileheight / tileset.imageheight;
                        let tx = (index % tileset.columns) / tileset.columns + px / 2;
                        let ty = 1.0 - th - Math.floor(index / tileset.columns) * th;
                        let uvs = [new THREE.Vector2(tx, ty), new THREE.Vector2(tx + tw, ty), new THREE.Vector2(tx + tw, ty + th), new THREE.Vector2(tx, ty + th)];
                        geometry.faceVertexUvs[0] = [];
                        for (let i = 0; i < 6 * 2; i += 2) {
                            geometry.faceVertexUvs[0][i] = [uvs[3], uvs[0], uvs[2]];
                            geometry.faceVertexUvs[0][i + 1] = [uvs[0], uvs[1], uvs[2]];
                        }

                        let x = i % map.layers[0].width;
                        let y = Math.floor(i / map.layers[0].width);
                        for (let vertice of geometry.vertices) {
                            vertice.x += x;
                            vertice.z += y;
                        }

                        THREE.GeometryUtils.merge(mapGeometry, geometry);
                    }
                }

                console.log(mapGeometry);

                var mesh = new THREE.Mesh(mapGeometry, material);
                scene.add(mesh);

                background.add(new THREE.Mesh(new THREE.CubeGeometry(2, 1, 1), new THREE.MeshBasicMaterial({ color: "#383838", overdraw: 0.5, depthTest: false })));
                let bottom = new THREE.Mesh(new THREE.CubeGeometry(2, 1, 1), new THREE.MeshBasicMaterial({ color: "#707070", overdraw: 0.5, depthTest: false }));
                bottom.translateY(1);
                background.add(bottom);


                animate();
            });
        }
    });


    renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false;
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

export function animate() {
    let time = new Date().getTime();
    requestAnimationFrame(animate);
    let speed = 0.05*4;
    let rotation = 0.05;
    {
        if (pressed[37])
            camera.rotateY(rotation);
        else if (pressed[39])
            camera.rotateY(-rotation);

        let v = new THREE.Vector3();
        if (pressed[38])
            camera.translateZ(-speed);
        else if (pressed[40])
            camera.translateZ(speed);
    }
    {
        if (mouseDown)
        {
            camera.rotateY(rotation * -mouseX);
            camera.translateZ(speed*mouseY);
        }
    }

    renderer.autoClear = false;
    renderer.clear();
    renderer.render(background, backgroundCamera);
    renderer.render(scene, camera);
}