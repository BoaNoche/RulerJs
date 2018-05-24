/* jshint asi: true*/
var ruler = {}

function printDiv(printPage) {
     var printContents = document.getElementById("printPage").innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}

var contructBorders = function(){
    var border = new paper.Path.Line([0, 0], [0, ruler.height]);//actual line instance

    var ticks = new paper.Path.Line([0,ruler.height],[100,ruler.height]);
    var ticks = new paper.Path.Line([100,ruler.height],[100,0]);
    var ticks = new paper.Path.Line([100,0],[0,0]);

        }
    line.strokeColor = "black";//color of ruler line
    line.strokeWidth = "1";//width of ruler line in pixels
    paper.view.draw();

}

/*var limitTickQty = function(){
    //Prevent it from crashing if it tries to render too many linest
    ruler.ticksPerUnit = Math.pow(ruler.subUnitBase,ruler.subUnitExponent)
    ruler.masterTickQty = ruler.ticksPerUnit * ruler.width
    if(ruler.height>100){
        console.info("Unreasonable ruler height: "+ ruler.height + " reducing height")
         ruler.height= 15
         document.getElementById("rulerHeight").value = ruler.height;
    }
    if(ruler.width>1000){
        console.info("Unreasonable tick quantity: "+ ruler.masterTickQty + " reducing width")
         ruler.width= 500
         document.getElementById("rulerWidth").value = ruler.width;
    }
     if(ruler.masterTickQty > 10000){
        console.info("Unreasonable tick quantity: "+ ruler.masterTickQty + " reducing exponent")
        if(ruler.subUnitExponent>1){
        ruler.subUnitExponent = ruler.subUnitExponent -1
        document.getElementById("subUnitExponent")[ruler.subUnitExponent].selected = true;
        }
     }
    if(ruler.ticksPerUnit > 100){
        console.info("Unreasonable exponent: "+ ruler.ticksPerUnit+ " resetting to reasonable")
        ruler.subUnitExponent = 1
        document.getElementById("subUnitExponent")[ruler.subUnitExponent].selected = true;//selects resonable
    }
}*/

var checkUnit = function(){
    ruler.units = "centimeters"
    var pixelsPerInch = 72//I don't think this needs to be in the object....
    var pixelsPerCM  =  pixelsPerInch / ruler.cmPerInch

    if (ruler.units === "centimeters"){
        ruler.unitsAbbr= "cm."
        ruler.pixelsPerUnit = pixelsPerCM
    }
    else{
        ruler.pixelsPerUnit = 0
        //console.error("Unexpected unit value. Unit value: "+rulerUnits)
    }
    ruler.heightPixels = ruler.height * ruler.pixelsPerUnit
}

var resizeCanvas = function(){
    document.getElementById("myCanvas").width = 15
    //document.getElementById("myCanvas").width = ruler.width*ruler.pixelsPerUnit;
    heightAddend = 50
    document.getElementById("myCanvas").height = 20
    //document.getElementById("myCanvas").height = heightAddend+ ruler.height*ruler.pixelsPerUnit;
}

var constructRuler = function(){
    /* ruler.tickArray = [];//for prevention of redunancy, an member for each tick
    var layerArray = new Array(ruler.subUnitExponent)//Layers in the SVG file.

    for (var exponentIndex = 0;  exponentIndex <= ruler.subUnitExponent ;  exponentIndex++) {
        //loop thru each desired level of ticks, inches, halves, quarters, etc....
        var tickQty = ruler.width * Math.pow(ruler.subUnitBase,exponentIndex)
        layerArray[exponentIndex]= new paper.Layer();
        layerArray[exponentIndex].name = ruler.subLabels[exponentIndex] + " Tick Group";

        var startNo = $('#startNo').val() ;

        highestTickDenomonatorMultiplier = ruler.ticksPerUnit / Math.pow(ruler.subUnitBase,exponentIndex)
        //to prevent reduntant ticks, this multiplier is applied to crrent units to ensure consistent indexing of ticks.
        for (var tickIndex = 0;  tickIndex <= tickQty ;  tickIndex++) {
            ruler.masterTickIndex = highestTickDenomonatorMultiplier * tickIndex
            // levelToLevelMultiplier =0.7
            var tickHeight
            tickHeight = ruler.heightPixels*Math.pow(ruler.levelToLevelMultiplier,exponentIndex)

            var tickSpacing = ruler.pixelsPerUnit/(Math.pow(ruler.subUnitBase,exponentIndex))
            //spacing between ticks, the fundemental datum on a ruler :-)
            var finalTick = false
            if(tickIndex === tickQty){finalTick = true}

            var offsetTickIndex = parseInt(tickIndex) + parseInt(startNo)
            tick(tickHeight,0, tickIndex, offsetTickIndex, exponentIndex, tickSpacing,finalTick);
            //draws the ticks
        }
    }*/
    

}

var tick = function(tickHeight, horizPosition, tickIndex, offsetTickIndex, exponentIndex, tickSpacing,finalTick){
    //exponentIndex is 0-6, how small it is, 6 being smallest
    var x1 = horizPosition + (tickSpacing * tickIndex)
    var x2 = x1 //x === x because lines are vertical
    var y1 = 0//all lines start at top of screen
    var y2 = tickHeight//downward

    if (ruler.tickArray[ruler.masterTickIndex]===undefined || ruler.redundant) {
        // if no tick exists already, or if we want redundant lines, draw the tick.
        var line = new paper.Path.Line([x1, y1], [x2, y2]);//actual line instance
        line.name = ruler.subLabels[exponentIndex]+ " Tick no. " + tickIndex //label for SVG editor
        line.strokeColor = "black";//color of ruler line
        line.strokeWidth = "1";//width of ruler line in pixels

        ruler.tickArray[ruler.masterTickIndex]=true //register the tick so it is not duplicated
            if (exponentIndex === 0) {//if is a primary tick, it needs a label
                tickLabel(x1,y2,finalTick,offsetTickIndex,exponentIndex)
            }
    }   
}

var tickLabel = function(x1,y2,finalTick,tickIndex,exponentIndex){
    //label the tick
            var labelTextSize
            var labelTextSizeInches = 18
            var labelTextSizeCm = Math.round(labelTextSizeInches/ruler.cmPerInch)
            if(ruler.units === "inches"){labelTextSize = labelTextSizeInches;}
            else{labelTextSize = labelTextSizeCm;}
            var xLabelOffset = 4
            var yLabelOffset = 1
            if (finalTick) {xLabelOffset = -1* xLabelOffset}//last label is right justified
            var text = new paper.PointText(new paper.Point(x1+ xLabelOffset, y2+yLabelOffset));
            text.justification = 'left';
            if (finalTick) {text.justification = 'right';}//last label is right justified
            text.fillColor = 'black';
            text.content = tickIndex;
            text.style = {
            // fontFamily: 'Helvetica',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: labelTextSize}
            text.name = ruler.subLabels[exponentIndex] + " label no. " +tickIndex //label for SVG editor
}

var debug = function(){
    console.info("--All the variables---")
    console.info(ruler)//prints all attributes of ruler object
}

var updateVariables = function(){
    ruler.units =  "centimeters";
    //ruler.subUnitBase = $("input:radio[name=subUnits]:checked'").val();
    //ruler.redundant =  $("input:checkbox[name=redundant]:checked'").val();
    //ruler.width = $('#rulerWidth').val() ;
    ruler.height = $('#rulerHeight').val() ;
    //ruler.subUnitExponent = $('#subUnitExponent').val() ;
    //ruler.levelToLevelMultiplier = $('#levelToLevelMultiplier').val();
    ruler.cmPerInch = 2.54
    ruler.high = parseInt(document.getElementById("rulerHigh").value)
    ruler.low = parseInt(document.getElementById("rulerLow").value)
}

var build = function(){
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    contructBorders()
    updateVariables()
    //checkUnit()
    //checkSubUnitBase()
    //limitTickQty()
    resizeCanvas()
    constructRuler()



    var line = new paper.Path.Line([0, 0], [0, ruler.height]);//actual line instance

   /* var j=0;
    for (i = ruler.high; i < rule.low; i++) {
        j+=5;
        if(i%10==0){
        var ticks = new paper.Path.Line({
        from: [0, j],
        to: [30, j],
        strokeColor: 'black'
        });  
        }
        else if(i%5==0){
        var ticks = new paper.Path.Line({
        from: [0, j],
        to: [20, j],
        strokeColor: 'black'
        });            
        }
        else{
        var ticks = new paper.Path.Line({
        from: [0, j],
        to: [10, j],
        strokeColor: 'black'
        });            
        }

    }*/
    line.strokeColor = "black";//color of ruler line
    line.strokeWidth = "1";//width of ruler line in pixels
    paper.view.draw();
}

var exportSvg = function(){
    //* I referenced the excellent SVG export example here: http://paperjs.org/features/#svg-import-and-export
/*    document.getElementById("svgexpbutton").onclick = 
    function(){
        exportWidth = document.getElementById("myCanvas").width
        exportHeight = document.getElementById("myCanvas").height
        viewBox ='viewBox="0 0 '+exportWidth+' '+exportHeight+'"'
        dims = ' width= "'+exportWidth+'" height="'+exportHeight+' " '
        var svgPrefix = '<svg x="0" y="0"'+dims+viewBox+' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
        // var svgPostfix = '</svg>';
        var svg =   paper.project.exportSVG({ asString: true, size: { width: exportWidth, height: exportHeight } });

        var elem = document.getElementById("svgexpdata");
        elem.value = 'data:image/svg+xml;base64,' + btoa(svg);
        //btoa Creates a base-64 encoded ASCII string from a "string" of binary data
        document.getElementById("svgexpform").submit();
};*/

}

$(document).ready(function(){ 
    console.log("\t Welcome to the Ruler Generator │╵│╵│╵│╵│╵│╵│")
    //When document is loaded, call build once
    build()
    debug()//prints all values to browser console

    $( "#rulerParameters" ).change(function(  ) {
        //anytime anything within the form is altered, call build again
        build()
        debug()//prints all values to browser console
    });

    exportSvg()

});