import { Point } from "../Model/Point.js";
import { View } from "../View/View.js";
import { ModelAPI } from "../Model/ModelAPI.js";
import { wood } from "../Model/Material.js";
import { Path } from "../Math/Path.js";
import { Segment } from "../Model/Segment.js";
import { ControlScheme } from "./Controller.js";
import { PlacingControls } from "./PlacingControls.js";
import { Toolbar, Button } from "./Toolbar.js";

export class LevelControls implements ControlScheme {
    private static instance : LevelControls;
    private model : ModelAPI;
    private view : View;
    private toolbar : Toolbar;
    private activeControls : ControlScheme;
    private placingControls : PlacingControls;
    
    constructor(model: ModelAPI, view : View) {
        if (!LevelControls.instance) {
            LevelControls.instance = this;
            this.model = model;
            this.view = view;
            this.placingControls = new PlacingControls(model, view);
            this.activeControls = this.placingControls;
            this.initToolbar();
            this.view.setToolbarReference(this.toolbar);
        }
        else {
            throw "LevelControls constructed outside of Controller.";
        }
    }

    private initToolbar() {
        this.toolbar = new Toolbar();
        this.toolbar.addButton(new woodButton(this.placingControls, "Digit1"));
        this.toolbar.addButton(new steelButton(this.placingControls, "Escape"));
    }



    pushScriptedPoint(path : Path) {
        this.placingControls.pushScriptedPoint(path);
    }

    pushObjectivePoint(position : Point, mass : number, id : number) {
        this.placingControls.pushObjectivePoint(position, mass, id);
    }

    pushSegment(segment : Segment) {
        this.placingControls.pushSegment(segment);
    }



    // ==================
    // * EVENT HANDLERS *
    // ==================

    handleMouseClick(event : MouseEvent) {
        if (this.toolbar.isInsideToolbar(event.offsetX, event.offsetY)) {
            this.toolbar.buttons.forEach((button) => button.handleMouseClick(event));
        } else {
            this.activeControls.handleMouseClick(event);
        }
    }

    handleMouseMove(event : MouseEvent) {
        this.activeControls.handleMouseMove(event);
    }

    handleKeyPress(event : KeyboardEvent) {
        this.toolbar.buttons.forEach((button) => button.handleKeyPress(event));
        this.activeControls.handleKeyPress(event);
    }



    handleScreenTouch(event : TouchEvent) {
        //handle screen touch event;
    }

    handleTouchMove(event : TouchEvent) {
       // handle screen touch movement event;
    }

}



// ===================
// * TOOLBAR BUTTONS *
// ===================

class woodButton extends Button {
    private placingControls : PlacingControls;

    constructor(controls : PlacingControls, key ?: string) {
        super("images/woodButton.jpg", key);
        this.placingControls = controls;
    }

    handlePress() : void {
        this.placingControls.selectedMaterial = wood;
        console.warn("Pressed woodButton!");
    }
}

class steelButton extends Button {
    private placingControls : PlacingControls;

    constructor(controls : PlacingControls, key ?: string) {
        super("images/woodButton.jpg", key);
        this.placingControls = controls;
    }

    handlePress() : void {
        this.placingControls.selectedMaterial = wood;
        console.warn("Pressed steelButton! WOOD selected though.");
    }
}
