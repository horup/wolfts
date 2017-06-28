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

export class Creature
{
    type:CreatureTypes = CreatureTypes.Dog;
    animation:number = 0;
}

export class Sprite
{
    type:ItemTypes = ItemTypes.Demo;
}

let nextId = 0;
export class Entity
{
    id:number = nextId++;
    spatial?:Spatial;
    Creature?:Creature;
    sprite?:Sprite;
}