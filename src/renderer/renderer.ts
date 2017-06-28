import * as THREE from 'three';
import * as Model from '../model';
import System from '../system';
import * as Sync from './sync';
import Input from './input';

export default class Renderer
{
    input:Input;
    renderer:THREE.WebGLRenderer;
    camera:THREE.Camera;
    gridScene:THREE.Scene;
    entitiesScene:THREE.Scene;
    system:System;
    textures = {sprites:null as THREE.Texture, walls:null as THREE.Texture};
    constructor(system:System)
    {
        this.system = system;
    }

    private initRenderer()
    {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.autoClear = false;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    private initTextures()
    {
        let loader = new THREE.TextureLoader();
        loader.load("textures/sprites.png", (tex1) => 
        {
            tex1.magFilter = THREE.NearestFilter;
            tex1.minFilter = THREE.NearestFilter;
            loader.load('textures/walls.png', (tex2) => 
            {
                tex2.magFilter = THREE.NearestFilter;
                tex2.minFilter = THREE.NearestFilter;
                this.textures.sprites = tex1;
                this.textures.walls = tex2;
                this.initRenderer();
                this.animate();
            });
        });
    }

    test = {};

    private syncScene()
    {
        let world = this.system.world;
        let system = this.system;

        if (system.flags.gridReload)
        {
            Sync.syncGrid(world, this.gridScene, this.textures.walls);
        }
        if (system.flags.entitiesReload)
        {
            Sync.syncEntities(world, this.entitiesScene, this.textures.sprites);
        }
    }

    private animate()
    {
        this.input.handle(this.camera);
        this.system.update();
        this.syncScene();
        let time = new Date().getTime();
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.render(this.gridScene, this.camera);
         this.renderer.render(this.entitiesScene, this.camera);
        requestAnimationFrame(()=>this.animate());
        this.system.clearFlags();
        let elapsed = (new Date().getTime()) - time;
        console.log(elapsed + "ms");
    }

    init()
    {
        this.input = new Input();
        this.gridScene = new THREE.Scene();
        this.entitiesScene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
        this.camera.up.set(0,0,1);
        this.camera.translateZ(0.5);
        this.camera.translateX(30.5);
        this.camera.translateY(-54.5);
        this.camera.lookAt(new THREE.Vector3(32, -32, 0.5));
        this.initTextures();
    }
}