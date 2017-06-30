import InputState from './inputstate';
import * as Model from '../model';
import * as SAT from 'sat';
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

    static checkCollision(x:number, y:number, r:number, grid:Model.Grid)
    {
        let me = new SAT.Box(new SAT.Vector(x-r,y-r), r * 2, r * 2);
        let poly = me.toPolygon();
        for (let p of poly.points)
        {
            if (grid.getSolid(poly.pos.x + p.x, poly.pos.y + p.y))
                return true;
        }

        return false;
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
                let r = 0.25;
                
                let newX = x + vx;
                if (!this.checkCollision(newX, y, r, world.grid))
                {
                    x = newX;
                }

                let newY = y + vy;
                if (!this.checkCollision(x, newY, r, world.grid))
                {
                    y = newY;
                }

                entity.spatial.position[0] = x;
                entity.spatial.position[1] = y;
            }
        }
    }
}