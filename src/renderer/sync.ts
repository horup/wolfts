import * as THREE from 'three';
import * as Model from '../model';

function clearScene(scene:THREE.Scene)
{
    while (scene.children.length > 0)
        scene.remove(scene.children[0]);
}

export function syncGrid(world:Model.World, scene:THREE.Scene, tex:THREE.Texture)
{
    clearScene(scene);
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

                for (let vertice of geometry.vertices) {
                    vertice.x += x;
                    vertice.z += y;
                }

                gridGeometry.merge(geometry, new THREE.Matrix4());
            }
        }
    }

    let gridMaterial = new THREE.MeshBasicMaterial({ map: tex, overdraw: 0.5 });
    let mesh = new THREE.Mesh(gridGeometry, gridMaterial);
    scene.add(mesh);
}