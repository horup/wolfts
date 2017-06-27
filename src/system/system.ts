import * as Model from '../model'
import * as $ from 'jquery';

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

            for (let i = 0; i < map.layers[1].objects.length; i++)
            {

            }
            
            this.world = world;
            console.log(this.world);
        });
    }
}