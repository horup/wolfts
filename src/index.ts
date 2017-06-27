import * as renderer from './renderer';
import * as Model from './model';
import * as $ from 'jquery';
import System from './system';

let system = new System();
system.loadMap('maps/e01m01.json');
/*
function init()
{
    $.get('maps/e01m01.json').done((data:Model.Map) =>
    {
        renderer.init(data);
    });
}

init();*/
