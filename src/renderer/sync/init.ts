import * as THREE from 'three';
import * as Model from '../../model';

export function scene(scene:THREE.Scene)
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

export function sprites(world:Model.World, scene:THREE.Scene, spritesTexture:THREE.Texture, sprites:THREE.Sprite[])
{
    sprites = [];
    for (let i = 0; i < 64; i++)
    {
        let tex = spritesTexture.clone();
        tex.uuid = tex.uuid;
        tex.needsUpdate = true;
        let sp = new THREE.Sprite(new THREE.SpriteMaterial({map:tex}));
        sp.visible = true;
        sprites.push(sp);
        scene.add(sp);
    }
}

export function floor(world:Model.World, scene:THREE.Scene)
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

export function grid(world:Model.World, scene:THREE.Scene, tex:THREE.Texture)
{
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
    scene.add(mesh);
}

let max = 1024;
export function geometry(scene:THREE.Scene, gridTextures:THREE.Texture, dynamicGeometry:THREE.BufferGeometry)
{
    let geometry = new THREE.Geometry();
    for (let i = 0; i < max; i++)
    {
        geometry.merge(new THREE.BoxGeometry(1,1,1), new THREE.Matrix4());
    }

    dynamicGeometry = new THREE.BufferGeometry();
    dynamicGeometry.fromGeometry(geometry);

    let dynamicMesh = new THREE.Mesh(dynamicGeometry, new THREE.MeshBasicMaterial({ map: gridTextures, overdraw: 0.5, side:THREE.DoubleSide }));
    scene.add(dynamicMesh);
}