export interface Layer {
    data: number[];
    width: number;
    height: number;
}

export interface Tileset {
    firstgid: number;
    columns: number;
    imageheight: number;
    image: string;
    imagewidth: number;
    tilewidth: number;
    tileheight: number;
}

export interface Map {
    layers: Layer[];
    tilesets: Tileset[];
}

export let defaultMap: Map = {
    layers: [
        {
            "data": [1, 1, 1, 7, 1, 1, 0, 0, 15, 15, 15, 15, 15, 15, 0, 0, 1, 0, 0, 0, 0, 1, 15, 15, 15, 0, 0, 0, 0, 15, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 15, 0, 0, 1, 0, 0, 0, 0, 1, 15, 15, 15, 0, 0, 0, 0, 15, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 0, 15, 15, 0, 0, 0, 33, 33, 33, 33, 33, 33, 0, 0, 0, 33, 0, 33, 0, 0, 0, 0, 33, 0, 0, 0, 0, 33, 0, 0, 0, 33, 0, 33, 0, 0, 0, 0, 33, 0, 105, 0, 0, 33, 33, 33, 33, 33, 0, 33, 0, 0, 0, 0, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 33, 0, 0, 0, 0, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "height": 16,
            "width": 16
        }],
    tilesets: [
        {
            "firstgid": 1,
            "columns": 6,
            "image": "textures\/walls.png",
            "imageheight": 1216,
            "imagewidth": 384,
            "tileheight": 64,
            "tilewidth": 64
        }]
};