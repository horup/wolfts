import InputState from './inputstate';
import * as Model from '../model';
export default class Physics
{
    static updateInput(world:Model.World, inputstate:InputState)
    {
        for (let entity of world.entities)
        {
            if (entity.sprite != null && entity.spatial != null && entity.sprite.type == 50)
            {
                entity.spatial.facing = inputstate.angleZ;;
                let speed = 0.1;
                entity.spatial.facing = inputstate.angleZ;
                let vx = inputstate.movement[0] * speed;
                let vy = inputstate.movement[1] * speed;
                entity.spatial.velocity[0] = vx;
                entity.spatial.velocity[1] = vy;
            }
        }
    }

    static update(world:Model.World, inputstate:InputState)
    {
        this.updateInput(world, inputstate);

        for (let entity of world.entities)
        {
            if (entity.spatial != null)
            {
                entity.spatial.position[0] += entity.spatial.velocity[0];
                entity.spatial.position[1] += entity.spatial.velocity[1];
            }
        }
    }
}