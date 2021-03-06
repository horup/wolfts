import InputState from './inputstate';
import * as Model from '../model';
import * as SAT from 'sat';
export default class Physics
{
    updateInput(world:Model.World, inputstate:InputState)
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

    poly = [[0,0], [0,0], [0,0], [0,0]];
    poly2 = [[0,0], [0,0], [0,0], [0,0]];

    setPoly(poly:number[][], x:number, y:number, r:number, dx:number, dy:number)
    {
        poly[0][0] = x - r * dx;
        poly[0][1] = y - r * dy;

        poly[1][0] = x + r * dx;
        poly[1][1] = y + r * dy;
        
        poly[2][0] = x - r * dx;
        poly[2][1] = y + r * dy;
        
        poly[3][0] = x + r * dx;
        poly[3][1] = y - r * dy;
    }

    checkCollision(me:Model.Entity, x:number, y:number, r:number, ox:number, oy:number, world:Model.World)
    {
        let dx = 0.95;
        let dy = 0.95;
        this.setPoly(this.poly, x, y, r, dx, dy);
        for (let p of this.poly)
        {
            if (world.grid.getSolid(p[0], p[1]))
                return true;

            let ei = this.calcIndex(p[0], p[1], world);
            if (ei >= 0 && ei < this.entityMap.length)
            {
                let entities = this.entityMap[ei];
                for (let entity of entities)
                {
                    if (entity != me && entity.spatial != null)
                    {
                        this.setPoly(this.poly2, entity.spatial.position[0], entity.spatial.position[1], entity.spatial.radius, dx, dy );
                        for (let p2 of this.poly2)
                        {
                            if (Math.floor(p[0]) == Math.floor(p2[0]) 
                            &&  Math.floor(p[1]) == Math.floor(p2[1]))
                            {
                                if (entity.door != null && entity.door.offset != 1.0)
                                {
                                    entity.door.open();
                                    return true;
                                }
                                else if (entity.pushwall)
                                {
                                    entity.pushwall.push(entity, me);
                                    return true;
                                }

                                break;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    entityMap:Model.Entity[][] = [];

    calcIndex(x:number, y:number, world:Model.World)
    {
        x = Math.floor(x);
        y = Math.floor(Math.abs(y));
        let i = (x % world.grid.width) + y * world.grid.width;
        return i;
    }

    update(world:Model.World, inputstate:InputState)
    {
        if (this.entityMap.length < world.grid.width * world.grid.height)
        {
            this.entityMap = new Array(world.grid.width * world.grid.height);
            for (let i = 0; i < this.entityMap.length; i++)
            {
                this.entityMap[i] = [];
            }
        }

        for (let i = 0; i < this.entityMap.length; i++)
        {
            this.entityMap[i] = [];
        }

        for (let entity of world.entities)
        {
            if (entity.spatial != null)
            {
                let spatial = entity.spatial;

                for (let y = -1; y <= 1; y++)
                {
                    for (let x = -1; x <= 1; x++)
                    {
                        let s = entity.spatial;
                        let i = this.calcIndex(s.position[0] + s.radius * x, s.position[1] + s.radius, world);
                        if (i >= 0 && i < this.entityMap.length)
                        {
                            if (this.entityMap[i].find((e)=>e == entity) == undefined)
                            {
                                this.entityMap[i].push(entity);
                            }
                        }
                    }
                }
                
            }
        }

        this.updateInput(world, inputstate);
        
        for (let entity of world.entities)
        {
            if (entity.creature != null && entity.sprite != null)
            {
                entity.creature.animation += 0.2;
                if (entity.creature.animation > 5)
                    entity.creature.animation = 0;
            }
            if (entity.spatial != null)
            {
                let vx = entity.spatial.velocity[0];
                let vy = entity.spatial.velocity[1];
                let x = entity.spatial.position[0];
                let y = entity.spatial.position[1];
                let r = entity.spatial.radius;
                
                let newX = x + vx;
                let col = true;
                if (!this.checkCollision(entity, newX, y, r, x, y, world))
                {
                    x = newX;
                    col = false;
                }

                let newY = y + vy;
                if (!this.checkCollision(entity, x, newY, r, x, y, world))
                {
                    y = newY;
                    col = col ? true : false;
                }

                if (col && entity.pushwall != null)
                {
                    entity.pushwall.state = Model.PushwallState.Settled;
                    entity.spatial.velocity[0] = 0;
                    entity.spatial.velocity[1] = 0;
                    entity.spatial.velocity[2] = 0;
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

            if (entity.pushwall != null)
            {
                let spatial = entity.spatial;
                let pushwall = entity.pushwall;
                if (pushwall.state == Model.PushwallState.Triggered)
                {
                    let speed = 0.01;
                    spatial.velocity[0] = pushwall.direction[0] * speed;
                    spatial.velocity[1] = pushwall.direction[1] * speed;
                    //spatial.position[0] += pushwall.direction[0] * speed;
                    //spatial.position[1] += pushwall.direction[1] * speed;
                }
            }
        }
    }
}