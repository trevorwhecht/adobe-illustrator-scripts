/* Save this file with a jsx extension and place in your
Illustrator/Presets/en_US/Scripts folder. You can then
access it from the File > Scripts menu */

var decimalPlaces = 3;

function calculateArea (obj) {
	if (obj.typename == "PathItem") {
		return obj.area; // could be negative
	} else if (obj.typename == "CompoundPathItem") {
		var totalArea = 0;
		for (var i=0; i<obj.pathItems.length; i++) {
			totalArea += calculateArea(obj.pathItems[i]); // could be negative
		}
		return Math.abs(totalArea); // make sure positive
	} else if (obj.typename == "GroupItem") {
		var totalArea = 0;
		for (var i=0; i<obj.pathItems.length; i++) {
			totalArea += Math.abs(calculateArea(obj.pathItems[i])); // make sure positive
		}
		for (var i=0; i<obj.compoundPathItems.length; i++) {
			totalArea += calculateArea(obj.compoundPathItems[i]); // already positive
		}
		for (var i=0; i<obj.groupItems.length; i++) {
			totalArea += calculateArea(obj.groupItems[i]); // already positive
		}
		return totalArea; // already positive
	} else { // not path, compound path or group
		return 0;
	}
}

function convertArea (area) {
	var scaleFactor = 1;
	if (app.documents.length > 0 && app.activeDocument.scaleFactor != null) {
		scaleFactor = app.activeDocument.scaleFactor;
	}
	var ppi = 72;
	var result = {};
	area *= scaleFactor * scaleFactor;
	result.inch = area/ppi/ppi;
	result.cm = result.inch * 2.54 * 2.54;
	result.m = result.cm / 10000;
	return result;
}

if (app.documents.length > 0) {
	var objects = app.activeDocument.selection;

	var display = ["Shape Area"];

	// Collect info
	var totalArea = 0;
	for (var i=0; i<objects.length; i++) {
		var area = Math.abs(calculateArea(objects[i])); // need absolute in case of PathItems
		totalArea += area;
		
		var conv = convertArea(area);

		display.push(conv.inch.toFixed(decimalPlaces) + " in² / " + conv.cm.toFixed(decimalPlaces) + "cm² / " + conv.m.toFixed(decimalPlaces) + "m²");
	}

	var conv = convertArea(totalArea);
	display.push("Total Area: " + conv.inch.toFixed(decimalPlaces) + " in² / " + conv.cm.toFixed(decimalPlaces) + "cm² / " + conv.m.toFixed(decimalPlaces) + "m²");


	// Display
	alert(display.join("\n"));

}
