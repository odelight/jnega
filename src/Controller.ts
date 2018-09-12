import { Point } from "./Model/Point.js";
import { View } from "./View/View.js";

export class Controller{
    private static instance : Controller;
    private view : View;
    private firstPoint : Point;
    
    constructor(canvas : HTMLCanvasElement, view : View) {
        canvas.addEventListener('mousemove',Controller.staticOnMouseMove);
        canvas.addEventListener('click', Controller.staticOnMouseClick);
        canvas.addEventListener('touchstart', Controller.staticOnScreenTouch);
        canvas.addEventListener('touchmove', Controller.staticOnTouchMove);
        Controller.instance = this;
        this.view = view;
    }

    static staticOnMouseMove(event : MouseEvent) {
        Controller.instance.onMouseMove(event);
    }
    
    static staticOnMouseClick(event : MouseEvent) {
        Controller.instance.onMouseClick(event);
    }

    static staticOnScreenTouch(event : TouchEvent) {
        //Controller.instance.onScreenTouch(event);
    }

    static staticOnTouchMove(event : TouchEvent) {
       //Controller.instance.onTouchMove(event);
    }

    onMouseClick(event : MouseEvent){
        this.view.click(new Point(event.offsetX, event.offsetY));
    }

    onMouseMove(event : MouseEvent) {
        this.view.cursorMove(new Point(event.offsetX, event.offsetY));
    }

}