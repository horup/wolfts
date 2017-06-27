import {Entity} from './entity';

export interface TileTypes
{
    Void
}
export interface Tile
{
    type:TileTypes;
}

export interface World
{
    grid:Tile[][];
    entities:Entity[];
}