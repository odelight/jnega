import { Point } from "../Model/Point.js";
import { View } from "../View/View.js";
import { ModelAPI } from "../Model/ModelAPI.js";
import { wood } from "../Model/Material.js";
import { Material } from "../Model/Material.js";
import { Path } from "../Math/Path.js";
import { Segment } from "../Model/Segment.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Main.js";
import { ControlScheme } from "./Controller.js";

const SNAP_RADIUS = 20;

export class PlacingControls implements ControlScheme {
    private static instance : PlacingControls;
    private model : ModelAPI;
    private view : View;
    private lineStart : Point | null;
    private pointMap : Point[][] | null[][];
    public selectedMaterial: Material;
    
    constructor(model: ModelAPI, view : View) {
        if (!PlacingControls.instance) {
            PlacingControls.instance = this;
            this.model = model;
            this.view = view;
            this.initPointMap();
            this.selectedMaterial = wood;
        }
        else {
            throw "PlacingControls constructed outside of Controller.";
        }
    }

    pushScriptedPoint(path : Path) {
        this.addPointToMap(path.initialPosition());
        this.model.pushScriptedPoint(path);
    }

    pushObjectivePoint(position : Point, mass : number, id : number) {
        this.addPointToMap(position);
        this.model.pushObjectivePoint(position, mass, id);
    }

    pushSegment(segment : Segment) {
        if(segment.length() == 0) {
            //Don't create segments of length zero
            return;
        }
        this.addPointToMap(segment.a);
        this.addPointToMap(segment.b);
        this.model.pushSegment(segment);
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
            let segment = new Segment(this.lineStart, point, this.selectedMaterial);
            if(segment.cost() > this.model.getRemainingBudget()) {
                alert("Can't afford to place segment!");
                return;
            }
            this.pushSegment(segment);
            this.lineStart = null;
        }
    }

    private snapPoint(point : Point) : Point {
        if (this.pointMap[point.x][point.y] == null)
            return point;
        else
            return <Point>this.pointMap[point.x][point.y];
    }

    private initPointMap() {
        this.pointMap = new Array(CANVAS_WIDTH);
        for (let i : number = 0; i < CANVAS_WIDTH; i++) {
            this.pointMap[i] = new Array(CANVAS_HEIGHT);
            for (let j: number = 0; j < CANVAS_HEIGHT; j++) {
                this.pointMap[i][j] = null;
            }
        }
    }

    private addPointToMap(point : Point) {
        for (let i = -SNAP_RADIUS; i <= SNAP_RADIUS; i++) {
            let loc_i = point.x + i;
            if (loc_i >= 0 && loc_i < CANVAS_WIDTH) {
                for (let j = -(SNAP_RADIUS - Math.abs(i)); j <= SNAP_RADIUS - Math.abs(i); j++) {
                    let loc_j = point.y + j;
                    if (loc_j >= 0 && loc_j < CANVAS_HEIGHT) {
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



    // ==================
    // * EVENT HANDLERS *
    // ==================

    handleMouseClick(event : MouseEvent) {
        this.placePoint(this.snapPoint(new Point(event.offsetX, event.offsetY)));
        this.view.setLineStart(this.lineStart);
    }

    handleMouseMove(event : MouseEvent) {
        this.view.setCursorPosition(this.snapPoint(new Point(event.offsetX, event.offsetY)));
    }

    handleKeyPress(event : KeyboardEvent) {
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



    handleScreenTouch(event : TouchEvent) {
        //handle screen touch event;
    }

    handleTouchMove(event : TouchEvent) {
       // handle screen touch movement event;
    }

}
