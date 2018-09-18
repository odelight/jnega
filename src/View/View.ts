import { Point } from "../Model/Point.js";
import { ModelAPI } from "../Model/ModelAPI.js";
import { Segment } from "../Model/Segment.js";
import { Material, wood } from "../Model/Material.js";

export class View {
    private model : ModelAPI;
    private lineStart : Point | null = null;
    private cursorPosition : Point | null = null;
    private ctx : CanvasRenderingContext2D;

    constructor(ctx : CanvasRenderingContext2D, model : ModelAPI) {
        this.ctx = ctx;
        this.model = model;
    }
    
    setLineStart(point : Point | null) {
        this.lineStart = point;
    }

    setCursorPosition(point : Point) {
        this.cursorPosition = point;
    }

    start() {
        this.model.start();
    }

    draw() {
        this.clear();
        this.drawCurrentSegment();
        this.drawPlacedSegments();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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

}
