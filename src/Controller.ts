import { Point } from "./Model/Point.js";
import { View } from "./View/View.js";

export class Controller{
    private static instance : Controller;
    private view : View;
    private firstPoint : Point;
    
    constructor(canvas : HTMLCanvasElement, view : View) {
        if (!Controller.instance) {
            Controller.instance = this;
            this.view = view;
            canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
            canvas.addEventListener('click', (event) => this.onMouseClick(event));
            canvas.addEventListener('touchstart', (event) => this.onScreenTouch(event));
            canvas.addEventListener('touchmove', (event) => this.onTouchMove(event));
        }
        else
            console.warn("Controller already exists. An attempt to create another instance of Controller was made.");
    }



    onMouseClick(event : MouseEvent){
        this.view.click(new Point(event.offsetX, event.offsetY));
    }

    onMouseMove(event : MouseEvent) {
        this.view.cursorMove(new Point(event.offsetX, event.offsetY));
    }

    onScreenTouch(event : TouchEvent) {
        //handle screen touch event;
    }

    onTouchMove(event : TouchEvent) {
       // handle screen touch movement event;
    }

}