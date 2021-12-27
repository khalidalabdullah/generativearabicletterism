// Arabic Letterism
// Khalid M. Khalid
// September 2012

// Attempt in consistent area filling

#target illustrator
#include "./letterism-core(T).jsx"
#include "./DotMachine.jsx"

function clsScatterPoint(pnt, radius, size, density, rotation) {
var pos;
var crcl;
var rect;
var w;
var h;
var sh;
var ds = new clsDrawingStyle();

	//Debug
	//crcl = new clsCircle(pnt, 10);
	//crcl.draw();
	//ds.stroked = false;
	for(var i = 0; i < density; i++){
		pos = pnt.polar(getRandomNumber(0, 1) * twopi, getRandomNumber(0.3,0.5) * radius);
		//Debug
		//crcl = new clsCircle(pos, 10);
		//crcl.draw();
		sh = new clsShapeObject();
		var f = getRandomNumber(0.3, 1) * radius * size;
		if(sh.width > sh.height) {
			w = f;
			h = sh.height * f / sh.width;
			ds.strokeWidth = w / 100;
		}
		else {
			w = sh.width * f/sh.height;
			h = f;
			ds.strokeWidth = h / 100;
		}
		rect = new clsRectangle(pos.x - (w / 2), pos.y + (h / 2), w, h);
		if(rotation != 0) rect.rotate(rotation, 0);
		//Debug
		//rect.draw();
		ds.fillColor = gColorScheme.getIndexedColor(getRandomInt(0, gColorScheme.palette.length));
		ds.fillOpacity = 80;
		sh.fit(rect, ds, 0);
	}

}


var gOrigin = Origin();
gShapeTree = readXMLFile();
gColorScheme = new clsColorScheme();
gColorScheme.getAiPalette("palooza");
var pnt = new clsPoint(550, 400);
var sp = new clsScatterPoint(pnt, 150, 7, 7, 0);


// Debug
//var rect = new clsRectangle(100,600, 300,400);
//var sh = new clsShapeObject();
//rect.draw();
//rect.rotate(-Math.PI / 4, 0);
//rect.draw();
//sh.fit(rect, false, 0);
gOrigin.restore();
