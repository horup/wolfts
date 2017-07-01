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
    }
}