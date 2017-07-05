import * as THREE from 'three';
import * as Model from '../../model';
import Manager from './manager';
export default class BlockManager extends Manager
{
    group:THREE.Group;
    material:THREE.Material;
    sheetindex:number;
    constructor(scene:THREE.Scene, texture:THREE.Texture, sheetIndex:number)
    {
        super();
        this.sheetindex = sheetIndex;
        this.group = new THREE.Group();
        this.material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
        scene.add(this.group);
    }

    newBlock()
    {
        let geometry = new THREE.CubeGeometry(1, 1, 1);
        geometry.rotateX(Math.PI/2);
        let gridMesh = new THREE.Mesh(geometry, this.material);
        this.group.add(gridMesh);
    }

    update(world:Model.World)
    {
        let size = 16;
        let px = 1.0 / 1024;
        let tw = 64 / 1024 - px;
        let th = 64 / 1024;

        for (let child of this.group.children)
        {
            child.visible = false;
        }

        let count = 0;
        for (let entity of world.entities)
        {
            let block = entity.block;
            let spatial = entity.spatial;
            if (spatial != null && block != null && block.sheet == this.sheetindex)
            {
                if (this.group.children.length <= count)
                {
                    this.newBlock();
                }

                let mesh = this.group.children[count] as THREE.Mesh;
                let index = block.index;
                let tx = (index % size) / size + px / 2;
                let ty = 1.0 - th - Math.floor(index / size) * th;
                let uvs = [new THREE.Vector2(tx, ty), new THREE.Vector2(tx + tw, ty), new THREE.Vector2(tx + tw, ty + th), new THREE.Vector2(tx, ty + th)];
                let geometry = mesh.geometry as THREE.CubeGeometry;
                geometry.faceVertexUvs[0] = [];
                for (let i = 0; i < 6 * 2; i += 2) {
                    geometry.faceVertexUvs[0][i] = [uvs[3], uvs[0], uvs[2]];
                    geometry.faceVertexUvs[0][i + 1] = [uvs[0], uvs[1], uvs[2]];
                }
                mesh.position.x = spatial.position[0];
                mesh.position.y = spatial.position[1];
                mesh.position.z = spatial.position[2];
                mesh.visible = true;
                count++;
            }
        }
    }
}