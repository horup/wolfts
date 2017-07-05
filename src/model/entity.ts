export class Spatial
{
    radius:number = 0.25;
    position:number[] = [0,0,0];
    velocity:number[] = [0,0,0];
    facing:number = 0;
    solid:boolean = true;
}

export enum CreatureTypes
{
    Dog,
    Guard
}

export enum ItemTypes
{
    Demo,
    DeathCam
}

export class Player
{

}

export class Creature
{
    type:CreatureTypes = CreatureTypes.Dog;
    animation:number = 0;
}

export class Sprite
{
    sheet:number = 0;
    type:ItemTypes = ItemTypes.Demo;
    flat:boolean = false;
    offset=[0, 0, 0];
}

export class Block
{
    sheet:number = 0;
    index:number = 0;
}

export enum PushwallState
{
    NotTriggered,
    Triggered,
    Settled
}
export class Pushwall
{
    direction = [0,0,0];
    state = PushwallState.NotTriggered;
    push(me:Entity, who:Entity)
    {
        if (this.state == PushwallState.NotTriggered)
        {
            this.direction[0] = Math.floor(me.spatial.position[0]) - Math.floor(who.spatial.position[0]);
            this.direction[1] = Math.floor(me.spatial.position[1]) - Math.floor(who.spatial.position[1]);
            this.state = PushwallState.Triggered;
        }
    }
}

export class Door
{
    offset:number = 0;
    state = 0;
    delay = 0; 
    open()
    {
        if (this.state != -1)
        {
            this.state = -1;
        }
    }
}

let nextId = 0;
export class Entity
{
    id:number = nextId++;
    spatial?:Spatial;
    creature?:Creature;
    sprite?:Sprite;
    door?:Door;
    player?:Player;
    pushwall?:Pushwall;
    block?:Block;
}