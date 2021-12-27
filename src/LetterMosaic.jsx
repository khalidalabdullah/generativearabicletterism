// clsLetter Mosaic
// A letter Mosaic generator
// Khalid M. Khalid
// September 2012

#target illustrator
#include "./letterism-core.jsx"



function clsLetterMosaic () {

this.minHypo = 100;
this.colorScheme = new clsColorScheme();
this.colorScheme.getAiPalette("Renai");
var ds = new clsDrawingStyle();
ds.stroked = false;
var c = new CMYKColor();
c.cyan = 0; c.magenta = 0; c.yellow = 0; c.black = 0;
var dds = new clsDrawingStyle();
dds.fillColor = c;
dds.fillOpacity = 50;
dds.stroked = false;

this.rectFill = function (rect, dstyle) {

	if (rect.getHypotenuse() > this.minHypo) {
		var sh = new clsShapeObject();
		if (rect.height / rect.width > sh.height / sh.width) {
			var rscale = rect.width / sh.width * getRandomNumber(0.5, 0.8);
		}
		else {
			var rscale = rect.height / sh.height * getRandomNumber(0.5, 0.8);
		}
		var w = rscale * sh.width;
		var h = rscale * sh.height;
		var l = rect.left + getRandomNumber(0.4, 0.6) * (rect.width - w);
		var t = rect.top - getRandomNumber(0.4, 0.6) * (rect.height - h);
		var r2 = new clsRectangle(l, t, w, h);
		ds.fillColor = this.colorScheme.palette[getRandomInt(0, this.colorScheme.palette.length - 1)].color;
		r2.draw(ds);
		ds.fillColor = c;
		sh.fit(r2, ds);
		var rects = rect.subdivide(r2);
		for(var i = 0; i < rects.length; i++) {
			this.rectFill(rects[i]);
		}
	}
	else {
		ds.fillColor = this.colorScheme.palette[getRandomInt(0, this.colorScheme.palette.length - 1)].color;
		rect.draw(ds);
		//var sh = new clsShapeObject();
		//sh.fit(rect, ds);
		var dm = new clsDotMachine(rect, dds);
	}
}

var w = app.activeDocument.width;
var h = app.activeDocument.height;

gShapeTree = readXMLFile();

var rect = new clsRectangle(0, 0+h, w, h);
this.rectFill(rect);

}

var ma = new clsLetterMosaic();
/*
var r = new clsRectangle(100,700,400,100);
var ds = new clsDrawingStyle();
var c = new CMYKColor();
c.cyan = 0; c.magenta = 0; c.yellow = 0; c.black = 100;
ds.fillColor = c;
var dm = new clsDotMachine(r, ds);
*/