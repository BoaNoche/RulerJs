document.addEventListener("DOMContentLoaded", function(event) { 
    document.getElementById("download-to-svg").onclick = function(){
    d = new Date();
    var fileName = "Scale_" + d.getHours() + d.getMinutes() + d.getSeconds() + ".svg"
    var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
    }
});

/* jshint asi: true*/
var ruler = {};

//coeff to multiply mm to get pixels
var mmtopx = 3.779528;
//coeff to multiply pixels to get millimeters
var pxtomm = 0.264583;
var MIN_ALCOHOL_VALUE=3.5;
var MAX_ALCOHOL_VALUE=18;
var ALCOHOL_INCREMENT=0.5;

var CORRECT_VERTICAL_POSITION_SCALE = -250;
var SCALE_ABSCISSA = 20;
var exportButton = document.getElementById("exportButton");

function printDiv(printPage) {
     var printContents = document.getElementById("printPage").innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}

var resizeCanvas = function(){
    document.getElementById("myCanvas").width = 210*mmtopx
    document.getElementById("myCanvas").height = 277*mmtopx
}

var constructRuler = function(){
    /* ruler.tickArray = [];//for prevention of redunancy, an member for each tick
    var layerArray = new Array(ruler.subUnitExponent)//Layers in the SVG file.
    */
}

var debug = function(){
    console.info("--All the variables---")
    console.info(ruler)//prints all attributes of ruler object

}

var updateVariables = function(){
    ruler.size = parseInt(document.getElementById("rulerSize").value);
    ruler.high = parseInt(document.getElementById("rulerHigh").value);
    ruler.low = parseInt(document.getElementById("rulerLow").value);
    ruler.increment = parseInt(document.getElementById("Increment").value);
    ruler.start = parseInt(document.getElementById("rulerStart").value);
    ruler.stop = parseInt(document.getElementById("rulerStop").value);
    ruler.line1length = parseInt(document.getElementById("line1length").value);
    ruler.line1size = parseInt(document.getElementById("line1size").value);
    ruler.line2length = parseInt(document.getElementById("line2length").value);
    ruler.line2size = parseInt(document.getElementById("line2size").value);
    ruler.line3length = parseInt(document.getElementById("line3length").value);
    ruler.line3size = parseInt(document.getElementById("line3size").value);
    ruler.lineAvalue = parseInt(document.getElementById("lineAvalue").value);
    ruler.lineBvalue = parseInt(document.getElementById("lineBvalue").value);
    ruler.lineCvalue = parseInt(document.getElementById("lineCvalue").value);
    ruler.displayVerticalLine = document.getElementById("displayVerticalLine").checked;
    ruler.displayBorders = document.getElementById("displayBorders").checked;
    ruler.arrayListSpecialValues = [ruler.lineAvalue, ruler.lineBvalue, ruler.lineCvalue];
    ruler.arraySpecialValues = [];
    ruler.arraySpecialValues[ruler.lineAvalue] = lineAcolor.value;
    ruler.arraySpecialValues[ruler.lineBvalue] = lineBcolor.value;
    ruler.arraySpecialValues[ruler. lineCvalue] = lineCcolor.value;

    exportButton= document.getElementById('export-button');

}
var contructBorders = function(){
    if(displayBorders){
        var rectangle = new paper.Rectangle(new paper.Point(0, 0), new paper.Size(40*mmtopx, 230*mmtopx));
        var path = new paper.Path.Rectangle(rectangle);
        path.strokeColor = 'black';
        }
}

var ScaleRuler = function() {


}
var build = function(){
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    updateVariables()
    ScaleRuler()
    resizeCanvas()
    constructRuler()
    var arrayTickValues=[];
    //Load every volumic mass values in an array
    for (i = ruler.start; i <= ruler.stop; i+=ruler.increment) {
        arrayTickValues[i]=0.0000009009960777*Math.pow(i,3) - 0.003811527044*Math.pow(i,2) + 6.042122602*i - 3025.189377
    }
    //scaling to the wished size. see https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
    for (i = ruler.start; i <= ruler.stop; i+=ruler.increment) {
        arrayTickValues[i]= (ruler.size/(ruler.low - ruler.high))*arrayTickValues[i] - (ruler.size*arrayTickValues[ruler.high])/(ruler.low - ruler.high) + arrayTickValues[ruler.high]
    }
    console.log(arrayTickValues);

    var arrayAlcoholValues = [];
    //loads every alcohol values in an array
    for (i = MIN_ALCOHOL_VALUE; i <= MAX_ALCOHOL_VALUE; i+=ALCOHOL_INCREMENT) {
        arrayAlcoholValues[i]=0.0004304317136*Math.pow(i,3) - 0.0228699357*Math.pow(i,2) + 6.744733982*i + 116.0588879
    }

    for (i = MIN_ALCOHOL_VALUE; i <= MAX_ALCOHOL_VALUE; i+=ALCOHOL_INCREMENT) {
        arrayAlcoholValues[i]= (ruler.size/(ruler.low - ruler.high))*arrayAlcoholValues[i] - (ruler.size*arrayTickValues[ruler.high])/(ruler.low - ruler.high) + arrayTickValues[ruler.high]
    }
    console.log(arrayTickValues);

    //draw the vertical line of the scale
    if(ruler.displayVerticalLine){
    var line = new paper.Path.Line([SCALE_ABSCISSA*mmtopx, arrayTickValues[ruler.start]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE], [SCALE_ABSCISSA*mmtopx, arrayTickValues[ruler.stop]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE]);//actual line instance
    line.strokeColor = ScaleColor.value;//color of ruler line
    line.strokeWidth = "1";//width of ruler line in pixels
    var j=0;
    }
    if(ruler.displayBorders){
        contructBorders();
    }



    for (i = MIN_ALCOHOL_VALUE; i <= MAX_ALCOHOL_VALUE; i+=ALCOHOL_INCREMENT) {
            j+=5;
            if(i%1==0){
                var ticks = new paper.Path.Line({
                    from: [SCALE_ABSCISSA*mmtopx+ruler.line2length*mmtopx, arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [SCALE_ABSCISSA*mmtopx, arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: ScaleColor.value
                });
                var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx+7,arrayAlcoholValues[i]*mmtopx -5 + CORRECT_VERTICAL_POSITION_SCALE));
                text.justification = 'left';
                text.fillColor = ScaleColor.value;
                text.content = i;
            }
            else{
                var ticks = new paper.Path.Line({
                    from: [SCALE_ABSCISSA*mmtopx+ruler.line3length*mmtopx, arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [SCALE_ABSCISSA*mmtopx, arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: ScaleColor.value
                });
            }
        }

    for (i = ruler.start; i <= ruler.stop; i++) {
            j+=5;
            if(i%10==0.0 && i>=ruler.high){
                var ticks = new paper.Path.Line({
                    from: [SCALE_ABSCISSA*mmtopx-ruler.line1length*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [SCALE_ABSCISSA*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: checkIfSpecialValue(ruler.arrayListSpecialValues, ruler.arraySpecialValues, i),
                    strokeWidth : ruler.line1size
                });
                var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-30+19,arrayTickValues[i]*mmtopx -2 + CORRECT_VERTICAL_POSITION_SCALE));
                text.justification = 'right';
                text.fillColor = ScaleColor.value;
                text.content = i;
            }
            else if(i%5==0){
                var ticks = new paper.Path.Line({
                    from: [SCALE_ABSCISSA*mmtopx-ruler.line2length*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [SCALE_ABSCISSA*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: ScaleColor.value,
                    strokeWidth : ruler.line2size
                });
            }
            else{
                var ticks = new paper.Path.Line({
                    from: [SCALE_ABSCISSA*mmtopx-ruler.line3length*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [SCALE_ABSCISSA*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: ScaleColor.value,
                    strokeWidth : ruler.line3size
                });
            }
        }
    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-70,arrayTickValues[ruler.stop]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'left';
    text.fillColor = ScaleColor.value;
    text.content = "Masse volumique";
    text.rotation=-90;

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-45,arrayTickValues[ruler.stop]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'left';
    text.fillColor = ScaleColor.value;
    text.content = "g/l (05) 20ºC";
    text.rotation=-90;

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-35,arrayTickValues[ruler.stop]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'left';
    text.fillColor = ScaleColor.value;
    text.content = "Alcool probable";
    text.rotation=-90;

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-30+19,arrayTickValues[ruler.stop]*mmtopx +120 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'center';
    text.fillColor = ScaleColor.value;
    text.content = "MUSTIMETRIE";

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-30+19,arrayTickValues[ruler.stop]*mmtopx +140 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'center';
    text.fillColor = ScaleColor.value;
    text.content = "COMPANY";

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-30+19,arrayTickValues[ruler.stop]*mmtopx +160 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'center';
    text.fillColor = ScaleColor.value;
    text.content = "NAME";

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx+10,arrayAlcoholValues[MIN_ALCOHOL_VALUE]*mmtopx -100 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'center';
    text.fillColor = ScaleColor.value;
    text.content = "1683 grammes de sucre par hecto";
    text.rotation=-90;

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx +20,arrayAlcoholValues[MIN_ALCOHOL_VALUE]*mmtopx -100 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'center';
    text.fillColor = ScaleColor.value;
    text.content = "produisent 1% d'alcool";
    text.rotation=-90;
    paper.view.draw();
}
var checkIfSpecialValue = function(arrayListSpecialValues, arraySpecialValues, valueToBeChecked){
    if (ruler.arrayListSpecialValues.includes(valueToBeChecked)){
        color = ruler.arraySpecialValues[valueToBeChecked];
    }
    else {
        color =ScaleColor.value;
    }
    return color;
}
$(document).ready(function(){ 
    console.log("\t ScaleGen Dujardin Salleron │╵│╵│╵│")
    //When document is loaded, call build once
    build()
    debug()//prints all values to browser console

    $( "#rulerParameters" ).change(function(  ) {
        //anytime anything within the form is altered, call build again
        build()
        debug()//prints all values to browser console
    });
    //exportSvg()
});