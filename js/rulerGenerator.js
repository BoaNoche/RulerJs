document.addEventListener("DOMContentLoaded", function(event) { 
    document.getElementById("download_to_svg").onclick = function(){
    d = new Date();
    var fileName = "Scale_" + d.getYears() + d.getMonths() + d.getDays()+ "_"+ d.getHours() + d.getMinutes() + d.getSeconds() + ".svg"
    var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
    }
    document.getElementById("add_scale").onclick = function(){




    if(debug) {showDebug();}//prints all values to browser console

        resizeCanvas()
        console.log(current_ruler.abscissa + new_scale_abscissa_addx);
        var new_ruler = new ruler(current_ruler.abscissa + new_scale_abscissa_addx);
        current_ruler = new_ruler;
        current_ruler.updateVariables();
        array_ruler.push(current_ruler);

        var index, len;

        for (index = 0, len = array_ruler.length; index < len; ++index) {
            array_ruler[index].buildRuler();
        }
        paper.view.draw();

        var tableRef = document.getElementById('rulers_table').getElementsByTagName('tbody')[0];
       
        // Insert a row in the table at the last row
        var newRow   = tableRef.insertRow(tableRef.rows.length);

        // Insert a cell in the row at index 0

        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);       
        cell1.innerHTML = "uniqueID";
        cell2.innerHTML = parseInt(document.getElementById("rulerSize").value);
        cell3.innerHTML = '<img src="img/glyphicons-17-bin.png" />'

    }
    document.getElementById("save_parameters").onclick = function(){
        rule_parameters = new parameters();
        rule_parameters.save();

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
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    document.getElementById("myCanvas").width = 210*mmtopx
    document.getElementById("myCanvas").height = 277*mmtopx
}

var showDebug = function(){
    console.info("--All the variables---")
    console.info(ruler);//prints all attributes of ruler object

}

function parameters() {
    this.save = function(){
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

        // Put the object into storage
        d = new Date();
        localStorage.setItem('parametres_' + 
            ("00" + d.getDate()).slice(-2)+
            ("00" + (d.getMonth() + 1)).slice(-2) +
            d.getFullYear() + " - " +
            ("00" + d.getHours()).slice(-2) +
            ("00" + d.getMinutes()).slice(-2) +
            ("00" + d.getSeconds()).slice(-2), JSON.stringify(this));
    };


};

//coeff to multiply mm to get pixels (for reference, not used)
var pxtomm = 0.264583;
//coeff to multiply pixels to get millimeters
var mmtopx = 3.779528;
var CORRECT_VERTICAL_POSITION_SCALE = 100;
var Starting_abscissa = 20;
var new_scale_abscissa_addx = 40;
var debug = true;

var array_ruler = [];


function ruler(abcissa) {
    this.abscissa = abcissa;
    this.MIN_ALCOHOL_VALUE = 3.5;
    this.MAX_ALCOHOL_VALUE = 18;
    this.ALCOHOL_INCREMENT = 0.5;
    this.arrayTickValues =[];
    this.arrayAlcoholValues=[];

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
            //console.log(this.displayVerticalLine)
            var line = new paper.Path.Line([this.abscissa*mmtopx, CORRECT_VERTICAL_POSITION_SCALE], [this.abscissa*mmtopx, this.arrayTickValues[this.low]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE]);//actual line instance
            console.log('down : '+ this.arrayTickValues[this.low]*mmtopx);
            line.strokeColor = ScaleColor.value;//color of ruler line
            line.strokeWidth = "1";//width of ruler line in pixels
        }
    };

    this.showBorders = function(){
        if(this.displayBorders){
            var rectangle = new paper.Rectangle(new paper.Point(0, 0), new paper.Size((this.abscissa+20)*mmtopx, 200*mmtopx));
            var path = new paper.Path.Rectangle(rectangle);
            path.strokeColor = 'black';
            }
    };
    this.buildRuler = function() {
        //this.updateVariables();
        console.log(this.high);
        this.loadArraydensity();
        this.loadArrayalcohol();
        this.displayAlcoholruler();
        this.displayDensityruler();
        this.displayText();
        this.showBorders();
        this.showVerticalline();
    }
    this.loadArraydensity = function() {
        //Loads every volumic mass values in an array
        for (i = this.high; i <= this.low; i+=this.increment) {
            this.arrayTickValues[i]=0.0000009009960777*Math.pow(i,3) - 0.003811527044*Math.pow(i,2) + 6.042122602*i - 3025.189377
            }
        //scaling to the wished size. see https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
        for (i = this.high; i <= this.low; i+=this.increment) {
            this.arrayTickValues[i]= (this.size/(this.low - this.high))*this.arrayTickValues[i] - (this.size*this.arrayTickValues[this.high])/(this.low - this.high) + this.arrayTickValues[this.high]
            if(i != this.high) {this.arrayTickValues[i] = this.arrayTickValues[i]-this.arrayTickValues[this.high]}
            }
        if(debug) {console.log(this.arrayTickValues)};
    }

    this.loadArrayalcohol = function() {
        //loads every alcohol values in an array
        for (i = this.MIN_ALCOHOL_VALUE; i <= this.MAX_ALCOHOL_VALUE; i+=this.ALCOHOL_INCREMENT) {
            this.arrayAlcoholValues[i]=0.0004304317136*Math.pow(i,3) - 0.0228699357*Math.pow(i,2) + 6.744733982*i + 116.0588879
            this.arrayAlcoholValues[i]= (this.size/(this.low - this.high))*this.arrayAlcoholValues[i] - (this.size*this.arrayTickValues[this.high])/(this.low - this.high) + this.arrayTickValues[this.high]
            if(i != this.high) {this.arrayAlcoholValues[i] = this.arrayAlcoholValues[i]-this.arrayTickValues[this.high]}
            }
        if(debug) {console.log(this.arrayAlcoholValues)};
        this.arrayTickValues[this.high] = 0;
    }

    this.displayAlcoholruler = function() {
        var j=0;
        for (i = this.MIN_ALCOHOL_VALUE; i <= this.MAX_ALCOHOL_VALUE; i+=this.ALCOHOL_INCREMENT) {
                j+=5;
                if(i%1==0){
                    var ticks = new paper.Path.Line({
                        from: [this.abscissa*mmtopx+this.line2length*mmtopx, this.arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                        to: [this.abscissa*mmtopx, this.arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                        strokeColor: ScaleColor.value
                    });
                    var text = new paper.PointText(new paper.Point(this.abscissa*mmtopx+7,this.arrayAlcoholValues[i]*mmtopx -5 + CORRECT_VERTICAL_POSITION_SCALE));
                    text.justification = 'left';
                    text.fillColor = ScaleColor.value;
                    text.content = i;
                }
                else{
                    var ticks = new paper.Path.Line({
                        from: [this.abscissa*mmtopx+this.line3length*mmtopx, this.arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                        to: [this.abscissa*mmtopx, this.arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                        strokeColor: ScaleColor.value
                    });
                }
            }
    }

    this.displayDensityruler = function() {
    var j=0
    for (i = this.high; i <= this.low; i++) {
            j+=5;
            if(i%10==0.0 && i>=this.high){
                if(i == this.high){
                    console.log('Cool'+this.arrayTickValues[i]*mmtopx +'and '+ CORRECT_VERTICAL_POSITION_SCALE);
                    }
                var ticks = new paper.Path.Line({
                    from: [this.abscissa*mmtopx-this.line1length*mmtopx, this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [this.abscissa*mmtopx, this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: this.checkIfSpecialValue(this, this.arrayListSpecialValues, this.arraySpecialValues, i),
                    strokeWidth : this.line1size
                });
                var text = new paper.PointText(new paper.Point(this.abscissa*mmtopx-30+19,this.arrayTickValues[i]*mmtopx -2 + CORRECT_VERTICAL_POSITION_SCALE));
                text.justification = 'right';
                text.fillColor = ScaleColor.value;
                text.content = i;
            }
            else if(i%5==0){
                var ticks = new paper.Path.Line({
                    from: [this.abscissa*mmtopx-this.line2length*mmtopx, this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [this.abscissa*mmtopx, this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: ScaleColor.value,
                    strokeWidth : this.line2size
                });
            }
            else{
                var ticks = new paper.Path.Line({
                    from: [this.abscissa*mmtopx-this.line3length*mmtopx, this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    to: [this.abscissa*mmtopx, this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE],
                    strokeColor: ScaleColor.value,
                    strokeWidth : this.line3size
                });
            }
        }
    }

    this.checkIfSpecialValue = function(ruler, arrayListSpecialValues, arraySpecialValues, valueToBeChecked){
        if (ruler.arrayListSpecialValues.includes(valueToBeChecked)){
            color = ruler.arraySpecialValues[valueToBeChecked];
        }
        else {
            color =ScaleColor.value;
        }
        return color;
    }

    this.displayText = function() {
        var text = new paper.PointText(new paper.Point(this.abscissa*mmtopx-70,this.arrayTickValues[this.low]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE));
        text.justification = 'left';
        text.fillColor = ScaleColor.value;
        text.content = "Masse volumique";
        text.rotation=-90;

        var text = new paper.PointText(new paper.Point(this.abscissa*mmtopx-45,this.arrayTickValues[this.low]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE));
        text.justification = 'left';
        text.fillColor = ScaleColor.value;
        text.content = "g/l (05) 20ºC";
        text.rotation=-90;

        var text = new paper.PointText(new paper.Point(this.abscissa*mmtopx-35,this.arrayTickValues[this.low]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE));
        text.justification = 'left';
        text.fillColor = ScaleColor.value;
        text.content = "Alcool probable";
        text.rotation=-90;

        var text = new paper.PointText(new paper.Point(this.abscissa*mmtopx-30+19,this.arrayTickValues[this.low]*mmtopx +120 + CORRECT_VERTICAL_POSITION_SCALE));
        text.justification = 'center';
        text.fillColor = ScaleColor.value;
        text.content = "MUSTIMETRIE";

        var text = new paper.PointText(new paper.Point(this.abscissa*mmtopx-30+19,this.arrayTickValues[this.low]*mmtopx +140 + CORRECT_VERTICAL_POSITION_SCALE));
        text.justification = 'center';
        text.fillColor = ScaleColor.value;
        text.content = "COMPANY";

        var text = new paper.PointText(new paper.Point(this.abscissa*mmtopx-30+19,this.arrayTickValues[this.low]*mmtopx +160 + CORRECT_VERTICAL_POSITION_SCALE));
        text.justification = 'center';
        text.fillColor = ScaleColor.value;
        text.content = "NAME";

        var text = new paper.PointText(new paper.Point(this.abscissa*mmtopx+10,this.arrayAlcoholValues[this.MIN_ALCOHOL_VALUE]*mmtopx -100 + CORRECT_VERTICAL_POSITION_SCALE));
        text.justification = 'center';
        text.fillColor = ScaleColor.value;
        text.content = "1683 grammes de sucre par hecto";
        text.rotation=-90;

        var text = new paper.PointText(new paper.Point(this.abscissa*mmtopx +20,this.arrayAlcoholValues[this.MIN_ALCOHOL_VALUE]*mmtopx -100 + CORRECT_VERTICAL_POSITION_SCALE));
        text.justification = 'center';
        text.fillColor = ScaleColor.value;
        text.content = "produisent 1% d'alcool";
        text.rotation=-90;

    }

}
var load_parameters = function(parameters){
        
        parameter_list = window.localStorage.getItem(parameters);

        parameter_list = JSON.parse(parameter_list);
        console.log(parameter_list.low);        
        
        document.getElementById("rulerHigh").value=parameter_list.high
        document.getElementById("rulerLow").value=parameter_list.low
        document.getElementById("Increment").value=parameter_list.increment
        document.getElementById("rulerStart").value=parameter_list.start
        document.getElementById("rulerStop").value=parameter_list.stop
        document.getElementById("line1length").value=parameter_list.line1length
        document.getElementById("line1size").value=parameter_list.line1size
        document.getElementById("line2length").value=parameter_list.line2length
        document.getElementById("line2size").value=parameter_list.line2size
        document.getElementById("line3length").value=parameter_list.line3length
        document.getElementById("line3size").value=parameter_list.line3size
        document.getElementById("lineAvalue").value=parameter_list.lineAvalue
        document.getElementById("lineBvalue").value=parameter_list.lineBvalue
        document.getElementById("lineCvalue").value=parameter_list.lineCvalue
/*        displayVerticalLine = document.getElementById("displayVerticalLine").checked;
        displayBorders = document.getElementById("displayBorders").checked;
        
        arrayListSpecialValues = [lineAvalue, lineBvalue, lineCvalue];
        arraySpecialValues = [];
        arraySpecialValues[lineAvalue] = lineAcolor.value;
        arraySpecialValues[lineBvalue] = lineBcolor.value;
        arraySpecialValues[lineCvalue] = lineCcolor.value;
        exportButton= document.getElementById('export-button'=*/
        var index, len;
        resizeCanvas()
        current_ruler.updateVariables();
        for (index = 0, len = array_ruler.length; index < len; ++index) {
            array_ruler[index].buildRuler();
        }
        paper.view.draw();
        if(debug) {showDebug();}//prints all values to browser console

    }; 

var show_parameters_list = function(){

        // Retrieve the object from storage
        //console.log('retrievedObject: ', JSON.parse(loaded_parameters));
        var tableRef = document.getElementById('parameters_table').getElementsByTagName('tbody')[0];

        var i = 0,
        oJson = {},
        sKey;
        for (; sKey = window.localStorage.key(i); i++) {
            oJson[sKey] = window.localStorage.getItem(sKey);
            console.log(oJson);
            console.log(sKey);
            // Insert a row in the table at the last row
            var newRow   = tableRef.insertRow(tableRef.rows.length);
            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            cell1.innerHTML = sKey;
            cell2.innerHTML = '<button class="btn" onclick="load_parameters(\''+sKey+'\')">Restaurer</a>'
        }
    };
$(document).ready(function(){
    show_parameters_list();
    //When document is loaded, call build once
    resizeCanvas()
    var ruler1 = new ruler(Starting_abscissa);
    current_ruler=ruler1;
    current_ruler.updateVariables();
    current_ruler.buildRuler();
    array_ruler.push(current_ruler);
    paper.view.draw();
    if(debug) {showDebug();}//prints all values to browser console
    
    var tableRef = document.getElementById('rulers_table').getElementsByTagName('tbody')[0];

    // Insert a row in the table at the last row
    var newRow   = tableRef.insertRow(tableRef.rows.length);

    // Insert a cell in the row at index 0

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);       
    cell1.innerHTML = "uniqueID";
    cell2.innerHTML = parseInt(document.getElementById("rulerSize").value);
    cell3.innerHTML = '<img src="img/glyphicons-17-bin.png" />'
    $("#rulerParameters" ).change(function() {
        //anytime anything within the form is altered, call build again
        var index, len;
        resizeCanvas()
        current_ruler.updateVariables();
        for (index = 0, len = array_ruler.length; index < len; ++index) {
            array_ruler[index].buildRuler();
        }
        paper.view.draw();
        if(debug) {showDebug();}//prints all values to browser console
    });
});