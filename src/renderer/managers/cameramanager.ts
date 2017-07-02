import * as THREE from 'three';
import * as Model from '../../model';
import Manager from './manager';
import Input from '../input';
export default class CameraManager extends Manager
{
    camera:THREE.Camera;
    input:Input;
    constructor(camera:THREE.Camera, input:Input)
    {
        super();
        this.camera = camera;
        this.input = input;
    }
    
    v = new THREE.Vector3(Math.cos(0), Math.sin(0));
    front = new THREE.Vector3(0, 0, 0.5);
    update(world:Model.World)
    {
        for (let entity of world.entities)
        {
            if (entity.player != null && entity.spatial != null)
            {
                let spatial = entity.spatial;
                this.v.set(Math.cos(spatial.facing), Math.sin(spatial.facing), 0);
                this.camera.position.x = spatial.position[0];
                this.camera.position.y = spatial.position[1];
                this.front.set(spatial.position[0], spatial.position[1], 0.5);
                this.front.add(this.v);
                this.camera.lookAt(this.front);
            }
        }
    }
}