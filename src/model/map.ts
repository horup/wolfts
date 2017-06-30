export class Layer {
    data: number[];
    width: number;
    height: number;
    objects?: Obj[];
}

export class Tileset {
    firstgid: number;
    columns: number;
    imageheight: number;
    image: string;
    imagewidth: number;
    tilewidth: number;
    tileheight: number;
}

export class Obj
{
    x:number;
    y:number;
    gid:number;
}

export class Level {
    layers: Layer[] = [];
    tilesets: Tileset[] = [];
}