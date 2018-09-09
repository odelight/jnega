import { Util } from "./Util.js";
import { Controller } from "./Controller.js";
import { View } from "./View/View.js";
import { Model } from "./Model/Model.js";
let canvas = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
let controller;
let view;
let model;
let time = 0;
start();
function start() {
    model = new Model();
    view = new View(Util.checkType(canvas.getContext("2d"), CanvasRenderingContext2D), model);
    controller = new Controller(canvas, view);
    let updateVar = setInterval(tick, 10);
}
function tick() {
    time++;
    view.draw();
}
