import { Point } from "../Model/Point.js";
import { ModelAPI, GameState } from "../Model/ModelAPI.js";
import { Segment } from "../Model/Segment.js";
import { Material, wood } from "../Model/Material.js";
import { getColorFromStretch } from "./SegmentColor.js";

export class View {
    private model : ModelAPI;
    private lineStart : Point | null = null;
    private cursorPosition : Point | null = null;
    private ctx : CanvasRenderingContext2D;
    private cursorImage : ImageData;
    private cursorSize : number;

    constructor(ctx : CanvasRenderingContext2D, model : ModelAPI) {
        this.ctx = ctx;
        this.model = model;
        this.setCursorImage();
    }

    private setCursorImage() {
        this.cursorSize = 3;
        this.cursorImage = this.ctx.createImageData(this.cursorSize, this.cursorSize);
        for (let i : number = 0; i < this.cursorSize * this.cursorSize * 4; i += 4) {
            this.cursorImage.data[i] = 0x00;
            this.cursorImage.data[i+1] = 0x00;
            this.cursorImage.data[i+2] = 0xFF;
            this.cursorImage.data[i+3] = 0xFF;
        }
    }
    
    setLineStart(point : Point | null) {
        this.lineStart = point;
    }

    setCursorPosition(point : Point) {
        this.cursorPosition = point;
    }

    draw() {
        this.clear();
        this.drawCurrentSegment();
        this.drawPlacedSegments();
        this.drawPoints();
        this.drawCursorPosition();
        this.checkGameState();
        this.drawBudget();
    }
    private hasAlerted = false;
    checkGameState() {
        if(this.hasAlerted) {
            return;
        }
        let gameState = this.model.getGameOver();
        if(gameState == GameState.WON) {
            alert("You won!");
            this.hasAlerted = true;
        } else if (gameState == GameState.LOST) {
            alert("You lost!");
            this.hasAlerted = true;
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawCursorPosition() {
        if (this.cursorPosition == null || this.model.isRunning())
            return;

        let offset : number = Math.trunc(this.cursorSize / 2);
        this.ctx.putImageData(this.cursorImage, this.cursorPosition.x - offset, this.cursorPosition.y - offset);
    }

    drawCurrentSegment() {
        if(this.lineStart == null || this.cursorPosition == null) {
            return;
        }
        let segment = new Segment(this.lineStart, this.cursorPosition, wood);
        let color = (segment.cost() > this.model.getRemainingBudget()) ? "#ff0000" : null;
        this.drawSegment(segment, color);
    }

    drawPlacedSegments() {
        let segments : Segment[] = this.model.getSegments();
        segments.forEach((s) => this.drawSegment(s));
    }

    drawSegment(segment : Segment, colorOverride : string | null = null) {
      this.ctx.save();
      this.ctx.lineWidth = 3;
      if(colorOverride == null) {
        this.ctx.strokeStyle = getColorFromStretch(segment.getStretch());
      } else {
          this.ctx.strokeStyle = colorOverride;
      }
      this.ctx.beginPath();
      this.ctx.moveTo(segment.a.x, segment.a.y);
      this.ctx.lineTo(segment.b.x, segment.b.y);
      this.ctx.stroke();
	  this.ctx.closePath();
      this.ctx.restore();
    }

    
    drawPoints() {
        let segments = this.model.getSegments();
        let pointMap = new Map<number, Point>();
        let scriptedPtMap = new Map<number, Point>();
        for(let p of this.model.getScriptedPoints()) {
            scriptedPtMap.set(p.hash(), p);
        }
        for(let s of segments) {
            pointMap.set(s.a.hash(), s.a);
            pointMap.set(s.b.hash(), s.b);
        }
        for(let p of pointMap.values()) {
            if(!scriptedPtMap.has(p.hash())) {
                this.drawJoint(p);
            }
        }
        for(let p of scriptedPtMap.values()) {
            this.drawScriptedPoint(p);
        }
        this.drawMassivePoints();
    }
    
    drawJoint(p : Point) {
        this.ctx.save();
        this.ctx.lineWidth = 4;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.strokeStyle = "#000000";
        this.ctx.beginPath();
        this.ctx.ellipse(p.x,p.y,3,3,0,0,360);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();    
    }
      
    drawScriptedPoint(p : Point) {
        this.ctx.save();
        this.ctx.fillStyle = "#000000";
        this.ctx.beginPath();
        this.ctx.ellipse(p.x,p.y,3,3,0,0,360);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }
    drawMassivePoints() {
        for(let obj of this.model.getObjectivePoints()) {
            this.drawMassivePoint(obj.position);
        }
    }
    drawMassivePoint(p : Point) {
        this.ctx.save();
        this.ctx.fillStyle = "#ff00ff";
        this.ctx.beginPath();
        this.ctx.ellipse(p.x,p.y,6,6,0,0,360);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }
    drawBudget() {
        let budget = this.model.getRemainingBudget();
        this.ctx.fillText("$" + budget.toFixed(0), 10, 10);
    }
}
