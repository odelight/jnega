import { Point } from "./Model/Point.js";
import { View } from "./View/View.js";
import { ModelAPI } from "./Model/ModelAPI.js";
import { wood } from "./Model/Material.js";
import { Material } from "./Model/Material.js";

const MAP_WIDTH = 400;
const MAP_HEIGHT = 400;
const SNAP_RADIUS = 10;

export class Controller{
    private static instance : Controller;
    private model : ModelAPI;
    private view : View;
    private lineStart : Point | null;
    private pointMap : Point[][] | null[][];
    
    private constructor(canvas : HTMLCanvasElement, model: ModelAPI, view : View) {
        this.model = model;
        this.view = view;
        this.initPointMap();

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

    pushScriptedPoint(path : (t : number) => Point) {
        this.addPointToMap(path(0));
        this.model.pushScriptedPoint(path);
    }

    pushSegment(a : Point, b : Point, material : Material) {
        this.addPointToMap(a);
        this.addPointToMap(b);
        this.model.pushSegment(a, b, material);
    }


    // =========
    // * LOGIC *
    // =========

    private clearPoint() {
        this.lineStart = null;
        this.view.setLineStart(null);
    }

    private placePoint(point : Point) {
        if (this.model.isRunning())
            return;

        if(this.lineStart == null) {
            this.lineStart = point;
        } else {
            this.model.pushSegment(this.lineStart, point, wood);
            this.lineStart = null;
        }
        this.addPointToMap(point);
    }

    private snapPoint(point : Point) : Point {
        if (this.pointMap[point.x][point.y] == null)
            return point;
        else
            return <Point>this.pointMap[point.x][point.y];
    }

    private initPointMap() {
        this.pointMap = new Array(MAP_WIDTH);
        for (let i : number = 0; i < MAP_WIDTH; i++) {
            this.pointMap[i] = new Array(MAP_HEIGHT);
            for (let j: number = 0; j < MAP_HEIGHT; j++) {
                this.pointMap[i][j] = null;
            }
        }
    }

    private addPointToMap(point : Point) {
        for (let i = -SNAP_RADIUS; i <= SNAP_RADIUS; i++) {
            let loc_i = point.x + i;
            if (loc_i >= 0 && loc_i < MAP_WIDTH) {
                for (let j = -(SNAP_RADIUS - Math.abs(i)); j <= SNAP_RADIUS - Math.abs(i); j++) {
                    let loc_j = point.y + j;
                    if (loc_j >= 0 && loc_j < MAP_HEIGHT) {
                        if (this.pointMap[loc_i][loc_j] == null) {
                            this.pointMap[loc_i][loc_j] = point;
                        } else if (this.calculateDistance(new Point(loc_i, loc_j), point) < this.calculateDistance(new Point(loc_i, loc_j), <Point>this.pointMap[loc_i][loc_j])) {
                            this.pointMap[loc_i][loc_j] = point;
                        }
                    }
                }
            }
        }
    }

    private calculateDistance(a : Point, b : Point) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private isOutsideCanvas(x : number, y : number) : boolean {
        return x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT;
    }



    // ==================
    // * EVENT HANDLERS *
    // ==================

    onMouseClick(event : MouseEvent) {
        if (this.isOutsideCanvas(event.offsetX, event.offsetY))
            return;

        this.placePoint(this.snapPoint(new Point(event.offsetX, event.offsetY)));
        this.view.setLineStart(this.lineStart);
    }

    onMouseMove(event : MouseEvent) {
        if (this.isOutsideCanvas(event.offsetX, event.offsetY))
            return;

        this.view.setCursorPosition(this.snapPoint(new Point(event.offsetX, event.offsetY)));
    }

    onKeyPress(event : KeyboardEvent) {
        if (event.code == "KeyS") {
            this.clearPoint();
            if(this.model.isRunning()) {
                this.model.abort();
            } else {
                this.model.start();
            }
            event.preventDefault();
        }
        if (event.code == "KeyD") {
            this.clearPoint();
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
