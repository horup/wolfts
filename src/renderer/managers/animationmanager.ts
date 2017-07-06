import * as THREE from 'three';
import * as Model from '../../model';
import Manager from './manager';

export default class AnimationManager extends Manager
{
    camera:THREE.Camera;
    constructor(camera:THREE.Camera)
    {
        super();
        this.camera = camera;
    }

    v1:THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    v2:THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    update(world:Model.World)
    {
        for (let entity of world.entities)
        {
            if (entity.sprite != null && entity.spatial != null)
            {
                if (entity.creature != null)
                {
                    let offset = Math.PI / 8;
                    let spatial = entity.spatial;
                    this.v1.set(Math.cos(spatial.facing + offset), Math.sin(spatial.facing + offset), 0);
                    this.v2.set(spatial.position[0] - this.camera.position.x, spatial.position[1] - this.camera.position.y, 0);
                    this.v2.normalize();
                    this.v2.sub(this.v1);
                    let a = Math.atan2(this.v2.y, this.v2.x);
                    if (a < 0)
                        a += Math.PI;
                    a /= Math.PI;

                    let col = Math.floor(a * 8);
                    
                    entity.sprite.index = col;
                }
            }
        }
    }
}