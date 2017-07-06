import * as Model from '../model'
import * as $ from 'jquery';
import Flags from './flags';
import InputState from './inputstate';
import Physics from './physics';

export default class System
{
    flags:Flags = new Flags();
    world:Model.World = new Model.World();
    loadMap(url:string)
    {
        $.get('dist/maps/e01m01.json').done((map:Model.Level) =>
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

            for (let y = 0; y < grid.height; y++)
            {
                for (let x = 0; x < grid.width; x++)
                {
                    if (grid.getTile(x, y) == 98)
                    {
                        grid.setTile(x, y, -1);
                        let door:Model.Door = new Model.Door();
                        let spatial:Model.Spatial = new Model.Spatial();
                        let e = new Model.Entity();
                        e.spatial = spatial;
                        e.spatial.position[0] = x + 0.5;
                        e.spatial.position[1] = -(y + 0.5);
                        e.spatial.position[2] = 0.5;
                        e.door = door;
                        e.sprite = new Model.Sprite();
                        e.sprite.sheet = 0;
                        e.sprite.index = 98;
                        e.sprite.flat = true;
                        if (grid.getTile(x-1, y) != Model.Tile.Void)
                            e.spatial.facing = -Math.PI/2;
                        world.entities.push(e);
                    }
                }
            }

            let objects = map.layers[1].objects;
            for (let obj of objects)
            {
                let entity = new Model.Entity();
                entity.spatial = new Model.Spatial();
                entity.spatial.position[0] = obj.x / map.tilesets[0].tilewidth + 0.5;
                entity.spatial.position[1] = -obj.y / map.tilesets[0].tileheight + 0.5;
                entity.spatial.position[2] = 0.5;
                entity.sprite = new Model.Sprite();
                let type = obj.gid - 1;
                let sheet = Math.floor(type / 256);
                entity.sprite.index = type % 256;
                entity.sprite.sheet = sheet;
                if (type == 306) // player
                {
                    let player = new Model.Player();
                    entity.player = player;
                }
                else if (type == 307) // dog
                {
                }
                else if (type == 308) // guard
                {
                    entity.sprite.index = 0;
                    entity.sprite.sheet = 2;
                    entity.sprite.sheetSize = 8;

                    entity.creature = new Model.Creature;
                    entity.creature.type = Model.CreatureTypes.Guard;
                     world.entities.push(entity);
                    break;
                }
                else if (type < 256)
                {
                    let pushwall = new Model.Pushwall();
                    entity.sprite.flat = true;
                    entity.pushwall = pushwall;
                    entity.block = new Model.Block();
                    entity.block.index = entity.sprite.index;
                    entity.block.sheet = entity.sprite.sheet;
                    entity.spatial.radius = 0.5;
                    entity.sprite = null;
                }
                
                world.entities.push(entity);
            }
            
            this.world = world;
            this.flags.init = true;
        });
    }

    clearFlags()
    {
        this.flags.init = false;
    }
    json:string = null;
    update(inputstate:InputState)
    {
        if (inputstate.loadState)
        {
            this.json = localStorage.getItem('state1');
            inputstate.loadState = false;
            this.world = JSON.parse(this.json);
            Object.setPrototypeOf(this.world.grid, Model.Grid.prototype);
            for (let e of this.world.entities)
            {
                if (e.door != null)
                    Object.setPrototypeOf(e.door, Model.Door.prototype);
                if (e.pushwall != null)
                    Object.setPrototypeOf(e.pushwall, Model.Pushwall.prototype);

                if (e.player != null)
                {
                    inputstate.angleZ = e.spatial.facing;
                }
            }
        }

        Physics.update(this.world, inputstate);

        if (inputstate.saveState)
        {
            inputstate.saveState = false;
            this.json = JSON.stringify(this.world);
            localStorage.setItem('state1', this.json);
        }
    }
}