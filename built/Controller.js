import { Point } from "./Model/Point.js";
export class Controller {
    constructor(canvas, view) {
        canvas.addEventListener('mousemove', Controller.staticOnMouseMove);
        canvas.addEventListener('click', Controller.staticOnMouseClick);
        canvas.addEventListener('touchstart', Controller.staticOnScreenTouch);
        canvas.addEventListener('touchmove', Controller.staticOnTouchMove);
        Controller.instance = this;
        this.view = view;
    }
    static staticOnMouseMove(event) {
        //Controller.instance.onMouseMove(event);
    }
    static staticOnMouseClick(event) {
        Controller.instance.onMouseClick(event);
    }
    static staticOnScreenTouch(event) {
        //Controller.instance.onScreenTouch(event);
    }
    static staticOnTouchMove(event) {
        //Controller.instance.onTouchMove(event);
    }
    onMouseClick(event) {
        this.view.click(new Point(event.clientX, event.clientY));
    }
    onScreenTouch(event) {
    }
}
