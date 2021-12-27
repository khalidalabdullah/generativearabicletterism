// Arabic Letterism
// Khalid M. Khalid
// October 2012

// Scattering letters about a straight line

#target illustrator
#include "./letterism-core(T).jsx"
#include "./DotMachine.jsx"

function clsLetterBandFlat (fitpath, frequency, amplitude, size, density, dstyle) {
	var point = fitpath.pathPoints[0];
	var p1 = new clsPoint(point.anchor[0], point.anchor[1]);
	point = fitpath.pathPoints[1];
	var p2 = new clsPoint(point.anchor[0], point.anchor[1]);
	var d = p1.distance(p2) / frequency;
	var h;
	var w;
	var lt;
	var dt;
	var rect;
	// Todo: solve setup drawing style from within vs from outside
	var ds = new clsDrawingStyle();
	ds.fillOpacity = 60;
	ds.stroked = false;
	ds.filled - true;
	var top = p1.y + amplitude;
	for(var i = 0; i < frequency; i++) {
		for (var j = 0; j < density; j++){
			if(flipCoin(0.75)) { // 75% characters, rest dots
				h = getRandomNumber(0.75,1.5) * size * amplitude;
				//Debug
				///var ln = new clsLine(point, point.polar(ang - hpi, amplitude - h));
				//ln.draw();
				lt = new clsShapeObject();
				w = h / lt.height * lt.width;
				rect = new clsRectangle(p1.x - d * i - w / 2, top - getRandomNumber(0, 1) * (amplitude - h), w, h);
				//Debug
				//rect.draw();
				ds.fillColor = gColorScheme.getIndexedColor(getRandomInt(0, gColorScheme.palette.length));
				lt.fit(rect, ds);
			}
			else { // draw some dots
				h = getRandomNumber(0.1, 0.2) * size * amplitude;
				w = getRandomInt(5,10) * h;
				rect = new clsRectangle(p1.x - d * i - w / 2, top - getRandomNumber(0, 1) * (amplitude - h), w, h);
				ds.fillColor = gColorScheme.getIndexedColor(getRandomInt(0, gColorScheme.palette.length));
				dt = new clsDotMachine(rect, ds);
			}
				
		}
	}
}

var gOrigin = Origin();
gShapeTree = readXMLFile();
gColorScheme = new clsColorScheme();
gColorScheme.getAiPalette("purple");
if(app.activeDocument.selection.length > 0) {
	var p = app.activeDocument.selection[0];
	var lb = new clsLetterBandFlat(p, 20, 150, 0.5, 5);
}
gOrigin.restore();