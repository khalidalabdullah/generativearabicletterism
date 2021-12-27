

//////////// letterism-core.jsx: global variables
var gShapeTree;
var gShapesFile = "D:/shapesdef.xml"
var gColorScheme;

// Global Constants
var HYPOLIMIT = 10; // Minimum hypotenuse size for rectangles in area filling program
var pi = Math.PI;
var hpi = pi / 2;
var tqpi = pi * 1.5;
var twopi = pi * 2;

// Global Ai Variables
var gAiStroked = app.activeDocument.defaultStroked;
var gAiStrokeWidth = app.activeDocument.defaultStrokeWidth;
var gAiStrokeColor = app.activeDocument.defaultStrokColor;
var gAiFillColor = app.activeDocument.defaultFillColor;

////////////// letterism-core.jsx : core letterism classes and functions

function clsShapeObject(shapetype, aspect, shapecode) {
this.x;
this.y;
this.width;
this.height;
this.aspect;
this.shapereference; // points to the shape data in the XML tree
this.name;
this.idCode;

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
		this.name = this.shapereference.@name;
		this.idCode = this.shapereference.@code;
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
	var aa = Array();
	for(var i = 0; i < shptyp.length(); i++) {
		var g = shptyp.child(i);
		aa.push(Array(g.glyphs.glyph[0].@aspect, i));
	}
	aa.sort();
	var n = arguments[1];
	if(n <= aa[0,0]){
		this.shapereference = shptyp.child(aa[0,1]);
	}
	else {
		li = aa.length - 1;
		if (n >= aa[li, 0]) {
			this.shapereference = shptyp.child(aa[li, 1]);
		}
		else {
			for(var i = 0; i < li - 1; i++){
				if (n >= aa[i, 0] && arguments[1] < aa[i+1, 0]){
					if(n - aa[i, 0] < aa[i+1, 0] - n) {
						this.shapereference = shptyp.child(aa[i, 1]);
					}
					else {
						this.shapereference = shptype.child(aa[i+1, 1]);
					}
				}
			}
		}
	}
	this.height = parseFloat(this.shapereference.glyphs.glyph[0].@height);
	this.width = parseFloat(this.shapereference.glyphs.glyph[0].@width);
	this.aspect = parseFloat(this.shapereference.glyphs.glyph[0].@aspect);
	this.x = parseFloat(this.shapereference.glyphs.glyph[0].@x);
	this.y =  parseFloat(this.shapereference.glyphs.glyph[0].@y);
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
		switch (fitmode) {
			case 0:
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
					break;
			case 1:
					if(rect.height / rect.width > this.height / this.width) {
						tr.xscale = rect.width / this.width * 100;
						tr.yscale = tr.xscale;
						// Setup the returned rectangle: the one at the bottom
						var segment = this.height * tr.yscale / 100;
						tr.dy -= rect.height - segment;
						var retrect = new clsRectangle(rect.left, rect.top, rect.width, rect.height - segment);
					}
					else {
						tr.xscale = rect.height / this.height * 100;
						tr.yscale = tr.xscale;
						// Setup returned rectangle: the one on the right
						var segment = this.width * tr.xscale / 100;
						tr.dx += segment;
						var retrect = new clsRectangle(rect.left, rect.top, rect.width - segment, rect.height);
					}
					break;
			case 2:
					tr.xscale = rect.width / this.width * 100;
					tr.yscale = rect.height / this.height * 100;
					retrect = null;
					break;
			default:
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
					break;
		}
		tr.rotation = rect.rotation / Math.PI * 180;
		this.drawGlyphs(tr, dstyle);
		// If subfit is true you will have to fill in the rectangles enclosed in the shape as well
		if(subfit == true) {
			var rects = this.getSubrects (tr);
			for (var i = 0; i < rects.length; i++) {
				// Debug
				var rect = rects[i];
				rect.draw();
				/*if (rects[i].getHypotenuse() > HYPOLIMIT) {
					var sh = sh = new clsShapeObject();
					sh.fit(rects[i], dstyle, 2, true);
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
				rects[i].top = this.y + tr.dy - (this.y - rects[i].top) * sy;
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

this.getFocusArea = function() {
	var x1 = parseFloat(this.shapereference.focus.path.point[0].@x);
	var y1 = parseFloat(this.shapereference.focus.path.point[0].@y);
	var x2 = parseFloat(this.shapereference.focus.path.point[1].@x);
	var y2 = parseFloat(this.shapereference.focus.path.point[1].@y);
	var x3 = parseFloat(this.shapereference.focus.path.point[2].@x);
	var y3 = parseFloat(this.shapereference.focus.path.point[2].@y);
	var x4 = parseFloat(this.shapereference.focus.path.point[3].@x);
	var y4 = parseFloat(this.shapereference.focus.path.point[3].@y);
	var left = Math.min(x1, x2);
	var top = Math.max(y1, y3);
	var width = Math.max(x1, x2) - Math.min(x1, x2);
	var height = Math.max(y1, y3) - Math.min(y1, y3);
	return new clsRectangle(left, top, width, height);
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

this.rotate = function (angle, anchor) {
	switch (anchor) {
		case 0: // rotation about the centre of the rectangle
			var x = this.left + (this.width / 2);
			var y = this.top - (this.height / 2);
			this.left = x + (Math.cos(angle) * this.width / -2) - (Math.sin(angle) * this.height / 2);
			this.top = y + (Math.sin(angle) * this.width / -2) + (Math.cos(angle) * this.height / 2);
			this.rotation = angle;
			break;
		default:
			break;
	}
}

this.movescale = function (xsh, ysh, scl) {
	this.left = this.left + xsh;
	this.top = this.top + ysh;
	if(scl != 'undefined'){
		this.width = this.width * scl;
		this.height = this.height * scl;
	}
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
		var theta = Math.atan2(dy, dx);
		if(theta < 0) {
			return theta;
		
		}
		else {
			return Math.abs(theta);
		}
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

this.center = (typeof(arguments[0]) == 'undefined') ? new clsPoint(0, 0) : center;
this.diameter = (typeof(arguments[1]) == 'undefined') ? 10 : diameter;
this.radius = this.diameter / 2;
this.left = this.center.x - this.radius;
this.top = this.center.y + this.radius;
this.width = this.diameter;
this.height = this.diameter;

// Chord: returns chord length
this.chord = function (theta) {
	return 2 * this.radius * Math.sin(theta / 2);
}

this.draw = function (dstyle) {
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
	if(dstyle instanceof clsDrawingStyle){
		if(dstyle.filled){
			cp.filled = true;
			cp.stroked = false;
			cp.fillColor = dstyle.fillColor;
			cp.opacity = dstyle.fillOpacity;
		}
		if(dstyle.stroked){
			oline = cp.duplicate();
			oline.filled = false;
			oline.strokeWidth = dstyle.strokeWidth;
			oline.stroked = true;
			oline.strokeColor = dstyle.strokeColor;
			oline.opacity = dstyle.strokeOpacity;
		}
	}
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
			oline.stroked = true;
			oline.strokeWidth = dstyle.strokeWidth;
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
			var oline = compoundPath.duplicate();
			oline.pathItems[0].filled = false;
			oline.pathItems[0].stroked = true;
			oline.pathItems[0].strokeWidth = dstyle.strokeWidth;
			oline.pathItems[0].strokeColor = dstyle.strokeColor;
			oline.pathItems[0].opacity = dstyle.strokeOpacity;
		}
	}

}
	
function setDrawingStyle(obj, dstyle) {

	if(dstyle instanceof clsDrawingStyle){
		if(dstyle.filled){
			obj.filled = true;
			obj.fillColor = dstyle.fillColor;
			obj.opacity = dstyle.fillOpacity;
			obj.stroked = false;
		}
		if(dstyle.stroked){
			var oline = obj.duplicate();
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
// Coin flip
function flipCoin(threshold) {
	if(getRandomNumber(0,1) > threshold){
		return false;
	}
	else {
		return true;
	}
}

function printf(msg) {
	$.writeln(msg);
}

function shuffle(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};

function arrayTotal(arr) {
	var total = 0;
	for(var i = 0; i < arr.length; i ++){
		total += arr[i];
	}
	return total;
}


function numberSet(number, multiplier, jumble) {
	var fset = new Array();
	if(arguments.length > 0){
		fset[0] = 1;
		for(var i = 1; i < number; i++){
			fset[i] = fset[i - 1] * multiplier;
		}
		if(arguments.length > 1) {
			if(jumble) fset = shuffle(fset);
		}
	}
	else {
		fset[0] = 1.618;
	}

	return fset;
}

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

function resetAiDefaults () {
	app.activeDocument.defaultStroked = gAiStroked;
	app.activeDocument.defaultStrokeWidth = gAiStrokeWidth;
	app.activeDocument.defaultStrokeColor = gAiStrokeColor;
	app.activeDocument.defaultFillColor = gAiFillColor;
	return "Restore Ai Defaults";
}

// ---------------------------------------------------------
// A fix for the change of the document origin in CS5,
// and for the multi-artboard in CS4 or later.
// This function locates the active artboard's origin on the
// bottom left at first, and restores it at the end.
//
// USAGE:
// var g_origin = Origin();
// ... (do something in legacy style)
// g_origin.restore();

function Origin(){
    this.ver15_or_later = (parseFloat(version.substr(0, 2)) >= 15); // CS5 or later
    this.ver14 = (version.substr(0, 2) == "14"); // CS4
    
    if(this.ver15_or_later){
        this.saved_coord_system = app.coordinateSystem;
        app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

        var idx  = app.activeDocument.artboards.getActiveArtboardIndex();
        this.ab  = app.activeDocument.artboards[idx];
        
        var o   = this.ab.rulerOrigin;
        var r   = this.ab.artboardRect;
        this.saved_origin = [o[0], o[1]];
        this.ab.rulerOrigin = [0, r[1] - r[3]];
        
    } else if(this.ver14){
        var o = app.activeDocument.rulerOrigin;
        this.saved_origin = [o[0], o[1]];
        app.activeDocument.rulerOrigin = [0, 0];
    }

    this.restore = function(){
        if(this.ver15_or_later){
            this.ab.rulerOrigin = this.saved_origin;
            app.coordinateSystem = this.saved_coord_system;
            
        } else if(this.ver14){
            app.activeDocument.rulerOrigin = this.saved_origin;
        }
    };
        
    return this;
}