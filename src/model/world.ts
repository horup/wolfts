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
    
    getIndex(x:number, y:number)
    {
        x = Math.floor(x);
        y = Math.floor(Math.abs(y));
        let i = (x % this.width) + y * this.width;
        return i;
    }

    getTile(x:number, y:number)
    {
        let i = this.getIndex(x,y);
        if (i < 0 || i >= this.tiles.length)
            return Tile.Void;
            
        return this.tiles[i];
    }

    setTile(x:number,y:number, type:Tile)
    {
        let i = this.getIndex(x,y);
        this.tiles[i] = type;
    }

    getSolid(x:number,y:number)
    {
        let solid = this.getTile(x,y) != Tile.Void;
        return solid;
    }
}

export class World
{
    map:Level = new Level();
    grid:Grid = new Grid();
    entities:Entity[] = [];
}