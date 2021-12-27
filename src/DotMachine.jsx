// Arabic Letterism
// Khalid M. Khalid
// October 2012

// Scattering letters about a straight line

#target illustrator
#include "./letterism-core(T).jsx"


// clsDotMachine: draws rhomboid dots in the passed rectangle
// rect: rectangle object, [dstyle]: drawing style object, [split]: real number >0 and <= 1
function clsDotMachine(rect, dstyle, cap, split) {
this.capGap = 0.1;	
// horizontalDots: draws a strip of horizontally aligned dots (accepts rotation)
this.horizontalDots = function (r, dstyle) {
	var d = r.height / 2;
	var p = new clsPoint(r.left, r.top);
	var pdash = p.polar(r.rotation, r.width);
	p = pdash.polar(r.rotation - Math.PI / 2, r.height / 2);
	var n = parseInt(r.width / r.height);
	for(var i = 0; i < n; i++){
		dot(p, d, r.rotation, dstyle);
		p = p.polar(r.rotation - Math.PI, d * 2);
	}
}

// verticalDots: a vertical stack of dots (does not accept rotation)
this.verticalDots = function (r, dstyle) {
	var d = r.width / 2;
	var p = new clsPoint(r.left + d, r.top);
	var n = parseInt(r.height / r.width);
	for(var i = 0; i < n; i++) {
		dot(p, d, Math.PI / 2, dstyle);
		p = p.polar(-Math.PI / 2, d * 2);
	}
}
	

if(rect instanceof clsRectangle){
	if(rect.width >= rect.height){ // horizontal row of dots
		if(typeof(arguments[2]) == 'number'){
			switch (cap) {
				case 1: // top cap
					var ps = new clsPoint(rect.left, rect.top);
					ln = new clsLine(ps, ps.polar(rect.rotation, rect.width));
					ln.draw()
					ps = ps.polar(rect.rotation - Math.PI / 2, rect.height * this.capGap);
					newRect = new clsRectangle(ps.x, ps.y, rect.width, rect.height - rect.height * this.capGap, rect.rotation);
					this.horizontalDots(newRect, dstyle);
					break;
				case 2: // bottom cap
					var ps = new clsPoint(rect.left, rect.top);
					ps = ps.polar(rect.rotation - Math.PI / 2, rect.height);
					ln = new clsLine(ps, ps.polar(rect.rotation, rect.width));
					ln.draw()
					newRect = new clsRectangle(rect.left, rect.top, rect.width, rect.height - rect.height * this.capGap, rect.rotation);
					this.horizontalDots(newRect, dstyle);
					break;
				case 3: // top and bottom caps
					
					break;
				case 4:// side caps
					break;
				default: // No caps
					this.horizontalDots(rect, dstyle);
					break;
			}
		}
		else {
			/*
			var rect1 = new clsRectangle(rect.left, rect.top, rect.width, rect.height * split, rect.rotation);
			this.horizontalDots(rect1, dstyle);
			pdash.x = rect1.left; pdash.y = rect1.top;
			p = pdash.polar(rect1.rotation - Math.PI / 2, rect1.height);
			rect1 = new clsRectangle(p.x, p.y, rect.width, rect.height * (1 - split), rect.rotation);
			*/
			this.horizontalDots(rect, dstyle);
		}
	}
	else { // vertical row of dots
			this.verticalDots(rect, dstyle);
	}
}


} //End of clsDotMachine

// dot: draws on single rhomboid dot
function dot(pnt, d, rot, dstyle) {
	var dp = app.activeDocument.pathItems.add();
	var p = dp.pathPoints.add();
	p.anchor = Array(pnt.x, pnt.y);
	p.leftDirection = p.anchor;
	p.rightDirection = p.anchor;
	p.pointType = PointType.CORNER;
	p = dp.pathPoints.add();
	p.anchor = Array(pnt.x - d, pnt.y + d);
	p.leftDirection = p.anchor;
	p.rightDirection = p.anchor;
	p.pointType = PointType.CORNER;
	p = dp.pathPoints.add();
	p.anchor = Array(pnt.x - 2 * d, pnt.y);
	p.leftDirection = p.anchor;
	p.rightDirection = p.anchor;
	p.pointType = PointType.CORNER;
	p = dp.pathPoints.add();
	p.anchor = Array(pnt.x - d, pnt.y - d);
	p.leftDirection = p.anchor;
	p.rightDirection = p.anchor;
	p.pointType = PointType.CORNER;
	dp.closed = true;
	dp.rotate(rot / Math.PI * 180, true, true, true, true, Transformation.RIGHT);
	// Apply drawing style
	if(dstyle instanceof clsDrawingStyle){
		if(dstyle.filled){
			dp.filled = true;
			dp.fillColor = dstyle.fillColor;
			dp.opacity = dstyle.fillOpacity;
			dp.stroked = false;
		}
		if(dstyle.stroked){
			var oline = dp                                                                                                                                                                                                                                                                                                   .duplicate();
			oline.filled = false;
			oline.strokeWidth = dstyle.strokeWidth;
			oline.stroked = true;
			oline.strokeColor = dstyle.strokeColor;
			oline.opacity = dstyle.strokeOpacity;
		}
	}
}
