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


function printDiv() {
     var printContents = document.getElementById("printingZone").innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}

var resizeCanvas = function(){
    document.getElementById("myCanvas").width = 210*mmtopx
    document.getElementById("myCanvas").height = 277*mmtopx
}

var showDebug = function(){
    console.info("--All the variables---")
    console.info(ruler)//prints all attributes of ruler object

}
//coeff to multiply mm to get pixels (for reference, not used)
var pxtomm = 0.264583;
//coeff to multiply pixels to get millimeters
var mmtopx = 3.779528;
var CORRECT_VERTICAL_POSITION_SCALE = -250;
var SCALE_ABSCISSA = 20;
var debug = true;

/*function Apple (type) {
    this.type = type;
    this.color = "red";
    this.getInfo = function() {
        return this.color + ' ' + this.type + ' apple';
    };
}*/


function ruler() {
    this.MIN_ALCOHOL_VALUE = 3.5;
    this.MAX_ALCOHOL_VALUE = 18;
    this.ALCOHOL_INCREMENT = 0.5;

    this.updateVariables = function(){
        this.size = parseInt(document.getElementById("rulerSize").value);
        this.high = parseInt(document.getElementById("rulerHigh").value);
        this.low = parseInt(document.getElementById("rulerLow").value);
        this.increment = parseInt(document.getElementById("Increment").value);
        this.start = parseInt(document.getElementById("rulerStart").value);
        this.stop = parseInt(document.getElementById("rulerStop").value);
        this.line1length = parseInt(document.getElementById("line1length").value);
        this.line1size = parseInt(document.getElementById("line1size").value);
        this.line2length = parseInt(document.getElementById("line2length").value);
        this.line2size = parseInt(document.getElementById("line2size").value);
        this.line3length = parseInt(document.getElementById("line3length").value);
        this.line3size = parseInt(document.getElementById("line3size").value);
        this.lineAvalue = parseInt(document.getElementById("lineAvalue").value);
        this.lineBvalue = parseInt(document.getElementById("lineBvalue").value);
        this.lineCvalue = parseInt(document.getElementById("lineCvalue").value);
        this.displayVerticalLine = document.getElementById("displayVerticalLine").checked;
        this.displayBorders = document.getElementById("displayBorders").checked;
        this.arrayListSpecialValues = [this.lineAvalue, this.lineBvalue, this.lineCvalue];
        this.arraySpecialValues = [];
        this.arraySpecialValues[this.lineAvalue] = lineAcolor.value;
        this.arraySpecialValues[this.lineBvalue] = lineBcolor.value;
        this.arraySpecialValues[this.lineCvalue] = lineCcolor.value;
        this.exportButton= document.getElementById('export-button');

    };

    this.showVerticalline = function(){
        if(this.displayVerticalLine){
        console.log(this.arrayTickValues);
        var line = new paper.Path.Line([SCALE_ABSCISSA*mmtopx, this.arrayTickValues[this.start]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE], [SCALE_ABSCISSA*mmtopx, this.arrayTickValues[this.stop]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE]);//actual line instance
        line.strokeColor = ScaleColor.value;//color of ruler line
        line.strokeWidth = "1";//width of ruler line in pixels
        }
    };

    this.showBorders = function(){
        if(this.displayBorders){
            var rectangle = new paper.Rectangle(new paper.Point(0, 0), new paper.Size(40*mmtopx, 200*mmtopx));
            var path = new paper.Path.Rectangle(rectangle);
            path.strokeColor = 'black';
            }
    };
    this.buildRuler = function() {
        this.showBorders();
        this.showVerticalline();
    }

    
}


var build = function(){
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    var ruler1 = new ruler();
    ruler1.updateVariables();
    
    //console.log(ruler1);
    resizeCanvas()
    var arrayTickValues=[];
    //Load every volumic mass values in an array
    for (i = ruler1.start; i <= ruler1.stop; i+=ruler1.increment) {
        arrayTickValues[i]=0.0000009009960777*Math.pow(i,3) - 0.003811527044*Math.pow(i,2) + 6.042122602*i - 3025.189377
    }

    if(debug) {console.log(arrayTickValues)};
    for (i = ruler1.start; i <= ruler1.stop; i+=ruler1.increment) {
        arrayTickValues[i]= (ruler1.size/(ruler1.low - ruler1.high))*arrayTickValues[i] - (ruler1.size*arrayTickValues[ruler1.high])/(ruler1.low - ruler1.high) + arrayTickValues[ruler1.high]
    }
    //scaling to the wished size. see https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
    if(debug) {console.log(arrayTickValues)};
    ruler1.arrayTickValues = arrayTickValues;
    var arrayAlcoholValues = [];
    //loads every alcohol values in an array
    for (i = ruler1.MIN_ALCOHOL_VALUE; i <= ruler1.MAX_ALCOHOL_VALUE; i+=ruler1.ALCOHOL_INCREMENT) {
        arrayAlcoholValues[i]=0.0004304317136*Math.pow(i,3) - 0.0228699357*Math.pow(i,2) + 6.744733982*i + 116.0588879
        arrayAlcoholValues[i]= (ruler1.size/(ruler1.low - ruler1.high))*arrayAlcoholValues[i] - (ruler1.size*arrayTickValues[ruler1.high])/(ruler1.low - ruler1.high) + arrayTickValues[ruler1.high]
    }
    if(debug) {console.log(arrayAlcoholValues)};

    //draw the vertical line of the scale

    ruler1.buildRuler();


    var j=0;
    for (i = ruler1.MIN_ALCOHOL_VALUE; i <= ruler1.MAX_ALCOHOL_VALUE; i+=ruler1.ALCOHOL_INCREMENT) {
            j+=5;
            if(i%1==0){
                var ticks = new paper.Path.Line({
                    from: [SCALE_ABSCISSA*mmtopx+ruler1.line2length*mmtopx, arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
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
                    from: [SCALE_ABSCISSA*mmtopx+ruler1.line3length*mmtopx, arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [SCALE_ABSCISSA*mmtopx, arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: ScaleColor.value
                });
            }
        }

    for (i = ruler1.start; i <= ruler1.stop; i++) {
            j+=5;
            if(i%10==0.0 && i>=ruler1.high){
                var ticks = new paper.Path.Line({
                    from: [SCALE_ABSCISSA*mmtopx-ruler1.line1length*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [SCALE_ABSCISSA*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: checkIfSpecialValue(ruler1, ruler1.arrayListSpecialValues, ruler1.arraySpecialValues, i),
                    strokeWidth : ruler1.line1size
                });
                var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-30+19,arrayTickValues[i]*mmtopx -2 + CORRECT_VERTICAL_POSITION_SCALE));
                text.justification = 'right';
                text.fillColor = ScaleColor.value;
                text.content = i;
            }
            else if(i%5==0){
                var ticks = new paper.Path.Line({
                    from: [SCALE_ABSCISSA*mmtopx-ruler1.line2length*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [SCALE_ABSCISSA*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: ScaleColor.value,
                    strokeWidth : ruler1.line2size
                });
            }
            else{
                var ticks = new paper.Path.Line({
                    from: [SCALE_ABSCISSA*mmtopx-ruler1.line3length*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [SCALE_ABSCISSA*mmtopx, arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: ScaleColor.value,
                    strokeWidth : ruler1.line3size
                });
            }
        }
    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-70,arrayTickValues[ruler1.stop]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'left';
    text.fillColor = ScaleColor.value;
    text.content = "Masse volumique";
    text.rotation=-90;

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-45,arrayTickValues[ruler1.stop]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'left';
    text.fillColor = ScaleColor.value;
    text.content = "g/l (05) 20ºC";
    text.rotation=-90;

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-35,arrayTickValues[ruler1.stop]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'left';
    text.fillColor = ScaleColor.value;
    text.content = "Alcool probable";
    text.rotation=-90;

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-30+19,arrayTickValues[ruler1.stop]*mmtopx +120 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'center';
    text.fillColor = ScaleColor.value;
    text.content = "MUSTIMETRIE";

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-30+19,arrayTickValues[ruler1.stop]*mmtopx +140 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'center';
    text.fillColor = ScaleColor.value;
    text.content = "COMPANY";

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx-30+19,arrayTickValues[ruler1.stop]*mmtopx +160 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'center';
    text.fillColor = ScaleColor.value;
    text.content = "NAME";

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx+10,arrayAlcoholValues[ruler1.MIN_ALCOHOL_VALUE]*mmtopx -100 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'center';
    text.fillColor = ScaleColor.value;
    text.content = "1683 grammes de sucre par hecto";
    text.rotation=-90;

    var text = new paper.PointText(new paper.Point(SCALE_ABSCISSA*mmtopx +20,arrayAlcoholValues[ruler1.MIN_ALCOHOL_VALUE]*mmtopx -100 + CORRECT_VERTICAL_POSITION_SCALE));
    text.justification = 'center';
    text.fillColor = ScaleColor.value;
    text.content = "produisent 1% d'alcool";
    text.rotation=-90;
    paper.view.draw();
}
var checkIfSpecialValue = function(ruler, arrayListSpecialValues, arraySpecialValues, valueToBeChecked){
    if (ruler.arrayListSpecialValues.includes(valueToBeChecked)){
        color = ruler.arraySpecialValues[valueToBeChecked];
    }
    else {
        color =ScaleColor.value;
    }
    return color;
}
$(document).ready(function(){ 
    //When document is loaded, call build once
    build()
    if(debug) {showDebug();}//prints all values to browser console

    $( "#rulerParameters" ).change(function(  ) {
        //anytime anything within the form is altered, call build again
        build()
        if(debug) {showDebug();}//prints all values to browser console
    });
});