#target illustrator
#include "./letterism-core(T).jsx"

function clsArc(centerpoint, radius, startangle, endangle, radius2, dstyle) {

this.center = centerpoint;
this.radius = radius;
this.radius2 = radius2
this.startAngle = startangle;
this.endAngle = endangle;
this.angle = this.endAngle - this.startAngle;

this.draw = function (dstyle) {
	var d = 0.55228515624 * this.radius * Math.tan(this.angle / 2);
	var p1 = this.center.polar(this.startAngle, this.radius);
	var p4 = this.center.polar(this.endAngle, this.radius);
	var p2 = p1.polar(this.startAngle + hpi, d);
	var p3 = p4.polar(this.endAngle - hpi, d);
	//var ln = new clsLine(this.center, p1);
	var cp = app.activeDocument.pathItems.add();
	var sp = cp.pathPoints.add()
	sp.anchor = Array(p1.x, p1.y);
	sp.rightDirection = Array(p2.x, p2.y);
	sp.leftDirection = sp.anchor;
	sp.pointType = PointType.CORNER;
	var ep = cp.pathPoints.add()
	ep.anchor = Array(p4.x, p4.y);
	ep.leftDirection = Array(p3.x, p3.y);
	ep.rightDirection = ep.anchor;
	ep.pointType = PointType.CORNER;
	if(arguments[4] != 'undefined') {
		d = 0.55228515624 * this.radius2 * Math.tan(this.angle / 2);
		p1 = this.center.polar(this.endAngle, this.radius2);
		p4 = this.center.polar(this.startAngle, this.radius2);
		p2 = p1.polar(this.endAngle - hpi, d);
		p3 = p4.polar(this.startAngle + hpi, d);
		sp2 = cp.pathPoints.add();
		sp2.anchor = Array(p1.x, p1.y);
		sp2.rightDirection = Array(p2.x, p2.y);
		sp2.leftDirection = sp2.anchor;
		sp.pointType = PointType.CORNER;
		ep2 = cp.pathPoints.add();
		ep2.anchor = Array(p4.x, p4.y);
		ep2.leftDirection = Array(p3.x, p3.y);
		ep2.rightDirection = ep2.anchor;
		ep2.pointType = PointType.CORNER;
		cp.closed = true;
	}
	// Apply drawing style
	if(dstyle instanceof clsDrawingStyle){
		if(dstyle.filled){
			cp.filled = true;
			cp.fillColor = dstyle.fillColor;
			cp.opacity = dstyle.fillOpacity;
			cp.stroked = false;
		}
		if(dstyle.stroked){
			var oline = cp.duplicate();
			oline.pathItems[0].filled = false;
			oline.pathItems[0].stroked = true;
			oline.pathItems[0].strokeWidth = dstyle.strokeWidth;
			oline.pathItems[0].strokeColor = dstyle.strokeColor;
			oline.pathItems[0].opacity = dstyle.strokeOpacity;
		}
	}
}

}



function artWedges () {
	
var gOrigin = Origin();
gColorScheme = new clsColorScheme();
gColorScheme.getAiPalette("purple");
var ds = new clsDrawingStyle();
var sa = 0
var ea = 0;
var angle;
var maxr;
var minr;
var r1;
var r2;

ds.filled = true;
ds.stroked = false;
//while(ea < twopi) {
//	angle = hpi * getRandomNumber(0.1, 0.5);
//	ea = sa + angle;
//	if(ea > twopi) {
//		ea = twopi;
//	}
//	maxr = 500 * getRandomNumber(0.7, 1);
//	minr = 150 * getRandomNumber(0.9, 1);
//	r1 = minr;
//	r2 = minr;
//	while(r1 < maxr) {
//		r1 = r2 + getRandomNumber(0.1, 0.5) * (maxr - minr);
//		if(r1 > maxr) r1 = maxr;
		ds.fillColor = gColorScheme.getIndexedColor(getRandomInt(0, gColorScheme.palette.length));
		var arc = new clsArc(new clsPoint(500, 400), 200, 0, ea,100, ds);
		arc.draw(ds);
		r2 = r1;
//	}
	sa = ea;
	
gOrigin.restore();

}

//artWedges();