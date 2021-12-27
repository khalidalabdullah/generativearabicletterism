// Arabic Letterism
// Khalid M. Khalid
// September 2012

// Scattering letters around an axis

#target illustrator
#include "./letterism-core(T).jsx"
#include "./scatterPoint.jsx"
#include "./arctest.jsx"

function rotateLetter(lettershape, w, h, centerpoint, radius, startangle, endangle, increment, dstyle) {
	var p = new clsPoint(0,0);
	var rect = new clsRectangle(0,0, w, h);
	//var h = lettershape.height * scale;
	var a = startangle;
	while(a <= endangle){
		p = centerpoint.polar(a, radius).polar(a + hpi, h / 2);
		//c.center = p;
		//c.draw();
		rect.left = p.x;
		rect.top = p.y;
		rect.rotation = a;
		//rect.draw();
		lettershape.fit(rect, ds);
		a += increment;
	}
	return w;
}

//********* Programme Execution starts here
// Setup
var gOrigin = Origin();
gShapeTree = readXMLFile();
gColorScheme = new clsColorScheme();
gColorScheme.getAiPalette("Baro");

// Draw the center for reference
var c = new clsCircle(new clsPoint(500,400), 10);
c.draw();

var slice;
var sa = 0;
var ea = 0;
var sh;
var r;
var r2;
var dr;
var steps;
var rinc;
var ds = new clsDrawingStyle();

while(ea < twopi) {
	sh = new clsShapeObject();
	slice = getRandomNumber(0.2, 1) * twopi / 10;
	ea = sa + slice;
	if(ea > twopi) ea = twopi;
	ds.fillColor = gColorScheme.getIndexedColor(getRandomInt(0, gColorScheme.palette.length));
	r = 300;
	r2 = 200 * getRandomNumber(0.8, 1.2);
	steps = getRandomInt(3, 5);
	var scale = sh.width / (r2 / steps);
	var h = sh.height * scale;
	var w = sh.width * scale;
	var dangle = Math.atan2(r, h);
	printf("Wedge: " + sa + "," + ea + "," + dangle);
	//rotateLetter(sh, w, h, new clsPoint(500,400), r, sa, ea, dangle, ds);
	sa = ea;
}

gOrigin.restore();
