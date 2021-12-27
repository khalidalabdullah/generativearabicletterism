#include "./letterism-core(T).jsx"
#target illustrator

function getPalette(palname) {
	var sg = app.activeDocument.swatchGroups;
	for(var i = 0; i < sg.length; i++){
		if(sg[i].name = palname){
			return sg[i].getAllSwatches();
		}
	}
}

function setupPalette(name, obj) {
		var p = getPalette(name);
		var dx = Math.floor(425 / p.length);
		var x1 = 15;
		var x2 = x1 + dx - 1;
		printf(p.name)
		for(var i = 0; i < p.length - 1; i++) {
			var cp = obj.add("panel", [x1,45,x2,75], "");
			x1 += dx;
			x2 = x1 + dx - 1;
		}
	}
function dlgObjectStyle() 
{
	this.windowRef = null;
}

dlgObjectStyle.prototype.run = function()
{
	
	// Create a window of type palette.
	var win = new Window("palette", "Object Style",[100,100,580,430]);  // bounds = [left, top, right, bottom]
	//this.windowRef = win;
	// ************ Add fillPanel
	win.fillPanel = win.add("panel", [15,10,470,140], "Fill");
	// Add the components
	win.fillPanel.pListLabel = win.fillPanel.add("statictext", [15, 20, 52, 35], "Palette:");
	win.fillPanel.pList = win.fillPanel.add("dropdownlist", [65, 15, 250, 35]);
	//win.fillPanel.colorPanel = win.fillPanel.add("panel", [15,45,440,75], "", {borderStyle: "gray"});
	//var g = win.fillPanel.colorPanel.graphics;
	//g.backgroundColor = g.newBrush (g.BrushType.SOLID_COLOR, [0,0,0,1], 1);
	var sw = app.activeDocument.swatchGroups;
	for(var i = 0; i < sw.length; i++){
		if(sw[i].name.length > 0){
			win.fillPanel.pList.add('item', sw[i].name);
		}
	}
	win.fillPanel.pList.selection = win.fillPanel.pList.items[0];
	setupPalette(win.fillPanel.pList.selection, win.fillPanel);
	// Register event listeners that define the button behavior
	win.fillPanel.pList.onChange = function () {
		printf(win.fillPanel.pList.selection);
	}
	
	// ************ Add fillPanel
	win.strokePanel = win.add("panel", [15, 150, 470,280], "Stroke");
	win.strokePanel.pListLabel = win.strokePanel.add("statictext", [15, 20, 52, 35], "Palette:");
	win.strokePanel.pList = win.strokePanel.add("dropdownlist", [65, 15, 250, 35]);
	// Display the window
	win.btnDone = win.add("button", [300, 290, 400, 310], "Done");
	win.btnDone.onClick = function() {
		$.writeln("Cancel pressed");
		win.close();
	};

	win.show();
		
	return true;
		
}

/**
 "main program": construct an anonymous instance and run it
  as long as we are not unit-testing this snippet.
*/
if(typeof(dlgObjectStyle_unitTest) == "undefined") {
    new dlgObjectStyle().run();
}

