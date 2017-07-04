export class Spatial
{
    radius:number = 0;
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

export class Pushwall
{
    push()
    {
        
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
}