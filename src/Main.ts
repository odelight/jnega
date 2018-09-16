import { Util } from "./Util.js";
import { Controller} from "./Controller.js";
import { View } from "./View/View.js";
import { Model } from "./Model/Model.js";

let canvas : HTMLCanvasElement = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
let controller : Controller;
let view : View;
let model : Model;
let time = 0;
start();

function start() {
    model = new Model();
    view = new View(Util.checkType(canvas.getContext("2d"), CanvasRenderingContext2D), model);
    controller = Controller.getInstance(canvas, view);
	let updateVar = setInterval(tick, 10);
}

function tick() {
    time++;
    view.draw();
}