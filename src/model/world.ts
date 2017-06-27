import {Entity} from './entity';
import {Map} from './map';

export enum TileTypes
{
    Void
}

export class Grid
{
    width:number;
    height:number;
    tiles:TileTypes[];
}

export class World
{
    map:Map = null;
    grid:Grid = new Grid();
    entities:Entity[] = [];
}