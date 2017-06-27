import * as Model from '../model'
import * as $ from 'jquery';
import * as Renderer from '../renderer';
export default class System
{
    world:Model.World;
    loadMap(url:string)
    {
        $.get('maps/e01m01.json').done((map:Model.Map) =>
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
        });
    }
}