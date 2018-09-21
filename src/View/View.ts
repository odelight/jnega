import { Point } from "../Model/Point.js";
import { ModelAPI } from "../Model/ModelAPI.js";
import { Segment } from "../Model/Segment.js";
import { Material, wood } from "../Model/Material.js";

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
        this.drawScriptedPoints();
        this.drawCursorPosition();
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
        this.drawSegment(new Segment(this.lineStart, this.cursorPosition, wood))
    }

    drawPlacedSegments() {
        let segments : Segment[] = this.model.getSegments();
        segments.forEach((s) => this.drawSegment(s));
    }

    drawSegment(segment : Segment) {
      this.ctx.save();
	  this.ctx.strokeStyle = "#ff0000"
      this.ctx.beginPath();
      this.ctx.moveTo(segment.a.x, segment.a.y);
      this.ctx.lineTo(segment.b.x, segment.b.y);
      this.ctx.stroke();
	  this.ctx.closePath();
      this.ctx.restore();
    }

    drawScriptedPoints() {
        let pts = this.model.getScriptedPoints();
        this.ctx.save();
        this.ctx.fillStyle = "#00ff00";
        for(let p of pts) {
            this.ctx.fillRect(p.x - 3, p.y -3, 6,6);
        }
        this.ctx.restore();
    }

}
