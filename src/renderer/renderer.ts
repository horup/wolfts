import * as THREE from 'three';
import * as Model from '../model';
import System from '../system';
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
    textures:THREE.Texture[] = [];
    loader = new THREE.TextureLoader();
    numTextures = 0;
    
    loadTexture(path:string)
    {
        let index = this.numTextures;
        this.numTextures++;
        this.loader.load(path, (tex) =>
        {
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            this.numTextures--;
            this.textures[index] = tex;
            if (this.numTextures == 0)
            {
                this.textureLoaded();
            }
        })
    }

    textureLoaded()
    {
        this.input = new Input();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.autoClear = false;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
        this.resize();
        this.managers = [
            new Managers.CameraManager(this.camera, this.input),
            new Managers.AnimationManager(this.camera),
            new Managers.GridManager(this.scene, this.textures[0]),
            new Managers.BlockManager(this.scene, this.textures[0], 0),
            new Managers.SpriteManager(this.scene, this.textures[0], this.camera, 0),
            new Managers.SpriteManager(this.scene, this.textures[1], this.camera, 1),
            new Managers.SpriteManager(this.scene, this.textures[2], this.camera, 2)
            ] as Managers.Manager[];
        document.body.appendChild(this.renderer.domElement);
        this.animate();
    }

    constructor(system:System)
    {
        this.system = system;
        this.loadTexture("dist/textures/walls.png");
        this.loadTexture("dist/textures/sprites.png");
        this.loadTexture("dist/textures/guard.png");
    }

    private resize()
    {
        if (this.width != window.innerWidth || this.height != window.innerHeight)
        {
            let cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
            this.camera.copy(cam);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.up.set(0,0,1);
            this.camera.position.set(0, 0, 0.5);
            
            this.camera.lookAt(new THREE.Vector3(32, -32, 0.5));
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    }

    lambda = ()=>this.animate();
    private animate()
    {
        let time = new Date().getTime();
        this.resize();
        this.input.handle();
        this.system.update(this.input.state);

        for (let manager of this.managers)
        {
            manager.update(this.system.world);
        }

        this.renderer.render(this.scene, this.camera);

        let elapsed = (new Date().getTime()) - time;
       
        if (this.frames++ % 60 == 0)
        {
            document.getElementById('info').innerHTML = elapsed + "ms";
        }

        requestAnimationFrame(this.lambda);
    }

    private attachedEntity:Model.Entity = null;

    private attachCamera(entity:Model.Entity)
    {

    }
}