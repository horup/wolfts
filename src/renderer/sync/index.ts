import * as THREE from 'three';
import * as Model from '../../model';
import * as Init from './init';

export default class Sync
{
    attachedEntity:Model.Entity = null;
    sprites:THREE.Sprite[];
    dynamicGeometry:THREE.BufferGeometry;
    dynamicMesh:THREE.Mesh;
    max = 1024;
    
    initGrid(world:Model.World, scene:THREE.Scene, tex:THREE.Texture)
    {
        Init.scene(scene);
        Init.floor(world, scene);
        Init.grid(world, scene, tex);
    }
    
    initSprites(world:Model.World, scene:THREE.Scene, spritesTexture:THREE.Texture, gridTextures:THREE.Texture)
    {
        Init.sprites(world, scene, spritesTexture, this.sprites);
    }

    initGeometry(scene:THREE.Scene, gridTexture:THREE.Texture)
    {
        Init.geometry(scene, gridTexture, this.dynamicGeometry);
    }

    syncEntities(world:Model.World)
    {
        for (let sprite of this.sprites)
        {
            sprite.visible = false;
        }

        let position = this.dynamicGeometry.getAttribute('position');
        let uv = this.dynamicGeometry.getAttribute('uv');
        let vi = 0;
        let uvi = 0;
        let i = 0;

        for (let entity of world.entities)
        {
            let spatial = entity.spatial;
            let sprite = entity.sprite;
            let door = entity.door;
            if (spatial != null)
            {
                if (sprite != null)
                {
                    if (i < this.sprites.length)
                    {
                        let sp = this.sprites[i];
                        let index = sprite.type;
                        let columns = 16;
                        let tw = 1 / columns;
                        let th = 1 / columns;
                        let tx = (index % columns) / columns;
                        let ty = 1.0 - th - Math.floor(index / columns) * th;
                        let tex = this.sprites[i].material.map;
                        tex.uuid = tex.uuid;
                        tex.repeat.x = tw;
                        tex.repeat.y =  th;
                        tex.offset.x = tx;
                        tex.offset.y = ty;
                        sp.visible = true;
                        sp.position.set(spatial.position[0], spatial.position[1], 0.5);
                    }
                    else
                    {
                        console.log("exceeding sprite limit of " + this.sprites.length);
                    }
                    
                    if (sprite.type == 50)
                    {
                        this.attachedEntity = entity;
                    }
                    
                    i++;
                }
                if (door != null)
                {
                    let px = 1.0 / world.map.tilesets[0].imagewidth;
                    let tileset = world.map.tilesets[0];
                    let tw = tileset.tilewidth / tileset.imagewidth - px;
                    let th = tileset.tileheight / tileset.imageheight;
                    let geometry = new THREE.PlaneGeometry(1, 1);
                    let index = door.tex;
                    let tx = (index % tileset.columns) / tileset.columns + px / 2;
                    let ty = 1.0 - th - Math.floor(index / tileset.columns) * th;
                    let uvs = [new THREE.Vector2(tx, ty), new THREE.Vector2(tx + tw, ty), new THREE.Vector2(tx + tw, ty + th), new THREE.Vector2(tx, ty + th)];
                    geometry.faceVertexUvs[0] = [];
                    for (let i = 0; i < 1; i += 2) {
                        geometry.faceVertexUvs[0][i] = [uvs[3], uvs[0], uvs[2]];
                        geometry.faceVertexUvs[0][i + 1] = [uvs[0], uvs[1], uvs[2]];
                    }

                    geometry.rotateX(Math.PI/2);
                    geometry.rotateZ(Math.PI/2);
                    geometry.translate(spatial.position[0], spatial.position[1] + door.offset, 0.5);
                    geometry.rotateZ(spatial.facing);

                    let buff = new THREE.BufferGeometry().fromGeometry(geometry);
                    let p:any = position.array;
                    let p2:any = buff.getAttribute('position').array;
                    for (let i = 0; i < p2.length; i++)
                    {
                        p[vi++] = p2[i];
                    }

                    let u:any = uv.array;
                    let u2:any = buff.getAttribute('uv').array;
                    for (let i = 0; i < u2.length; i++)
                    {
                        u[uvi++] = u2[i];
                    }
                }
            }
        }
        
        (this.dynamicGeometry.attributes as any).position.needsUpdate = true;
        (this.dynamicGeometry.attributes as any).uv.needsUpdate = true;
        this.dynamicGeometry.setDrawRange(0, vi/3); // no sure if correct
    }

    syncCamera(camera:THREE.Camera)
    {
        if (this.attachedEntity != null)
        {
            let spatial = this.attachedEntity.spatial;
            let v = new THREE.Vector3(Math.cos(spatial.facing), Math.sin(spatial.facing));
            camera.position.x = spatial.position[0];
            camera.position.y = spatial.position[1];
            let front = new THREE.Vector3(spatial.position[0], spatial.position[1], 0.5);
            front.add(v);
            camera.lookAt(front);
        }
    }
}