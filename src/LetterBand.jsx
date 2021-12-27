// Arabic Letterism
// Khalid M. Khalid
// October 2012

// Scattering letters about a straight line

#target illustrator
#include "./letterism-core(T).jsx"

function clsLetterBand (fitpath, frequency, amplitude, size, density, dstyle) {
	var point = fitpath.pathPoints[0];
	var p1 = new clsPoint(point.anchor[0], point.anchor[1]);
	point = fitpath.pathPoints[1];
	var p2 = new clsPoint(point.anchor[0], point.anchor[1]);
	var ang = p2.angle(p1);
	//Debug: draw the outline of the band
	point = p2.polar(ang + hpi, amplitude)
	var r = new clsRectangle(point.x, point.y, p1.distance(p2), 2 * amplitude, ang);
	r.draw();
	d = p1.distance(p2) / frequency;
	var h;
	var w;
	var lt;
	var rect;
	/*
	for(var i = 0; i < frequency; i++) {
		point = p1.polar(ang, d * i);
		h = getRandomNumber(0.75,1.5) * size * amplitude;
		//Debug
		var ln = new clsLine(point, point.polar(ang - hpi, amplitude - h));
		ln.draw();
		lt = new clsShapeObject();
		w = h / lt.height * lt.width;
		point = point.polar(ang - hpi, getRandomNumber(0,1) * (amplitude - h));
		point = point.polar(ang, w /2);
		rect = new clsRectangle(point.x, point.y, w, h, ang - pi);
		rect.draw();
		lt.fit(rect);
	}*/
}

//var gOrigin = Origin();
gShapeTree = readXMLFile();
if(app.activeDocument.selection.length > 0) {
	var p = app.activeDocument.selection[0];
	var lb = new clsLetterBand(p, 10, 50, 0.5);
}
//gOrigin.restore();