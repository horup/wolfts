import * as THREE from 'three';
import * as Model from '../model';

export default class Sync
{
    attachedEntity:Model.Entity = null;
    clearScene(scene:THREE.Scene)
    {
        while (scene.children.length > 0)
        {
            let child = scene.children[0] as any;
            if (child.material != null)
            {
                if (child.material.map != null)
                {
                    child.material.map.dispose();
                }

                child.material.dispose();
            }
            scene.remove(scene.children[0]);
        }
    }

    initFloor(world:Model.World, scene:THREE.Scene)
    {
        let cealingMaterial = new THREE.MeshBasicMaterial({ color: "#383838", overdraw: 0.5, side:THREE.DoubleSide });
        let floorMaterial = new THREE.MeshBasicMaterial({ color: "#707070", overdraw: 0.5, side:THREE.DoubleSide });

        {
            let geometry = new THREE.PlaneGeometry(world.grid.width, world.grid.height);
            geometry.translate(world.grid.width /2 , -world.grid.height / 2, 0);
            let mesh = new THREE.Mesh(geometry, floorMaterial);
            scene.add(mesh);
        }
        {
            let geometry = new THREE.PlaneGeometry(world.grid.width, world.grid.height);
            geometry.translate(world.grid.width /2 , -world.grid.height / 2, 1);
            let mesh = new THREE.Mesh(geometry, cealingMaterial);
            scene.add(mesh);
        }
    }

    initGrid(world:Model.World, scene:THREE.Scene, tex:THREE.Texture)
    {
        this.clearScene(scene);
        this.initFloor(world, scene);

        let px = 1.0 / world.map.tilesets[0].imagewidth;
        let tileset = world.map.tilesets[0];
        let tw = tileset.tilewidth / tileset.imagewidth - px;
        let th = tileset.tileheight / tileset.imageheight;

        let gridGeometry = new THREE.Geometry();
        for (let y = 0; y < world.grid.height; y++)
        {
            for (let x = 0; x < world.grid.width; x++)
            {
                let tile = world.grid.getTile(x, -y);
                if (tile != Model.Tile.Void)
                {
                    let geometry = new THREE.CubeGeometry(1, 1, 1);
                    let index = tile;
                    let tx = (index % tileset.columns) / tileset.columns + px / 2;
                    let ty = 1.0 - th - Math.floor(index / tileset.columns) * th;
                    let uvs = [new THREE.Vector2(tx, ty), new THREE.Vector2(tx + tw, ty), new THREE.Vector2(tx + tw, ty + th), new THREE.Vector2(tx, ty + th)];
                    geometry.faceVertexUvs[0] = [];
                    for (let i = 0; i < 6 * 2; i += 2) {
                        geometry.faceVertexUvs[0][i] = [uvs[3], uvs[0], uvs[2]];
                        geometry.faceVertexUvs[0][i + 1] = [uvs[0], uvs[1], uvs[2]];
                    }
                    geometry.rotateX(Math.PI/2);
                    geometry.translate(x+0.5,-y-0.5, 0.5);


                    gridGeometry.merge(geometry, new THREE.Matrix4());
                }
            }
        }

        for (let e of world.entities)
        {
            if (e.door != null)
            {
                let geometry = new THREE.CubeGeometry(1, 1, 1);
                let index = e.door.tex;
                let tx = (index % tileset.columns) / tileset.columns + px / 2;
                let ty = 1.0 - th - Math.floor(index / tileset.columns) * th;
                let uvs = [new THREE.Vector2(tx, ty), new THREE.Vector2(tx + tw, ty), new THREE.Vector2(tx + tw, ty + th), new THREE.Vector2(tx, ty + th)];
                geometry.faceVertexUvs[0] = [];
                for (let i = 0; i < 6 * 2; i += 2) {
                    geometry.faceVertexUvs[0][i] = [uvs[3], uvs[0], uvs[2]];
                    geometry.faceVertexUvs[0][i + 1] = [uvs[0], uvs[1], uvs[2]];
                }

                geometry.rotateX(Math.PI/2);
                geometry.translate(e.spatial.position[0], e.spatial.position[1] + e.door.offset, 0.5);
               // gridGeometry.merge(geometry, new THREE.Matrix4());
            }
        }

        let gridMaterial = new THREE.MeshBasicMaterial({ map: tex, overdraw: 0.5 });
        let mesh = new THREE.Mesh(gridGeometry, gridMaterial);
      //  scene.add(mesh);
    }


    sprites:THREE.Sprite[];
    dynamicGeometry:THREE.BufferGeometry;
    dynamicMesh:THREE.Mesh;
    max = 1024;
    initEntities(world:Model.World, scene:THREE.Scene, spritesTexture:THREE.Texture, gridTextures:THREE.Texture)
    {
        this.clearScene(scene);
        this.sprites = [];

        let geometry = new THREE.Geometry();
        for (let i = 0; i < this.max; i++)
        {
            geometry.merge(new THREE.BoxGeometry(1,1,1), new THREE.Matrix4());
        }

        this.dynamicGeometry = new THREE.BufferGeometry();
        this.dynamicGeometry.fromGeometry(geometry);
        
        console.log(this.dynamicGeometry.getAttribute('position'));
        let box = new THREE.BoxGeometry(1,1,1);
     
        this.dynamicMesh = new THREE.Mesh(this.dynamicGeometry, new THREE.MeshBasicMaterial({ map: gridTextures, overdraw: 0.5 }));
        scene.add(this.dynamicMesh);


        for (let i = 0; i < 64; i++)
        {
            let tex = spritesTexture.clone();
            tex.uuid = tex.uuid;
            tex.needsUpdate = true;
            let sp = new THREE.Sprite(new THREE.SpriteMaterial({map:tex}));
            sp.visible = true;
            this.sprites.push(sp);
         //   scene.add(sp);
        }
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
                    let geometry = new THREE.CubeGeometry(1, 1, 1);
                    let index = door.tex;
                    let tx = (index % tileset.columns) / tileset.columns + px / 2;
                    let ty = 1.0 - th - Math.floor(index / tileset.columns) * th;
                    let uvs = [new THREE.Vector2(tx, ty), new THREE.Vector2(tx + tw, ty), new THREE.Vector2(tx + tw, ty + th), new THREE.Vector2(tx, ty + th)];
                    geometry.faceVertexUvs[0] = [];
                    for (let i = 0; i < 6 * 2; i += 2) {
                        geometry.faceVertexUvs[0][i] = [uvs[3], uvs[0], uvs[2]];
                        geometry.faceVertexUvs[0][i + 1] = [uvs[0], uvs[1], uvs[2]];
                    }

                    geometry.rotateX(Math.PI/2);
                    geometry.translate(spatial.position[0], spatial.position[1] + door.offset, 0.5);

                    let buff = new THREE.BufferGeometry().fromGeometry(geometry);
                    let p:any = position.array;
                    let p2:any = buff.getAttribute('position').array;
                    for (let i = 0; i < p2.length; i++)
                    {
                        p[vi++] = p2[i];
                    }
                }
            }
        }
        
        (this.dynamicGeometry.attributes as any).position.needsUpdate = true;
       // this.dynamicGeometry.setDrawRange(0, );
     //   console.log(this.dynamicGeometry.faceVertexUvs);
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