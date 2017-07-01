import * as THREE from 'three';
import * as Model from '../../model';
import Manager from './manager';
export default class GridManager extends Manager
{
    width:number = 0;
    height:number = 0;
    group:THREE.Group;
    cealingMaterial:THREE.Material;
    floorMaterial:THREE.Material;
    floorMesh:THREE.Mesh;
    cealingMesh:THREE.Mesh;
    gridMesh:THREE.Mesh;
    gridMaterial:THREE.Material;
    constructor(scene:THREE.Scene, gridTexture:THREE.Texture)
    {
        super();
        this.group = new THREE.Group();
        this.cealingMaterial = new THREE.MeshBasicMaterial({ color: "#383838", overdraw: 0.5, side:THREE.DoubleSide });
        this.floorMaterial = new THREE.MeshBasicMaterial({ color: "#707070", overdraw: 0.5, side:THREE.DoubleSide });
        this.gridMaterial = new THREE.MeshBasicMaterial({ map: gridTexture, overdraw: 0.5 });
        scene.add(this.group);
    }

    initFloor(world:Model.World)
    {
        let geometry = new THREE.PlaneGeometry(world.grid.width, world.grid.height);
        geometry.translate(world.grid.width /2 , -world.grid.height / 2, 0);
        let mesh = new THREE.Mesh(geometry, this.floorMaterial);
        this.group.add(mesh);
        geometry = new THREE.PlaneGeometry(world.grid.width, world.grid.height);
        geometry.translate(world.grid.width /2 , -world.grid.height / 2, 1);
        mesh = new THREE.Mesh(geometry, this.cealingMaterial);
        this.group.add(mesh);
    }

    initGrid(world:Model.World)
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

        this.gridMesh = new THREE.Mesh(gridGeometry, this.gridMaterial);
        this.group.add(this.gridMesh);
    }

    dispose()
    {
        if (this.group.children.length > 0)
        {
            this.group.remove(this.floorMesh);
            this.group.remove(this.cealingMesh);
            this.group.remove(this.gridMesh);
            this.floorMesh.geometry.dispose();
            this.cealingMesh.geometry.dispose();
            this.gridMesh.geometry.dispose();
        }
    }

    update(world:Model.World)
    {
        if (this.width != world.grid.width || this.height != world.grid.height)
        {
            this.width = world.grid.width;
            this.height = world.grid.height;
            this.dispose();
            this.initFloor(world);
            this.initGrid(world);
        }
    }
}