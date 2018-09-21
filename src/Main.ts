import { Util } from "./Util.js";
import { Controller} from "./Controller.js";
import { View } from "./View/View.js";
import { ModelAPI } from "./Model/ModelAPI.js";
import { Point } from "./Model/Point.js";
import { Segment } from "./Model/Segment.js";
import { wood } from "./Model/Material.js";
import { Vector } from "./Math/Vector.js";
import { basicSineWave } from "./Math/Paths.js";

let canvas : HTMLCanvasElement = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
let controller : Controller;
let view : View;
let model : ModelAPI;
let time = 0;
start();

function start() {
    model = new ModelAPI();
    view = new View(Util.checkType(canvas.getContext("2d"), CanvasRenderingContext2D), model);
    controller = Controller.getInstance(canvas, model, view);
    initLevel(controller);
	let updateVar = setInterval(tick, 10);
}

function initLevel(controller : Controller) {
    controller.pushScriptedPoint(basicSineWave(new Point(40,200), new Vector(30,0), 40));
    controller.pushScriptedPoint(basicSineWave(new Point(360,200), new Vector(30,0), 40));
   // controller.pushSegment(new Point(40,10), new Point(200,40), wood);
   // controller.pushSegment(new Point(360,10), new Point(200,40), wood);
}


function tick() {
    time++;
    if(model.isRunning()) {
        model.step();
    }
    view.draw();
}