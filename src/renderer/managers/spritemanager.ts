import * as THREE from 'three';
import * as Model from '../../model';
import Manager from './manager';
export default class SpriteManager extends Manager
{
    length:number = 0;
    group:THREE.Group;
    spriteMesh:THREE.Mesh;
    spriteMaterial:THREE.Material;
    camera:THREE.Camera;
    sheetIndex:number;
    constructor(scene:THREE.Scene, spriteTexture:THREE.Texture, camera:THREE.Camera, sheetIndex:number)
    {
        super();
        this.sheetIndex = sheetIndex;
        this.camera = camera;
        this.spriteMaterial = new THREE.MeshBasicMaterial({ map: spriteTexture, overdraw: 0.5, side:THREE.DoubleSide, transparent:true, alphaTest:0.5});
        this.group = new THREE.Group();
        scene.add(this.group);
    }
    
    dispose()
    {
        if (this.spriteMesh != null)
        {
            this.spriteMesh.geometry.dispose();
            this.group.remove(this.spriteMesh);
        }
    }

    planeTemplateVertices = [
    -0.5, 0,  0.5, 
    -0.5, 0, -0.5, 
     0.5, 0,  0.5, 
    -0.5, 0, -0.5,
     0.5, 0, -0.5,
     0.5, 0, 0.5
    ];

    n = new THREE.Vector3();
    ax = new THREE.Vector3();
    ay = new THREE.Vector3();
    dv = new THREE.Vector3(0, -1, 0);
    vx = new THREE.Vector3();
    vy = new THREE.Vector3();

    update(world:Model.World)
    {
        
        if (this.length < world.entities.length)
        {
            let t = new THREE.Vector3(1, 0.5, 0);
            let t2 = new THREE.Vector3(0, 1 ,0);
            this.dispose();
            this.length = world.entities.length * 2;
            let geometry = new THREE.PlaneGeometry(1,1);
            let final = new THREE.Geometry();
            for (let i = 0; i < this.length; i++)
            {
                final.merge(geometry, new THREE.Matrix4());
            }

            let bufferGeometry = new THREE.BufferGeometry();
            bufferGeometry.fromGeometry(final);
            this.spriteMesh = new THREE.Mesh(bufferGeometry, this.spriteMaterial);
            this.group.add(this.spriteMesh);
        }

        let buffer = this.spriteMesh.geometry as THREE.BufferGeometry;
        let position = buffer.getAttribute('position').array as any[];
        let uv = buffer.getAttribute('uv').array as any[];
        let vp = 0;
        let uvp = 0;     
        
        this.ay.set(this.n.x, this.n.y, 0);
        this.ax.set(-this.ay.y, this.ay.x, 0);
        let draw = 0;
        for (let entity of world.entities)
        {
            if (entity.sprite != null && entity.spatial != null && entity.sprite.sheet == this.sheetIndex)
            {
                let sprite = entity.sprite;
                let spatial = entity.spatial;
                this.camera.getWorldDirection(this.n);
                this.n.multiplyScalar(-1);
                if (entity.sprite.flat)
                {
                    this.n.set(Math.cos(spatial.facing), Math.sin(spatial.facing), 0);
                }

                this.ay.set(this.n.x, this.n.y, 0);
                this.ax.set(-this.ay.y, this.ay.x, 0);
                
                for (let i = 0; i < this.planeTemplateVertices.length; i++)
                {
                    position[vp+i] = this.planeTemplateVertices[i];
                }

                let px = 0.0;
                let tw = 1 / sprite.sheetSize;
                let th = 1 / sprite.sheetSize;

                let index = entity.sprite.index;
                let tx = (index % sprite.sheetSize) / sprite.sheetSize + px / 2;
                let ty = 1.0 - th - Math.floor(index / sprite.sheetSize) * th;

                uv[uvp++] = tx;
                uv[uvp++] = ty + th;
                uv[uvp++] = tx;
                uv[uvp++] = ty;
                uv[uvp++] = tx + tw;
                uv[uvp++] = ty + th;

                uv[uvp++] = tx;
                uv[uvp++] = ty;
                uv[uvp++] = tx + tw;
                uv[uvp++] = ty;
                uv[uvp++] = tx + tw;
                uv[uvp++] = ty + th;

                for (let i = 0; i < this.planeTemplateVertices.length; i+=3)
                {
                    this.vx.set(position[vp+i], position[vp+i+1], 0);
                    this.vy.set(position[vp+i], position[vp+i+1], 0);
                    this.vx.projectOnVector(this.ax);
                    this.vy.projectOnVector(this.ay);
                    position[vp+i] = this.vx.length() * Math.sign(this.vx.dot(this.ax));
                    position[vp+i+1] = this.vy.length() * Math.sign(this.vy.dot(this.ay));
                }

                for (let i = 0; i < 6; i++)
                {
                    position[vp++] += spatial.position[0] + sprite.offset[0];
                    position[vp++] += spatial.position[1] + sprite.offset[1];
                    position[vp++] += spatial.position[2] + sprite.offset[2];
                }

                draw++;
            }
        }

        buffer.setDrawRange(0, draw*6);
        (buffer.attributes as any).position.needsUpdate = true;
        (buffer.attributes as any).uv.needsUpdate = true;
    }
}