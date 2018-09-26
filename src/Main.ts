import { Util } from "./Util.js";
import { Controller} from "./Controller.js";
import { View } from "./View/View.js";
import { ModelAPI } from "./Model/ModelAPI.js";
import { Point } from "./Model/Point.js";
import { Segment } from "./Model/Segment.js";
import { wood } from "./Model/Material.js";
import { Vector } from "./Math/Vector.js";
import { basicCosineWave } from "./Math/Path.js";

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
    controller.pushScriptedPoint(basicCosineWave(new Point(40,200), new Vector(30,0), 40));
    controller.pushScriptedPoint(basicCosineWave(new Point(360,200), new Vector(30,0), 40));
    controller.pushObjectivePoint(new Point(200, 300), 2000, 1);
    //Lose if the massive object drops off screen
    model.addLossCondition(model => 
        model.getObjectivePoints()
        .filter(objectivePoint => objectivePoint.id == 1)
        .some(objectivePoint => objectivePoint.position.y > 400));
    //Win after 5 seconds
    model.addVictoryCondition(model =>
        model.getTime() > 500
    )
}


function tick() {
    time++;
    if(model.isRunning()) {
        model.step();
    }
    view.draw();
}