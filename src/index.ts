//import * as renderer from './renderer';
import Renderer from './renderer/';
import * as Model from './model';
import * as $ from 'jquery';
import System from './system';

let system = new System();
let renderer = new Renderer(system);
renderer.init();

system.loadMap('maps/e01m01.json');