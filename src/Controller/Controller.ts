import { Point } from "../Model/Point.js";
import { View } from "../View/View.js";
import { ModelAPI } from "../Model/ModelAPI.js";
import { Path } from "../Math/Path.js";
import { Segment } from "../Model/Segment.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Main.js";
import { LevelControls } from "./LevelControls.js";

export interface ControlScheme {
    handleMouseClick(event : MouseEvent) : void;
    handleMouseMove(event : MouseEvent) : void;
    handleKeyPress(event : KeyboardEvent) : void;
    handleScreenTouch(event : TouchEvent) : void;
    handleTouchMove(event : TouchEvent) : void;
}

export class Controller {
    private static instance : Controller;
    private model : ModelAPI;
    private view : View;
    private activeControls : ControlScheme;
    private levelControls : LevelControls;
    
    private constructor(canvas : HTMLCanvasElement, model: ModelAPI, view : View) {
        this.model = model;
        this.view = view;
        this.levelControls = new LevelControls(model, view);
        this.activeControls = this.levelControls;

        canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
        canvas.addEventListener('click', (event) => this.onMouseClick(event));
        document.addEventListener('keydown', (event) => this.onKeyPress(event));


        canvas.addEventListener('touchstart', (event) => this.onScreenTouch(event));
        canvas.addEventListener('touchmove', (event) => this.onTouchMove(event));
    }

    static getInstance(canvas ?: HTMLCanvasElement, model ?: ModelAPI, view ?: View) : Controller {
        if (!Controller.instance) {
            if (canvas == undefined || model == undefined || view == undefined)
                console.error("Controller must be initialized by passing a canvas, model, and view to getInstance.");
            else
                Controller.instance = new Controller(canvas, model, view);
        }

        return Controller.instance;
    }

    pushScriptedPoint(path : Path) {
        this.levelControls.pushScriptedPoint(path);
    }

    pushObjectivePoint(position : Point, mass : number, id : number) {
        this.levelControls.pushObjectivePoint(position, mass, id);
    }

    pushSegment(segment : Segment) {
        this.levelControls.pushSegment(segment);
    }



    // ==================
    // * EVENT HANDLERS *
    // ==================

    private isOutsideCanvas(x : number, y : number) : boolean {
        return x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT;
    }



    onMouseClick(event : MouseEvent) {
        if (this.isOutsideCanvas(event.offsetX, event.offsetY))
            return;

        this.activeControls.handleMouseClick(event);
    }

    onMouseMove(event : MouseEvent) {
        if (this.isOutsideCanvas(event.offsetX, event.offsetY))
            return;

        this.activeControls.handleMouseMove(event);
    }

    onKeyPress(event : KeyboardEvent) {
        this.activeControls.handleKeyPress(event);
    }



    onScreenTouch(event : TouchEvent) {
        //handle screen touch event;
    }

    onTouchMove(event : TouchEvent) {
       // handle screen touch movement event;
    }

}
