// Arabic Letterism - Geometric Backgrounds
// Khalid M. Khalid
// December 2012

// Colored circles test

#target illustrator
#include "./letterism-core(T).jsx"
#include "./DotMachine.jsx"

function clsConcentricCircles(center, diameter, layers, colorSchemeName) {

this.center = (typeof(arguments[0]) == 'undefined') ? new clsPoint(500, 400) : arguments[0];
this.diameter = (typeof(arguments[1]) == 'undefined') ? 800 : arguments[1];
this.layers = (typeof(arguments[2]) == 'undefined') ? 5 : arguments[2];
this.colorSchemeName = (typeof(arguments[3]) == 'undefined') ? "" : arguments[3];

gColorScheme = new clsColorScheme();
gColorScheme.getAiPalette(this.colorSchemeName);
	var ds = new clsDrawingStyle();
	ds.stroked = false;
	//ds.fillOpacity = 70;
	var gs = numberSet(this.layers, 2, true);
	var attl = arrayTotal(gs);
	for(var i = 0; i < gs.length; i++){
		gs[i] = this.diameter * gs[i] / attl;
	}
	var d = this.diameter;
	for(var i = 0; i < gs.length; i++) {
		var c = new clsCircle(this.center, d);
		ds.fillColor = gColorScheme.getIndexedColor(getRandomInt(0, gColorScheme.palette.length));
		c.draw(ds);
		d -= gs[i];
	}
}

var gOrigin = Origin();

var cx;
var cy = 100;
var dx = 200;
var dy = 200;

for(var x = 0; x < 5; x++){
	cx = 100;
	for(var y = 0; y < 5; y++){
		var cc = new clsConcentricCircles(new clsPoint(cx, cy), 200, 7, "Rena");
		cx += dx;
	}
	cy += dy;
}

gOrigin.restore();

