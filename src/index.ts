import * as renderer from './renderer';
import * as Model from './model';
import * as $ from 'jquery';

function init()
{
    $.get('maps/e01m01.json').done((data:Model.Map) =>
    {
        renderer.init(data);
    });
}

init();
