// Learning Extended Script
// Khalid M. Khalid
// December 2011

///////////// Global Variables ////////////////
var xmlShapes;
var xmlLoaded;

////////////// Test Pad /////////////
testpad();

function testpad(){
    
    var st = new shapeTree();
    st.loadShapeTree();
    
}


//////////// Objects
function shapeTree () {

this.shapes;

this.loadShapeTree = function(){
        var fl = new File();
        fl.changePath("C:/");
        var fname = fl.openDlg("Load Shapes", "XML Files: *.xml");
        $.writeln("File name: " + fl.absoluteURI);
}


} // End of shapeTree Constructor


/////////// Functions //////////////
function main(){

	xmlShapes = new XML("<shapes>");
	scanSelection();
	writeXMLFile(xmlShapes);
}

function compath(){

	var grps = app.activeDocument.activeLayer.compoundPathItems;
	for (var i = 0; i < grps.length; i++){
		var cpath = grps[i];
		for (var j= 0; j < cpath.pathItems.length; j++){
			var path = cpath.pathItems[j];
			$.write(path.zOrderPosition);
		}
	}
}

function copyitems(){
	
var p = test();
for (var i = 0; i < p.elements().length(); i++){
	testdraw(p.child(i));
}

}
// scanSelection: adds the current selection to the xmlShapes tree
function scanSelection() {
	var xmlShape = new XML("<shape>");
	var xmlGlyphs = new XML("<glyphs>");
	var xmlGraphics = new XML("<graphics>");
	var xmlSpaces = new XML("<spaces>");
	
	var sel= app.activeDocument.selection;
	for (var i=0; i < sel.length; i++){
		var path = sel[i];
		switch(path.name){
			case "main": 
				var xmlGlyph = new XML("<glyph>");
				if (path.typename == "CompoundPathItem"){
					for(j = 0; j < path.pathItems.length; j++){
						var cp = path.pathItems[j];
						xmlGlyph.appendChild(pathToXML(cp));
					}
				}
				else{
					xmlGlyph.appendChild(pathToXML(path));
				}
				xmlGlyphs.appendChild(xmlGlyph);
				break;
			case "graphic":
				var xmlGraphic = new XML("<graphic>");
				if (path.typename == "CompoundPathItem"){
					for(j = 0; j < path.pathItems.length; j++){
						var cp = path.PathItems[i];
						xmlGraphic.appendChild(pathToXML(cp));
					}
				}
				else{
					xmlGraphic.appendChild(pathToXML(path));
				}
				xmlGraphics.appendChild(xmlGraphic);
				break;
			case "space":
				xmlSpaces.appendChild(pathToXML(path));
				break;
			default: 
				break;
		}
	}

	if (sel.length > 0){
		xmlShape.appendChild(xmlGlyphs);
		xmlShape.appendChild(xmlGraphics);
		xmlShape.appendChild(xmlSpaces);
		xmlShapes.appendChild(xmlShape);
	}
}

function xmlTree(){
	
	var xmlShape = new XML("<shape>");
	var xmlGlyphs = new XML("<glyphs>");
	var xmlGraphics = new XML("<graphics>");
	var xmlSpaces = new XML("<spaces>");
	
	xmlShape.appendChild(xmlGlyphs);
	xmlShape.appendChild(xmlGraphics);
	xmlShape.appendChild(xmlSpaces);
	
	writeXMLFile(xmlShape);
	
}

function pathToXML(path){
	var pathxml = new XML("<path closed='" + path.closed + "'>");
	for (var i = 0; i < path.pathPoints.length; i++){
		point = path.pathPoints[i]
		var pointxml = new XML("<point x='" + point.anchor[0] +"' y='" + point.anchor[1] + "' rdx='" + point.rightDirection[0] + "' rdy='" + point.rightDirection[1] + "' ldx='" + point.leftDirection[0] + "' ldy='" + point.leftDirection[1] + "' type='" + point.pointType + "'>");
		pathxml.appendChild(pointxml);
	}
	return pathxml;
}

function test() {

var sel = app.activeDocument.selection;
var path;
var point;
var xmlstr;

var shapexml = new XML("<shape>");

	for (var i = 0; i < sel.length; i++) {
		path = sel[i];
		pathxml = new XML("<path closed='" + path.closed + "'>");
		for (var j = 0; j < path.pathPoints.length; j++){
			point = path.pathPoints[j]
			pointxml = new XML("<point x='" + point.anchor[0] +"' y='" + point.anchor[1] + "' rdx='" + point.rightDirection[0] + "' rdy='" + point.rightDirection[1] + "' ldx='" + point.leftDirection[0] + "' ldy='" + point.leftDirection[1] + "' type='" + point.pointType + "'>");
			pathxml.appendChild(pointxml);
		}
		shapexml.appendChild(pathxml);
	}
	return shapexml;
}

function drawShapes(){
	var file = new File("C:/test.xml");
	var xmlsh = readXMLFile(file);
	for (var i = 0; i < xmlsh.elements().length(); i++){
		var shape = xmlsh.child(i);
		var glyphs = shape.child("glyphs");
		for (var j = 0; j < glyphs.elements().length(); j++){
			var glyph = glyphs.child(j);
			if (glyph.elements().length() > 1){
				drawCompoundPath (glyph);
			}
			else {
				drawPath(glyph.child(0));
			}
		}
		var graphics = shape.child("graphics");
		for(var j = 0; j < graphics.elements().length(); j++){
			var graphic = graphics.child(j);
			if (graphic.elements().length() > 1){
				drawCompoundPath (graphic);
			}
			else {
				drawPath(graphic.child(0));
			}
		}
		var spaces = shape.child("spaces");
		for(var j = 0; j < spaces.elements().length(); j++){
			var space = spaces.child(j);
			drawPath(space);
		}
	}
}
			
function drawPath(pathxml){
if (!(pathxml instanceof XML)){
	throw "Bad XML parameter";
}
	var doc = app.activeDocument;
	var line = doc.pathItems.add();
	var pointxml;
	line.stroked = true;
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
}

function drawCompoundPath(cpathxml){
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
	line.stroked = true;
}
	

function testwritexml(){
	
	var xml = new XML("<shapes><shape></shape><shape></shape></shapes>");
	
	writeXMLFile(xml);
	
}
	
//////////////////////// Utility Functions /////////////////////////////////////////
function xmlenclose(nodename, xmlstr){
	return "<" + nodename + ">" + xmlstr + "</" + nodename + ">";
}


function writeXMLFile(xml) {
if (!(xml instanceof XML)) {
	throw "Bad XML parameter";
}
	var file = new File("C:/test.xml");
	file.encoding = "UTF8";
	file.open("w", "xxxx", "xxxx");
	// unicode signature, this is UTF16 but will convert to UTF8 "EF BB BF"
	file.write("\uFEFF");
	file.lineFeed = "unix";
	file.write(xml.toXMLString(xml));
	file.close();
};

function readXMLFile(file) {
if (!file.exists) {
	throw "Cannot find file: " + deodeURI(file.absoluteURI);
}
	file.encoding = "UTF8";
	file.lineFeed = "unix";
	file.open("r", "TEXT", "????");
	var str = file.read();
	file.close();

	return new XML(str);
};
