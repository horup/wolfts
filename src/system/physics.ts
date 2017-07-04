import InputState from './inputstate';
import * as Model from '../model';
import * as SAT from 'sat';
export default class Physics
{
    static updateInput(world:Model.World, inputstate:InputState)
    {
        for (let entity of world.entities)
        {
            if (entity.sprite != null && entity.spatial != null && entity.player != null)
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

    static poly = [[0,0], [0,0], [0,0], [0,0]]
    static checkCollision(me:Model.Entity, x:number, y:number, r:number, world:Model.World)
    {
        this.poly[0][0] = x - r;
        this.poly[0][1] = y - r;

        this.poly[1][0] = x + r;
        this.poly[1][1] = y + r;
        
        this.poly[2][0] = x - r;
        this.poly[2][1] = y + r;
        
        this.poly[3][0] = x + r;
        this.poly[3][1] = y - r;
        for (let p of this.poly)
        {
            if (world.grid.getSolid(p[0], p[1]))
                return true;

            for (let entity of world.entities)
            {
                if (entity != me && entity.spatial != null)
                {
                    if (Math.floor(p[0]) == Math.floor(entity.spatial.position[0]) 
                        && Math.floor(p[1]) == Math.floor(entity.spatial.position[1]))
                    {
                        if (entity.door != null && entity.door.offset != 1.0)
                        {
                            entity.door.open();
                            return true;
                        }
                        else if (entity.pushwall)
                        {
                            entity.pushwall.push();
                            return true;
                        }
                    }
                }
            }
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
                if (!this.checkCollision(entity, newX, y, r, world))
                {
                    x = newX;
                }

                let newY = y + vy;
                if (!this.checkCollision(entity, x, newY, r, world))
                {
                    y = newY;
                }

                entity.spatial.position[0] = x;
                entity.spatial.position[1] = y;
            }

            if (entity.door != null)
            {
                let speed = 0.04;
                let door = entity.door;
                if (door.state == 0)
                {
                    if (door.delay > 0)
                    {
                        door.delay--;
                    }
                    else if (door.offset != 0)
                    {
                        door.state = 1;
                    }
                }
                else if (door.state == -1)
                {
                    door.offset += speed;
                    if (door.offset >= 1.0)
                    {
                        door.offset = 1.0;
                        door.delay = 60*3;
                        door.state = 0;
                    }
                }
                else if (door.state == 1)
                {
                    door.offset -= speed;
                    if (door.offset <= 0)
                    {
                        door.offset = 0;
                        door.state = 0;
                    }
                }

                if (entity.sprite != null)
                {
                    if (entity.spatial.facing != 0)
                        entity.sprite.offset[0] = entity.door.offset;
                    else
                        entity.sprite.offset[1] = entity.door.offset;
                }
            }
        }
    }
}