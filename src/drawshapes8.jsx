// Shape Loading and Drawing
// Khalid M. Khalid
// January 2012

// September 2012: Rectangle object revised to set anchor point left,top instead of left,bottom. Whole programme revised to follow the same logic

///////////// Global Variables ////////////////
var gShapeTree;
var gShapesFile = "C:/shapesdef.xml"
var gColorScheme;

// Global Constants
var HYPOLIMIT = 5; // Minimum hypotenuse size for rectangles in area filling program

////////////// Test Pad /////////////
function main(){
	
//	var w = app.activeDocument.width;
//	var h = app.activeDocument.height;
//	var drect = new clsRectangle(0,0,w,h);
//	fillRectArea(drect);
	
/*
	// Let's draw some rectangles
	var maxdim = (w > h ? h : w) / 3.0; // Restricts the dimension of any side of the rectangle to 1/3 of the art board's height
	
	for(var i = 0; i < 100; i++){
		var rectw = getRandomNumber(0.5, 1) * maxdim;
		var recth = getRandomNumber(0.5, 1) * maxdim;
		// Fit location of the rectangel within the art board
		var x = getRandomNumber(0, 1) * (w - rectw);
		var y = getRandomNumber(0,1) * (h - recth);
		var drect = new clsRectangle (x, y, rectw, recth);
		// Color setup
        var clr = new RGBColor();
        clr.red = getRandomInt(1,255); clr.blue =getRandomInt(1,255); clr.green =getRandomInt(1,255);
        var sclr = new RGBColor();
        sclr.red = getRandomInt(1,255); sclr.blue =getRandomInt(1,255); sclr.green =getRandomInt(1,255);
        var sw = getRandomNumber(1,5);
        var op = getRandomInt(50,70);
        var so = getRandomInt(70,90);
        var ds = new clsDrawingStyle (true, clr,true,sclr, sw,op,so);
		drect.draw(ds);
	}
*/

	gShapeTree = readXMLFile();
//	var sh = new clsShapeObject();
//	var rects = sh.getSubrects();
//	for(var i = 0; i < rects.length; i++) {
//		rects[i].draw();
//	}
	

	// filling a rectangle with letters, 22aug2012, (it is letterism after all)
	var fr = new clsRectangle(100,700,200,400, 45);
	fr.draw();
	var sh = new clsShapeObject();
	sh.fit(fr, 2, 3, true);
	
	
	
//	var tr = new clsTransformation (100,100,50,50);
//	sh.drawGlyphs(tr);
//	var rects = sh.getSubrects(tr);
//	for (var i = 0; i < rects.length; i++){
//		rects[i].draw();
//	}
	

//	var tr = new clsTransformation();
//	sh.drawGlyphs(tr);

/*	tr = new clsTransformation();
	var xpos; 
	var ypos;
	var dscale;
	
	
	for(var i = 0; i < 10; i++){
		sh = new clsShapeObject();
		tr.dx = getRandomNumber (0, w) - sh.x;
		tr.dy = getRandomNumber (0, h) - sh.y;
		//$.writeln(tr.dx + "," + tr.dy);
		sh.drawGlyphs(tr);
	}

*/

}

function areaFill () {
	var w = app.activeDocument.width;
	var h = app.activeDocument.height;
	
	var ABRect = new clsRectangle (0, 0, w, h);
	var rw = getRandomNumber(0.3, 0.6) * w;
	var rh = getRandomNumber(0.3, 0.6) * h;
	var rl = getRandomNumber(0, 1) * (w - rw);
	var rb = getRandomNumber(0,1) * (h - rh);
	// Setup and draw a rectangle in middle
	var drect = new clsRectangle(rl,rb,rw,rh);
	var clr = new RGBColor();
     clr.red = getRandomInt(1,255); clr.blue =getRandomInt(1,255); clr.green =getRandomInt(1,255);
     var sclr = new RGBColor();
     sclr.red = getRandomInt(1,255); sclr.blue =getRandomInt(1,255); sclr.green =getRandomInt(1,255);
     var sw = getRandomNumber(1,5);
     var op = 100;
     var so = getRandomInt(70,90);
     var ds = new clsDrawingStyle (true, clr,false,sclr, sw,op,so);
	drect.draw(ds);
	var rarray = ABRect.subdivide(drect);
	for(var i = 0; i < rarray.length; i++){
		var clr = new RGBColor();
		clr.red = getRandomInt(1,255); clr.blue =getRandomInt(1,255); clr.green =getRandomInt(1,255);
		var sclr = new RGBColor();
		sclr.red = getRandomInt(1,255); sclr.blue =getRandomInt(1,255); sclr.green =getRandomInt(1,255);
		var sw = getRandomNumber(1,5);
		var op = 100;
		var so = getRandomInt(70,90);
		var ds = new clsDrawingStyle (true, clr,false,sclr, sw,op,so);
		rarray[i].draw(ds);
	}

}

// fillRectArea(rect): recursive function that fills a rectangular area with colored rectangels. The rect paramter is a clsRectangle object representing the area to be filled.
function fillRectArea (rect) {
	// If rect hypotenuse is smaller than the set hypotenuse limit then draw it and return. This stops the recursion
	if (rect.getHypotenuse() < HYPOLIMIT) {
		var clr = new RGBColor();
		 clr.red = getRandomInt(1,255); clr.blue =getRandomInt(1,255); clr.green =getRandomInt(1,255);
		 var sclr = new RGBColor();
		 sclr.red = getRandomInt(1,255); sclr.blue =getRandomInt(1,255); sclr.green =getRandomInt(1,255);
		 var sw = getRandomNumber(1,5);
		 var op = 100;
		 var so = getRandomInt(70,90);
		 var ds = new clsDrawingStyle (true, clr,false,sclr, sw,op,so);
		rect.draw(ds);
		return;
	}
	// Setup  and draw the middle rectangle
	var mw = getRandomNumber(0.1, 0.5) * rect.width;
	var mh = getRandomNumber(0.1, 0.5) * rect.height;
	var ml = rect.left + getRandomNumber(0, 1) * (rect.width - mw);
	var mb = rect.bottom + getRandomNumber(0,1) * (rect.height - mh);
	var drect = new clsRectangle(ml,mb,mw,mh);
	var clr = new RGBColor();
     clr.red = getRandomInt(1,255); clr.blue =getRandomInt(1,255); clr.green =getRandomInt(1,255);
     var sclr = new RGBColor();
     sclr.red = getRandomInt(1,255); sclr.blue =getRandomInt(1,255); sclr.green =getRandomInt(1,255);
     var sw = getRandomNumber(1,5);
     var op = getRandomInt(50,70);
     var so = getRandomInt(70,90);
     var ds = new clsDrawingStyle (true, clr,false,sclr, sw,op,so);
	drect.draw(ds);
	// Subdivide the passed rectangle and recurse
	var rarray = rect.subdivide(drect);
	for(var i = 0; i < rarray.length; i++){
		fillRectArea(rarray[i]);
	}
	
}

///////////////////////////// Art: Astrolabe 1 ///////////////////
function astrolabe(){
	var om = new clsCircle(new clsPoint(590,440));
	om.draw();
	var conaxis = new clsLine(new clsPoint(590, 500), new clsPoint(590,800));
	conaxis.draw();
	var org = new clsPoint(590,440);
	for(i = 0; i < 10; i++) {
		conaxis.startPoint.rotate(org, Math.PI / 10);
		conaxis.endPoint.rotate(org, Math.PI / 10);
		conaxis.draw();
	}
}

function clsFrond(origin, angle, fan, stem, frond, leaves) {

this.origin = (typeof(arguments[0]) == 'undefined') ? new clsPoint(500, 400) : arguments[0];
this.frondAngle =  (typeof(arguments[1]) == 'undefined') ? 0 : arguments[1];
this.fanAngle = (typeof(arguments[2]) == 'undefined') ? Math.PI / 12 : arguments[2];
this.stemLength = (typeof(arguments[3]) == 'undefined') ? 150 : arguments[3];
this.frondLength = (typeof(arguments[4]) == 'undefined') ? 200 : arguments[4];
this.nLeaves =  (typeof(arguments[5]) == 'undefined') ? 75 : arguments[5];
// Todo: following functions need to be placed elswhere at higher level
gShapeTree = readXMLFile();
gColorScheme = new clsColorScheme;
gColorScheme.getAiPalette("Baroque 1");
var ds = new clsDrawingStyle();
ds.fillOpacity = 80;
ds.stroked = false;
for (var i = 0; i < this.nLeaves; i++) {
	var rect = new clsRectangle();
	var tlen = this.stemLength + getRandomNumber(0, 1) * this.frondLength;
	var arc = 2 * tlen * Math.sin(this.fanAngle / 2);
	rect.height = getRandomNumber(0.3, 0.5) * arc;
	arc = 2 * (tlen - rect.height) * Math.sin(this.fanAngle / 2);
	rect.width = getRandomNumber(0.3, 0.5) * arc;
	var cenang = Math.atan((rect.width / 2) / tlen) * 0.8;
	var p = this.origin.polar(getRandomNumber(0,1) * (this.fanAngle - cenang) + (this.frondAngle - this.fanAngle / 2), tlen);
	rect.left =  p.x;
	rect.top = p.y;
	rect.rotation = p.angle(this.origin) + Math.PI / 2;
	//rect.draw();
	var sh = new clsShapeObject();
	ds.fillColor = gColorScheme.getIndexedColor(getRandomInt(0, gColorScheme.palette.length));
	sh.fit(rect, ds, 3, false);
}

this.draw = function () {
	var p = new clsCircle(this.origin);
	p.draw();
	var p1 = this.origin.polar(this.frondAngle - this.fanAngle / 2, this.stemLength + this.frondLength);
	p = new clsCircle(p1);
	p.draw();
	var p2 = this.origin.polar(this.frondAngle + this.fanAngle / 2, this.stemLength + this.frondLength);
	p = new clsCircle(p2);
	p.draw();
	var ln = new clsLine(this.origin, p1);
	ln.draw();
	ln = new clsLine(p1, p2);
	ln.draw();
	ln = new clsLine(p2, this.origin);
	ln.draw();
}

this.dump = function () {

$.writeln("Origin: " + this.origin.x + "," + this.origin.y);
$.writeln("Angle: " + this.frondAngle);
$.writeln("Fan Angle: " + this.fanAngle);
$.writeln("Stem Length: " + this.stemLength);
$.writeln("Frond Length: " + this.frondLength);
$.writeln("Number of Leaves: " + this.nLeaves);

}

} // End of clsFrond constructor

for (var ang = 0; ang < Math.PI; ang+= Math.PI / 6) {
	f = new clsFrond(new clsPoint(500,400), ang, Math.PI / 6);
}

function testB() {
	var pi = Math.PI;
	var hpi = pi / 2;
    var sel = app.activeDocument.selection;
    var path = sel[0]
    for(var i = 0; i < path.pathPoints.length - 1; i++) {
        var point = path.pathPoints[i];
		var c1 = new clsPoint(point.anchor[0], point.anchor[1]);
		var c2 = new clsPoint(point.rightDirection[0], point.rightDirection[1]);
		point = path.pathPoints[i + 1];
		var c3 = new clsPoint(point.leftDirection[0], point.leftDirection[1]);
		var c4 = new clsPoint(point.anchor[0], point.anchor[1]);
		var pArray1 = new Array();
		var pArray2 = new Array()
		for (i = 0; i < 1; i = i + 0.1){
			var p1 = getBezier(i, c1, c2, c3, c4);
			var p2 = getBezier(i + 0.1, c1, c2, c3, c4);
			var ang = p1.angle(p2) - hpi;
			var d = 100 * Math.sin(i * hpi)
			//$.writeln(ang);
			var p = p1.polar(ang, d);
			var c = new clsLine(p1, p);
			c.draw();
			pArray1.push(Array(p.x, p.y));
			p = p1.polar(ang + pi, d);
			var c = new clsLine(p1, p);
			c.draw();
			pArray2.push(Array(p.x, p.y));
		}
		pArray1.reverse();
		pArray2.reverse();
		var line = app.activeDocument.pathItems.add();
		line.setEntirePath(pArray1);
		var line = app.activeDocument.pathItems.add();
		line.setEntirePath(pArray2);
	}

}

/////////// Test Area ///////////
//main();
//testing();
//areaFill();
//astrolabe();
//////////////////////////////////////////////// OBJECTS /////////////////////////////////////////////////////////////

function clsShapeObject(shapetype, aspect, shapecode) {
this.x;
this.y;
this.width;
this.height;
this.aspect;
this.shapereference; // points to the shape data in the XML tree

/* The shape object is constructed with a shape from shapes XML tree
Takes two arguments:
	shapetype [optional]: could be "letter", "symbol", "number". If not provided the default will be a letter
	aspect [optional]: searches for the closest aspect ratio of letter shapes in the XML tree
	shapecode [optional]: whill fetch a shape with the specific. aspect value of 0 triggers this search
*/

var shptyp;
switch(arguments[0]){
	case "symbol":
		shptyp = gShapeTree.symbol.shape
		break;
	case "number":
		shptyp = gShapeTree.number.shape
		break;
	default:
		shptyp = gShapeTree.letter.shape;
		break;
}
// Set the reference to the required shape in the shape tree
if(typeof(arguments[1]) == 'undefined'){
	// any aspect will do
	var shpmax =shptyp.length();
	if(shpmax > 0){
		this.shapereference = shptyp.child(getRandomInt (0, shpmax - 1));
		this.height = parseFloat(this.shapereference.glyphs.glyph[0].@height);
		this.width = parseFloat(this.shapereference.glyphs.glyph[0].@width);
		this.aspect = parseFloat(this.shapereference.glyphs.glyph[0].@aspect);
		this.x = parseFloat(this.shapereference.glyphs.glyph[0].@x);
		this.y =  parseFloat(this.shapereference.glyphs.glyph[0].@y);
		//debug
		//$.writeln(this.shapereference.toString());
	}
}
else {
	// search for a shape with the closest match
	
}

/*if(typeof (arguments[0]) == 'undefined') {
	// defaults to a letter of any aspect
	
}
else {
	var shptyp;
	switch(arguments[0]){
		case "letter":
			shptyp = gShapeTree.letter;
			break;
		case "symbol":
			shptyp = gShapeTree.symbol
			break;
		case "number":
			shptyp = gShapeTree.number
			break;
		default:
			break;
	}
	if(typeof(arguments[1]) == 'undefined') {
		//
		
	}
}
*/

this.fit = function (rect, dstyle, fitmode, subfit) {
	// Validate that rect is an instance of a rectangle
	if(rect instanceof clsRectangle) {
		tr = new clsTransformation ();
		tr.dx = rect.left - this.x;
		tr.dy = rect.top - this.y;
		if(rect.height / rect.width > this.height / this.width) {
			tr.xscale = rect.width / this.width * 100;
			tr.yscale = tr.xscale;
			// Setup the returned rectangle: the one at the bottom
			var segment = this.height * tr.yscale / 100;
			var retrect = new clsRectangle(rect.left, rect.top - segment, rect.width, rect.height - segment);
		}
		else {
			tr.xscale = rect.height / this.height * 100;
			tr.yscale = tr.xscale;
			// Setup returned rectangle: the one on the right
			var segment = this.width * tr.xscale / 100;
			var retrect = new clsRectangle(rect.left + segment, rect.top, rect.width - segment, rect.height);
		}
		tr.rotation = rect.rotation / Math.PI * 180;
		this.drawGlyphs(tr, dstyle);
		// If subfit is true you will have to fill in the rectangles enclosed in the shape as well
		if(subfit == true) {
			var rects = this.getSubrects (tr);
			for (var i = 0; i < rects.length; i++) {
				var rect = rects[i];
				rect.draw();
				/*if (rect.getHypotenuse() > HYPOLIMIT) {
					var sh = sh = new clsShapeObject();
					sh.fit(rect, 2, 3, true);
				}*/
			}
		}	
	}
	return retrect;
}

this.getSubrects = function (tr) {
	var rects = new Array();
	for (var i = 0; i < this.shapereference.spaces.path.length(); i++) {
		var x1 = parseFloat(this.shapereference.spaces.path[i].point[0].@x);
		var y1 = parseFloat(this.shapereference.spaces.path[i].point[0].@y);
		var x2 = parseFloat(this.shapereference.spaces.path[i].point[1].@x);
		var y2 = parseFloat(this.shapereference.spaces.path[i].point[1].@y);
		var x3 = parseFloat(this.shapereference.spaces.path[i].point[2].@x);
		var y3 = parseFloat(this.shapereference.spaces.path[i].point[2].@y);
		var x4 = parseFloat(this.shapereference.spaces.path[i].point[3].@x);
		var y4 = parseFloat(this.shapereference.spaces.path[i].point[3].@y);
		var left = Math.min(x1, x2);
		var top = Math.max(y1, y3);
		var width = Math.max(x1, x2) - Math.min(x1, x2);
		var height = Math.max(y1, y3) - Math.min(y1, y3);
		var rect = new clsRectangle(left, top, width, height);
		rects.push(rect)
	}
	// Apply transformations, if any...
	if (typeof(arguments[0]) != 'undefined') {
		if (tr instanceof clsTransformation) {
			var ox = this.x + tr.dx;
			var oy = this.y + tr.dy;
			var sx = tr.xscale / 100;
			var sy = tr.yscale / 100;
			for (var i = 0; i < rects.length; i ++) {
				rects[i].left = this.x + (rects[i].left - this.x) * sx + tr.dx;
				rects.[i].top = this.y + tr.dy - (this.y - rects[i].top) * sy;
				rects[i].width = rects[i].width * sx;
				rects[i].height = rects[i].height * sy;
				if(tr.rotation != 0){
					var r = tr.rotation / 180 * Math.PI;
					var x = Math.cos(r) * (rects[i].left - ox) - Math.sin(r) * (rects[i].top - oy) + ox;
					var y = Math.sin(r) * (rects[i].left - ox) + Math.cos(r) * (rects[i].top - oy) + oy;
					rects[i].left = x;
					rects[i].top = y;
					rects[i].rotation = tr.rotation;
				}
			}
		}
	}
	return rects;
}

this.drawGlyphs = function (trans, dstyle) {
	drawShape(this.shapereference.child("glyphs"), trans, dstyle);
}

this.drawGraphics = function (trans, dstyle) {
	drawShape(this.shapereference.child("graphics"), trans, dstyle);
}

} // End of clsShapeObject constructor

// clsColorScheme: reads a pallete and supplies colors for creating drawing styles in program routines
function clsColorScheme () {
// Intialize palette
var fgColor = new CMYKColor();
fgColor.black = 0;
fgColor.cyan = 0;
fgColor.magenta = 0;
fgColor.yellow = 0;

var mgColor = new CMYKColor();
mgColor.black = 50;
mgColor.cyan = 0;
mgColor.magenta = 0;
mgColor.yellow = 0;

var bgColor = new CMYKColor();
fgColor.black = 100;
fgColor.cyan = 0;
fgColor.magenta = 0;
fgColor.yellow = 0;

this.aiPaletteName;
this.palette = Array(fgColor, mgColor, bgColor);
this.colorWeights = Array(0, 0.25, 0.5, 1);

this.getWeightedColor = function () {
	var rn = getRandomNumber(0,1);
	for(i = 0; i < this.colorWeights.length - 1; i++){
		if(rn >= this.colorWeights[i] && rn < this.colorWeights[i + 1]) {
			return this.palette[i];
		}
	}
}

this.getColor = function () {
	return this.getWeightedColor();
}

this.getIndexedColor = function (index) {
	if(index < this.palette.length) {
		return this.palette[index].color;
	}
	else {
		return this.palette[0].color;
	}
}

this.getAiPalette = function (name) {
	var sw = app.activeDocument.swatchGroups;
	for(var i = 0; i < sw.length; i++){
		if(sw[i].name == name){
			this.palette = sw[i].getAllSwatches();
			return;
		}
	}
}

} // End of clsColorScheme object

function testCS() {
	var cs = new clsColorScheme();
	
	var line = app.activeDocument.activeLayer.pathItems.rectangle(400, 100, 100, 100);
	var l2 = line.duplicate();
	l2.stroked = false;
	
}



function clsDrawingStyle() {
// Arguments list:
fcolor = new RGBColor();
fcolor.red = 255; fcolor.gree = 255; fcolor.blue = 255;
scolor = new RGBColor();
scolor.red = 0; scolor.green = 0; scolor.blue = 0;
this.filled = (typeof(arguments[0]) == 'undefined') ? true : arguments[0];
this.fillColor = (typeof(arguments[1]) == 'undefined') ? fcolor : arguments[1];
this.stroked = (typeof(arguments[2]) == 'undefined') ? true : arguments[2];
this.strokeColor = (typeof(arguments[3]) == 'undefined') ? scolor : arguments[3];
this.strokeWidth = (typeof(arguments[4]) == 'undefined') ? 1 : arguments[4];
this.fillOpacity = (typeof(arguments[5]) == 'undefined') ? 100 : arguments[5];
this.strokeOpacity = (typeof(arguments[6]) == 'undefined') ? 100 : arguments[6];

} // End of ColorStyle constructor

function clsTransformation () {
// Arguments: dx relative horizontal movement, dy position relative vertical movement, x scale, y scale, rotation

this.dx = (typeof(arguments[0]) == 'undefined') ? 0 : arguments[0];
this.dy = (typeof(arguments[1]) == 'undefined') ? 0 : arguments[1];
this.xscale = (typeof(arguments[2]) == 'undefined') ? 100 : arguments[2];
this.yscale = (typeof(arguments[3]) == 'undefined') ? 100 : arguments[3];
this.rotation = (typeof(arguments[4]) == 'undefined') ? 0 : arguments[4];

} // End of clsTransformation constructor

function clsRectangle (left, top, width, height, rotation) {
	
this.left = (typeof(arguments[0]) == 'undefined') ? 0 : arguments[0];
this.top = (typeof(arguments[1]) == 'undefined') ? 0 : arguments[1];
this.width = (typeof(arguments[2]) == 'undefined') ? 100 : arguments[2];
this.height = (typeof(arguments[3]) == 'undefined') ? 100 : arguments[3];
this.rotation = (typeof(arguments[4]) == 'undefined') ? 0 : arguments[4];

this.draw = function (dstyle) {
	var line = app.activeDocument.activeLayer.pathItems.rectangle(this.top, this.left, this.width, this.height);
	if(this.rotation != 0) line.rotate(this.rotation / Math.PI * 180, true, true, true, true, Transformation.TOPLEFT);
	if(dstyle instanceof clsDrawingStyle){
		if(dstyle.filled){
			line.filled = true;
			line.fillColor = dstyle.fillColor;
			 line.opacity = dstyle.fillOpacity;
		}
		if(dstyle.stroked){
			var oline = app.activeDocument.activeLayer.pathItems.rectangle(this.top, this.left, this.width, this.height);
			if(this.rotation != 0) oline.rotate(this.rotation / Math.PI * 180, true, true, true, true, Transformation.TOPLEFT);
			oline.filled = false;
			oline.strokeWidth = dstyle.strokeWidth;
			oline.stroked = true;
			oline.strokeColor = dstyle.strokeColor;
			oline.opacity = dstyle.strokeOpacity;
		}
	}
}

this.centerPoint = function () {
    return Array (this.left + this.width / 2, this.top - this.height / 2);
}

this.subdivide = function (subrect){
	// Make sure that passed parameter is a rectangle instance
    if(subrect instanceof clsRectangle){
        var x1 = this.left;
        var x2 = subrect.left;
        var x3 = subrect.left + subrect.width;
        var x4 = this.left + this.width;
        var y1 = this.top;
        var y2 = subrect.top;
        var y3 = subrect.top - subrect.height;
        var y4 = this.top - this.height;
        var rects = new Array(8);
        rects[0] = new clsRectangle(x1, y3, x2 - x1, y3 - y4);
        rects[1] = new clsRectangle(x2, y3, x3 - x2, y3 - y4);
        rects[2] = new clsRectangle(x3, y3, x4 - x3, y3 - y4);
        rects[3] = new clsRectangle(x1, y2, x2 - x1, y2 - y3);
        rects[4] = new clsRectangle(x3, y2, x4 - x3, y2 - y3);
        rects[5] = new clsRectangle(x1, y1, x2 - x1, y1 - y2);
        rects[6] = new clsRectangle(x2, y1, x3 - x2, y1 - y2);
        rects[7] = new clsRectangle(x3, y1, x4 - x3, y1 - y2);
        return rects;
    }
    else{
        return 'undefined';
    }

}

this.movescale = function (xsh, ysh, scl) {
	this.left = this.left + xsh;
	this.top = this.top + ysh;
	this.width = this.width * scl;
	this.height = this.height * scl;
}

this.getHypotenuse = function () {
    return Math.sqrt(this.width * this.width + this.height * this.height);
}

} // End of clsRectangle constructor

function clsPoint (x, y) {

this.x = (typeof(arguments[0]) == 'undefined') ? 0 : arguments[0];
this.y = (typeof(arguments[1]) == 'undefined') ? 0 : arguments[1];

this.pointArray = function () {
	return Array(this.x, this.y);
}

this.polar = function (angle, distance) {
	var x = this.x + distance * Math.cos(angle);
	var y = this.y + distance * Math.sin(angle);
	return new clsPoint(x , y);
}

// angle = returns the angle formed by line between this point and the passed point (p2)
this.angle = function(p2) {
	if(p2 instanceof clsPoint) {
		var dx = p2.x - this.x;
		var dy = p2.y - this.y;
		return Math.atan(dy / dx);
	}
}

// distance: returns the distance between point passed (p2) and this point
this.distance = function (p2) {
	var dx = p2.x - this.x;
	var dy = p2.y - this.y;
	return Math.sqrt(dx * dx + dy * dy);
}

// rotate: rotates this point about the passed point (originpoint) by amount (angle)
this.rotate = function (originpoint, angle) {
	var x = Math.cos(angle) * (this.x - originpoint.x) - Math.sin(angle) * (this.y - originpoint.y) + originpoint.x;
	var y = Math.sin(angle) * (this.x - originpoint.x) + Math.cos(angle) * (this.y - originpoint.y) + originpoint.y;
	this.x = x;
	this.y = y;
}

} // End of clsPoint constructor

function clsLine(startpoint, endpoint) {

this.startPoint = (typeof(arguments[0]) == 'undefined') ? new clsPoint() : startpoint;
this.endPoint =(typeof(arguments[1]) == 'undefined') ? new clsPoint(0 , 10) : endpoint;
var dx = this.endPoint[0] - this.startPoint[0];
var dy = this.endPoint[1] - this.startPoint[1];
this.length = Math.sqrt(dx * dx + dy * dy);
this.slope = dy / dx;
this.top = Math.max(this.startPoint.y, this.endPoint.y);
this.left = Math.min(this.startPoint.x, this.endPoint.x);
this.width = Math.abs(this.startPoint.x - this.endPoint.x);
this.height = Math.abs(this.startPoint.y - this.endPoint.y);

this.draw = function (drawstyle) {
	var lp = app.activeDocument.pathItems.add();
	var sp = lp.pathPoints.add();
	sp.anchor = Array(this.startPoint.x, this.startPoint.y);
	sp.leftDirection = sp.anchor;
	sp.rightDirection = sp.anchor;
	sp.pointType = PointType.CORNER;
	var ep = lp.pathPoints.add();
	ep.anchor = Array(this.endPoint.x, this.endPoint.y);
	ep.leftDirection = ep.anchor;
	ep.rightDirection = ep.anchor;
	ep.pointType = PointType.CORNER;
	}
} // End of clsLine constructor

function clsCircle(center, diameter) {

this.center = (typeof(arguments[0]) == 'undefined') ? new clsPoint() : center;
this.diameter = (typeof(arguments[1]) == 'undefined') ? 10 : diameter;
this.radius = this.diameter / 2;
this.left = this.center.x - this.radius;
this.top = this.center.y + this.radius;
this.width = this.diameter;
this.height = this.diameter;

// arc = returns the length of an arc subtended by angle theta
this.arc = function (theta) {
	return 2 * this.radius * sin(theta / 2);
}

this.draw = function () {
	var d = this.diameter * 0.27614257812;
	var cp = app.activeDocument.pathItems.add();
	var p1 = cp.pathPoints.add()
	p1.anchor = Array(this.center.x + this.radius, this.center.y);
	p1.leftDirection = Array(p1.anchor[0], p1.anchor[1] -d);
	p1.rightDirection = Array(p1.anchor[0], p1.anchor[1] +d);
	p1.pointType = PointType.SMOOTH;
	var p2 = cp.pathPoints.add()
	p2.anchor = Array(this.center.x, this.center.y + this.radius);
	p2.leftDirection = Array(p2.anchor[0] +d, p2.anchor[1]);
	p2.rightDirection = Array(p2.anchor[0] - d, p2.anchor[1]);
	p2.pointType = PointType.SMOOTH;
	var p3 = cp.pathPoints.add()
	p3.anchor = Array(this.center.x - this.radius, this.center.y);
	p3.leftDirection = Array(p3.anchor[0], p3.anchor[1] +d);
	p3.rightDirection = Array(p3.anchor[0], p3.anchor[1] - d);
	p3.pointType = PointType.SMOOTH;
	var p4 = cp.pathPoints.add()
	p4.anchor = Array(this.center.x, this.center.y - this.radius); 
	p4.leftDirection = Array(p4.anchor[0] - d, p4.anchor[1]);
	p4.rightDirection = Array(p4.anchor[0] + d, p4.anchor[1]);
	p4.pointType = PointType.CORNER;
	cp.closed = true;
}

} // End of clsCircle constructor

//////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////

function drawShape(gphs, trans, dstyle){

	for (var j = 0; j < gphs.elements().length(); j++){
		var gph = gphs.child(j);
		if (gph.elements().length() > 1){
			drawCompoundPath (gph, trans, dstyle);
		}
		else {
			drawPath(gph.child(0), trans, dstyle);
		}
	}

}
			
function drawPath(pathxml, trans, dstyle){
if (!(pathxml instanceof XML)){
	throw "Bad XML parameter";
}
	var doc = app.activeDocument;
	var line = doc.pathItems.add();
	var pointxml;
	
	for(var i = 0; i < pathxml.elements().length(); i++){
		pointxml = pathxml.child(i);
		var point = line.pathPoints.add();
		point.anchor = Array(parseFloat(pointxml.attribute("x").toString()) , parseFloat(pointxml.attribute("y").toString()));
		point.rightDirection = Array(parseFloat(pointxml.attribute("rdx").toString()) , parseFloat(pointxml.attribute("rdy").toString()));
		point.leftDirection = Array(parseFloat(pointxml.attribute("ldx").toString()) , parseFloat(pointxml.attribute("ldy").toString()));
		var pt = pointxml.attribute("type").toString();
		switch(pt){
			case "PointType.SMOOTH": point.pointType = PointType.SMOOTH; break;
			case "PointType.CORNER": point.pointType = PointType.CORNER; break;
		}
	}
	if (pathxml.attribute("closed").toString() == "true") {
		line.closed = true;
	}

	// Apply transformations
	line.translate(trans.dx, trans.dy);
	line.resize(trans.xscale, trans.yscale,true,true,true,true,trans.xscale,Transformation.TOPLEFT);
	line.rotate(trans.rotation, true, true, true, true, Transformation.TOPLEFT);

	// Apply drawing style
	if(dstyle instanceof clsDrawingStyle){
		if(dstyle.filled){
			line.filled = true;
			line.fillColor = dstyle.fillColor;
			line.opacity = dstyle.fillOpacity;
			line.stroked = false;
		}
		if(dstyle.stroked){
			var oline = line.duplicate();
			oline.filled = false;
			oline.strokeWidth = dstyle.strokeWidth;
			oline.stroked = true;
			oline.strokeColor = dstyle.strokeColor;
			oline.opacity = dstyle.strokeOpacity;
		}
	}

}

function drawCompoundPath(cpathxml, trans, dstyle){
if (!(cpathxml instanceof XML)){
	throw "Bad XML parameter";
}
	var compoundPath = app.activeDocument.activeLayer.compoundPathItems.add();
	for (var i = 0; i < cpathxml.elements().length(); i++){
		var line = compoundPath.pathItems.add();
		var pathxml = cpathxml.elements().child(i);
		for(var j = 0; j < pathxml.elements().length(); j++){
			var pointxml = pathxml.child(j);
			var point = line.pathPoints.add();
			point.anchor = Array(parseFloat(pointxml.attribute("x").toString()) , parseFloat(pointxml.attribute("y").toString()));
			point.rightDirection = Array(parseFloat(pointxml.attribute("rdx").toString()) , parseFloat(pointxml.attribute("rdy").toString()));
			point.leftDirection = Array(parseFloat(pointxml.attribute("ldx").toString()) , parseFloat(pointxml.attribute("ldy").toString()));
			var pt = pointxml.attribute("type").toString();
			switch(pt){
				case "PointType.SMOOTH": point.pointType = PointType.SMOOTH; break;
				case "PointType.CORNER": point.pointType = PointType.CORNER; break;
			}
		
		}
		if (pathxml.attribute("closed").toString() == "true") {
			line.closed = true;
		}
	
	}
		
	// Apply transformations
	compoundPath.translate(trans.dx, trans.dy);
	compoundPath.resize(trans.xscale, trans.yscale,true,true,true,true,trans.xscale,Transformation.TOPLEFT);
	compoundPath.rotate(trans.rotation, true, true, true, true, Transformation.TOPLEFT);

	// Apply drawing style
	if(dstyle instanceof clsDrawingStyle){
		if(dstyle.filled){
			line.filled = true;
			line.fillColor = dstyle.fillColor;
			line.opacity = dstyle.fillOpacity;
			line.stroked = false;
		}
		if(dstyle.stroked){
			var oline = line.duplicate();
			oline.filled = false;
			oline.strokeWidth = dstyle.strokeWidth;
			oline.stroked = true;
			oline.strokeColor = dstyle.strokeColor;
			oline.opacity = dstyle.strokeOpacity;
		}
	}

}
	
function readXMLFile() {
	
	var sfile = new File(gShapesFile);
	if (!sfile.exists) {
		throw "Cannot find file: " + deodeURI(sfile.absoluteURI);
	}

	sfile.encoding = "UTF8";
	sfile.lineFeed = "unix";
	sfile.open("r", "TEXT", "????");
	var str = sfile.read();
	sfile.close();

	return new XML(str);
};

/////////////// UTILITY FUNCTIONS /////////////////////////
//Returns a random number between min and max 
function getRandomNumber(min, max) {return Math.random() * (max - min) + min; } 
//Returns a random integer between min and max  * Using Math.round() will give you a non-uniform distribution! 
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; } 

////// Bezier Utility Functions
function B1(t) { return t*t*t }
function B2(t) { return 3*t*t*(1-t) }
function B3(t) { return 3*t*(1-t)*(1-t) }
function B4(t) { return (1-t)*(1-t)*(1-t) }

function getBezier(percent,C1,C2,C3,C4) {
  var pos = new clsPoint();
  pos.x = C1.x*B1(percent) + C2.x*B2(percent) + C3.x*B3(percent) + C4.x*B4(percent);
  pos.y = C1.y*B1(percent) + C2.y*B2(percent) + C3.y*B3(percent) + C4.y*B4(percent);
  return pos;
}

