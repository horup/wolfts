import * as Model from '../model'
import * as $ from 'jquery';
import Flags from './flags';
export default class System
{
    flags:Flags = new Flags();
    world:Model.World = new Model.World();
    loadMap(url:string)
    {
        $.get('maps/e01m01.json').done((map:Model.Level) =>
        {
            let world = new Model.World();
            world.map = map;
            let grid = new Model.Grid();
            grid.height = map.layers[0].height;
            grid.width = map.layers[0].width;
            grid.tiles = new Array(grid.height * grid.width);
            world.grid = grid;
            let data = map.layers[0].data;

            for (let i = 0; i < data.length; i++)
            {
                grid.tiles[i] = data[i] - 1;
            }

            let objects = map.layers[1].objects;
            for (let obj of objects)
            {
                let type = obj.gid - 256 - 1;
                let entity = new Model.Entity();
                entity.spatial = new Model.Spatial();
                entity.spatial.position[0] = obj.x / map.tilesets[0].tilewidth + 0.5;
                entity.spatial.position[1] = -obj.y / map.tilesets[0].tileheight + 0.5;
                entity.sprite = new Model.Sprite();
                entity.sprite.type = type;
                world.entities.push(entity);
            }
            
            this.world = world;
            this.flags.initEntities = true;
            this.flags.initGrid = true;
        });
    }

    clearFlags()
    {
        this.flags.initEntities = false;
        this.flags.initGrid = false;
    }

    update()
    {
        for (let entity of this.world.entities)
        {
          //  entity.spatial.position[0]+=0.01;
        }
    }
}