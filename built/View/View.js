export class View {
    constructor(ctx, model) {
        this.lineStart = null;
        this.ctx = ctx;
        this.model = model;
    }
    click(point) {
        if (this.lineStart == null) {
            this.lineStart = point;
        }
        else {
            this.model.pushSegment(this.lineStart, point);
            this.lineStart = null;
        }
    }
    draw() {
        this.drawSegments();
    }
    drawSegments() {
        let segments = this.model.getSegments();
        segments.forEach((s) => this.drawSegment(s));
    }
    drawSegment(segment) {
        this.ctx.save();
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.beginPath();
        this.ctx.moveTo(segment.a.x, segment.a.y);
        this.ctx.lineTo(segment.b.x, segment.b.y);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
}
