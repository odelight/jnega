import { Segment } from "../Model/Segment.js";
import { getColorFromStretch, getColorFromRGB } from "./StretchColorer.js";
import { wood, steel, MaterialType } from "../Model/Material.js";
import { Util } from "../Util.js";


export interface SegmentAppearance {
    drawSegment(s : Segment, isRunning : boolean, legalDraw : boolean, ctx : CanvasRenderingContext2D) : void;
}

class StretchColoredAppearance implements SegmentAppearance {
    legalColor: string;
    illegalColor: string;
    constructor(legalColor : string, illegalColor : string) {
        this.legalColor = legalColor;
        this.illegalColor = illegalColor;
    }
    drawSegment(s: Segment, isRunning: boolean, legalDraw : boolean, ctx : CanvasRenderingContext2D) {
        if(isRunning) {
            this.drawSegmentRunning(s, ctx);
        } else {
            this.drawSegmentNotRunning(s, legalDraw, ctx);
        }
    }

    drawSegmentRunning(s : Segment, ctx : CanvasRenderingContext2D) {
        drawSegment(s, getColorFromStretch(s.getStretch()), ctx);
    }

    drawSegmentNotRunning(s: Segment, legalDraw: boolean, ctx: CanvasRenderingContext2D) {
        let color = legalDraw ? this.legalColor : this.illegalColor;
        drawSegment(s, color, ctx);
    }
}

function drawSegment(segment : Segment, colorOverride : string, ctx : CanvasRenderingContext2D) {
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = colorOverride;
    ctx.beginPath();
    ctx.moveTo(segment.a.x, segment.a.y);
    ctx.lineTo(segment.b.x, segment.b.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

let woodColor = getColorFromRGB(160,85,35);
let steelColor = getColorFromRGB(125,125,135);
let illegalDrawColor = getColorFromRGB(255,0,0);

let woodAppearance = new StretchColoredAppearance(woodColor, illegalDrawColor);
let steelAppearance = new StretchColoredAppearance(steelColor, illegalDrawColor);

export function getSegmentAppearance(m : MaterialType) {
    switch(m) {
        case MaterialType.Steel:
            return steelAppearance;
        case MaterialType.Wood:
            return woodAppearance;
    }
    return Util.assertUnreachable();
}
