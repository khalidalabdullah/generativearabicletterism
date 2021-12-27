
#include "./letterism-core(T).jsx"
#target illustrator


function tt () {
	var sw = app.activeDocument.swatchGroups;
	for(var i = 0; i < sw.length; i++){
		printf sw[i].name;
	}
}

tt();