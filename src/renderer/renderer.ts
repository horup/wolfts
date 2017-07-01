import * as THREE from 'three';
import * as Model from '../model';
import System from '../system';
import Sync from './sync';
import Input from './input';
import * as Managers from './managers';
export default class Renderer
{
    frames = 0;
    scene:THREE.Scene = new THREE.Scene(); 
    managers:Managers.Manager[];
    width:number;
    height:number;
    input:Input;
    renderer:THREE.WebGLRenderer;
    camera:THREE.Camera;
    system:System;
    textures = {sprites:null as THREE.Texture, walls:null as THREE.Texture};
    constructor(system:System)
    {
        this.system = system;
        let loader = new THREE.TextureLoader();
        loader.load("dist/textures/sprites.png", (tex1) => 
        {
            loader.load('dist/textures/walls.png', (tex2) => 
            {
                tex1.magFilter = THREE.NearestFilter;
                tex1.minFilter = THREE.NearestFilter;
                tex2.magFilter = THREE.NearestFilter;
                tex2.minFilter = THREE.NearestFilter;
                this.textures.sprites = tex1;
                this.textures.walls = tex2;
                this.input = new Input();
                this.renderer = new THREE.WebGLRenderer();
                this.renderer.autoClear = false;
                this.resize();
                this.managers = [
                    new Managers.CameraManager(this.camera, this.input),
                    new Managers.GridManager(this.scene),
                    new Managers.SpriteManager(this.scene)
                    ] as Managers.Manager[];
                document.body.appendChild(this.renderer.domElement);
                this.animate();
            });
        });
    }

    private resize()
    {
        if (this.width != window.innerWidth || this.height != window.innerHeight)
        {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
            this.camera.up.set(0,0,1);
            this.camera.translateZ(0.5);
            this.camera.translateX(30.5);
            this.camera.translateY(-54.5);
            this.camera.lookAt(new THREE.Vector3(32, -32, 0.5));
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    }

    private animate()
    {
        this.resize();
        this.input.handle();
        this.system.update(this.input.state);
        
        let time = new Date().getTime();

        for (let manager of this.managers)
        {
            manager.update(this.system.world);
        }

        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(()=>this.animate());
        this.system.clearFlags();
        let elapsed = (new Date().getTime()) - time;
       
        if (this.frames++ % 60 == 0)
        {
            document.getElementById('info').innerHTML = elapsed + "ms";
        }

        requestAnimationFrame(()=>this.animate());
    }

    private attachedEntity:Model.Entity = null;

    private attachCamera(entity:Model.Entity)
    {

    }
}