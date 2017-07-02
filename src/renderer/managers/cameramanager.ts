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
    
    update(world:Model.World)
    {
        for (let entity of world.entities)
        //if (this.attachedEntity != null)
        {
            if (entity.player != null && entity.spatial != null)
            {
                let spatial = entity.spatial;
                let v = new THREE.Vector3(Math.cos(spatial.facing), Math.sin(spatial.facing));
                this.camera.position.x = spatial.position[0];
                this.camera.position.y = spatial.position[1];
                let front = new THREE.Vector3(spatial.position[0], spatial.position[1], 0.5);
                front.add(v);
                this.camera.lookAt(front);
            }
        }
    }
}