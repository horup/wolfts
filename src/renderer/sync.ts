import * as THREE from 'three';
import * as Model from '../model';

function clearScene(scene:THREE.Scene)
{
    while (scene.children.length > 0)
        scene.remove(scene.children[0]);
}

function syncFloor(world:Model.World, scene:THREE.Scene)
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

export function syncGrid(world:Model.World, scene:THREE.Scene, tex:THREE.Texture)
{
    clearScene(scene);
    syncFloor(world, scene);

    let gridGeometry = new THREE.Geometry();
    for (let y = 0; y < world.grid.height; y++)
    {
        for (let x = 0; x < world.grid.width; x++)
        {
            let tile = world.grid.getTile(x, y);
            if (tile != Model.Tile.Void)
            {
                let px = 1.0 / world.map.tilesets[0].imagewidth;
                let geometry = new THREE.CubeGeometry(1, 1, 1);
                let tileset = world.map.tilesets[0];
                let index = tile;
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
                geometry.rotateX(Math.PI/2);
                geometry.translate(x+0.5,-y-0.5, 0.5);


                gridGeometry.merge(geometry, new THREE.Matrix4());
            }
        }
    }

    let gridMaterial = new THREE.MeshBasicMaterial({ map: tex, overdraw: 0.5 });
    let mesh = new THREE.Mesh(gridGeometry, gridMaterial);
    scene.add(mesh);
}

export function syncEntities(world:Model.World, scene:THREE.Scene, spritesTexture:THREE.Texture)
{
    clearScene(scene);
    for (let entity of world.entities)
    {
        let spatial = entity.spatial;
        let sprite = entity.sprite;
        if (sprite != null && spatial != null)
        {
            let index = sprite.type;
            let columns = 16;
            let tw = 1 / columns;
            let th = 1 / columns;
            let tx = (index % columns) / columns;
            let ty = 1.0 - th - Math.floor(index / columns) * th;
            let tex = spritesTexture.clone();
            tex.uuid = tex.uuid;
            tex.repeat.x = tw;
            tex.repeat.y =  th;
            tex.offset.x = tx;
            tex.offset.y = ty;
            tex.needsUpdate = true;

            let sp = new THREE.Sprite(new THREE.SpriteMaterial({map:tex}));
            sp.translateX(spatial.position[0]);
            sp.translateY(spatial.position[1]);
            sp.translateZ(0.5);
            scene.add(sp);
        }
    }

    console.log(world.entities.length);
}