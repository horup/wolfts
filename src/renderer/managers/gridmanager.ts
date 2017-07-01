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
    constructor(scene:THREE.Scene)
    {
        super();
        this.group = new THREE.Group();
        this.cealingMaterial = new THREE.MeshBasicMaterial({ color: "#383838", overdraw: 0.5, side:THREE.DoubleSide });
        this.floorMaterial = new THREE.MeshBasicMaterial({ color: "#707070", overdraw: 0.5, side:THREE.DoubleSide });
        scene.add(this.group);
    }

    update(world:Model.World)
    {
        if (this.width != world.grid.width || this.height != world.grid.height)
        {
            this.width = world.grid.width;
            this.height = world.grid.height;

            if (this.floorMesh != null && this.cealingMesh != null)
            {
                this.group.remove(this.floorMesh);
                this.group.remove(this.cealingMesh);
                this.floorMesh.geometry.dispose();
                this.cealingMesh.geometry.dispose();
                this.group.remove(this.floorMesh);
            }
           
            {
                let geometry = new THREE.PlaneGeometry(world.grid.width, world.grid.height);
                geometry.translate(world.grid.width /2 , -world.grid.height / 2, 0);
                let mesh = new THREE.Mesh(geometry, this.floorMaterial);
                this.group.add(mesh);
            }
            {
                let geometry = new THREE.PlaneGeometry(world.grid.width, world.grid.height);
                geometry.translate(world.grid.width /2 , -world.grid.height / 2, 1);
                let mesh = new THREE.Mesh(geometry, this.cealingMaterial);
                this.group.add(mesh);
            }

            console.log("init floor");
        }
    }
}