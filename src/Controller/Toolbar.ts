import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Main.js"

const BUTTON_SIZE = 100;

export abstract class Button {
    image : HTMLImageElement;
    size : number;
    xPos : number;
    yPos : number;
    protected hotkey : string | undefined;
    protected _toolbar : Toolbar;
    private bParentIsSet : boolean;

    set toolbar(toolbar : Toolbar) {
        if (this.bParentIsSet)
            return;

        this._toolbar = toolbar;
        this.bParentIsSet = true;
    }

    constructor(img : string, key ?: string) {
        this.size = BUTTON_SIZE;
        this.image = new Image(this.size, this.size);
        this.image.src = img;
        this.xPos = 0;
        this.yPos = 0;
        this.hotkey = key;
        this.bParentIsSet = false;
    }

    handleMouseClick(event : MouseEvent) : void {
        if (event.offsetX >= this.xPos && event.offsetX <= this.xPos + this.size && event.offsetY >= this.yPos && event.offsetY <= this.yPos + this.size) {
            this.handlePress();
        }
    }

    handleKeyPress(event : KeyboardEvent) : void {
        if (this.hotkey != undefined && event.code == this.hotkey) {
            this.handlePress();
            event.preventDefault();
        }
    }

    protected abstract handlePress() : void;
}



export class Toolbar {
    private _buttons : Button[];
    public buttonSize : number;
    public edgeOffset : number;
    private _bIsHorizontal : boolean;
    private _bIsTopOrLeft : boolean;
    private locationIterator : number;

    get buttons() : Button[] {
        return this._buttons;
    }

    get bIsHorizontal() {
        return this._bIsHorizontal;
    }

    set bIsHorizontal(val : boolean) {
        this._bIsHorizontal = val;
        this.locationIterator = 0;
        this._buttons.forEach((button) => this.setPosition(button));
    }

    get bIsTopOrLeft() {
        return this._bIsTopOrLeft;
    }

    set bIsTopOrLeft(val : boolean) {
        this._bIsTopOrLeft = val;
        this.locationIterator = 0;
        this._buttons.forEach((button) => this.setPosition(button));
    }



    constructor(buttons ?: Button[], size ?: number, edgeOffset ?: number, bIsHorizontal ?: boolean, bIsTopOrLeft ?: boolean) {
        this.locationIterator = 0;
        if (buttons != undefined) {
            this._buttons = buttons;
        } else {
            this._buttons = new Array();
            this.clearToolbar();
        }

        if (size != undefined) {
            this.buttonSize = size;
        } else {
            this.buttonSize = 100;
        }

        if (edgeOffset != undefined) {
            this.edgeOffset = edgeOffset;
        } else {
            this.edgeOffset = 0;
        }

        if (bIsHorizontal != undefined) {
            this._bIsHorizontal = bIsHorizontal;
        } else {
            this._bIsHorizontal = false;
        }

        if (bIsTopOrLeft != undefined) {
            this._bIsTopOrLeft = bIsTopOrLeft;
        } else {
            this._bIsTopOrLeft = false;
        }
    }



    private setPosition(button : Button) {
        if (this._bIsHorizontal) {
            button.xPos = this.edgeOffset + this.locationIterator * this.buttonSize;

            if (this._bIsTopOrLeft) {
                button.yPos = 0;
            } else {
                button.yPos = CANVAS_HEIGHT - this.buttonSize;
            }
        }
        else {
            button.yPos = this.edgeOffset + this.locationIterator * this.buttonSize;

            if (this._bIsTopOrLeft) {
                button.xPos = 0;
            } else {
                button.xPos = CANVAS_WIDTH - this.buttonSize;
            }
        }
        this.locationIterator++;
    }



    addButton(button : Button) {
        button.size = this.buttonSize;
        this.setPosition(button);
        button.toolbar = this;
        this._buttons.push(button);

        if (this.bIsHorizontal) {
            if (this._buttons.length * this.buttonSize > CANVAS_WIDTH) {
                console.warn("Added button off screen. Too many buttons.");
            }
        } else {
            if (this._buttons.length * this.buttonSize > CANVAS_HEIGHT) {
                console.warn("Added button off screen. Too many buttons.");
            }
        }
    }
    
    clearToolbar() {
        this._buttons.length = 0;
    }

    isInsideToolbar(x : number, y : number) : boolean {
        if (this._bIsHorizontal) {
            if (this._bIsTopOrLeft) {
                if (y < this.buttonSize) {
                    return true;
                }
            } else {
                if (y > CANVAS_HEIGHT - this.buttonSize) {
                    return true;
                }
            }
        } else {
            if (this._bIsTopOrLeft) {
                if (x < this.buttonSize) {
                    return true;
                }
            } else {
                if (x > CANVAS_WIDTH - this.buttonSize) {
                    return true;
                }
            }
        }

        return false;
    }
}
