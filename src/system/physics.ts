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
                let vx = entity.spatial.velocity[0];
                let vy = entity.spatial.velocity[1];
                let x = entity.spatial.position[0];
                let y = entity.spatial.position[1];


                let newX = x + vx;
                if (!world.grid.getSolid(newX, y))
                {
                    x = newX;
                }

                let newY = y + vy;
                if (!world.grid.getSolid(x, newY))
                {
                    y = newY;
                }

                entity.spatial.position[0] = x;
                entity.spatial.position[1] = y;

                /*
                entity.spatial.position[0] += entity.spatial.velocity[0];
                entity.spatial.position[1] += entity.spatial.velocity[1];*/
            }
        }
    }
}