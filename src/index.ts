import * as renderer from './renderer';
import * as Model from './model';
import * as $ from 'jquery';
import System from './system';

let system = new System();
renderer.init(system);

system.loadMap('maps/e01m01.json');