import {Entity} from './entity';
import {Level} from './map';

export enum Tile
{
    Void = -1
}

export class Grid
{
    width:number = 0;
    height:number = 0;
    tiles:Tile[] = [];
    
    getTile(x:number, y:number)
    {
        let i = (x % this.width) + y * this.width;
        return this.tiles[i];
    }

    setTile(x,y, type:Tile)
    {
        let i = (x % this.width) + y * this.width;
        this.tiles[i] = type;
    }
}

export class World
{
    map:Level = new Level();
    grid:Grid = new Grid();
    entities:Entity[] = [];
}