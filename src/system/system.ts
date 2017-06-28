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
                grid.tiles[i] = data[i];
            }

            let objects = map.layers[1].objects;
            for (let obj of objects)
            {
                let type = obj.gid - 256;
                let entity = new Model.Entity();
                entity.position = new Model.Position();
                entity.position.position[0] = obj.x + 0.5;
                entity.position.position[2] = obj.y + 0.5;
                entity.sprite = new Model.Sprite();
                entity.sprite.type = type;
                world.entities.push(entity);
            }
            
            this.world = world;
            this.flags.entitiesReload = true;
            this.flags.gridReload = true;
        });
    }

    clearFlags()
    {
        this.flags.entitiesReload = false;
        this.flags.gridReload = false;
    }

    update()
    {
    }
}