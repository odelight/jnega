import { Point } from "../Model/Point.js";
import { Model } from "../Model/Model.js";
import { Segment } from "../Model/Segment.js";

export class View {
    private model : Model;
    private lineStart : Point | null = null;
    private ctx : CanvasRenderingContext2D;

    constructor(ctx : CanvasRenderingContext2D, model : Model) {
        this.ctx = ctx;
        this.model = model;
    }
    
    click(point : Point) {
        if(this.lineStart == null) {
            this.lineStart = point;
        } else {
            this.model.pushSegment(this.lineStart, point);
            this.lineStart = null;
        }
    }

    draw() {
        this.drawSegments();
    }

    drawSegments() {
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
