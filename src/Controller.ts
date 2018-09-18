import { Point } from "./Model/Point.js";
import { View } from "./View/View.js";
import { Model } from "./Model/Model.js";

export class Controller{
    private static instance : Controller;
    private model : Model;
    private view : View;
    private lineStart : Point | null;
    
    private constructor(canvas : HTMLCanvasElement, model: Model, view : View) {
        this.model = model;
        this.view = view;
        canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
        canvas.addEventListener('click', (event) => this.onMouseClick(event));
        document.addEventListener('keydown', (event) => this.onKeyPress(event));


        canvas.addEventListener('touchstart', (event) => this.onScreenTouch(event));
        canvas.addEventListener('touchmove', (event) => this.onTouchMove(event));
    }

    static getInstance(canvas ?: HTMLCanvasElement, model ?: Model, view ?: View) : Controller {
        if (!Controller.instance) {
            if (canvas == undefined || model == undefined || view == undefined)
                console.error("Controller must be initialized by passing a canvas, model, and view to getInstance.");
            else
                Controller.instance = new Controller(canvas, model, view);
        }

        return Controller.instance;
    }


    
    private placePoint(point : Point) {
        if(this.lineStart == null) {
            this.lineStart = point;
        } else {
            this.model.pushSegment(this.lineStart, point);
            this.lineStart = null;
        }
    }

    onMouseClick(event : MouseEvent){
        this.placePoint(new Point(event.offsetX, event.offsetY));
        this.view.setLineStart(this.lineStart);
    }

    onMouseMove(event : MouseEvent) {
        this.view.setCursorPosition(new Point(event.offsetX, event.offsetY));
    }

    onKeyPress(event : KeyboardEvent) {
        if(event.code == "KeyS"){
            this.view.start();
            event.preventDefault();
        }

    }
    onScreenTouch(event : TouchEvent) {
        //handle screen touch event;
    }

    onTouchMove(event : TouchEvent) {
       // handle screen touch movement event;
    }

}