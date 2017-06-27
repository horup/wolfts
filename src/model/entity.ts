export interface Position
{
    radius:number;
    position:number[];
    velocity:number[];
    facing:number;
    solid:boolean;
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

export interface Creature
{
    type:CreatureTypes;
    animation:number;
}

export interface Item
{
    type:ItemTypes;
}

export interface Entity
{
    id:number;
    position?:Position;
    Creature?:Creature;
    Item?:Item;
}