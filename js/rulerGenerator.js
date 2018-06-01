//coeff to multiply pixels to get millimeters (inverse pxtomm = 0.264583)
var mmtopx = 3.779528;
var CORRECT_VERTICAL_POSITION_SCALE = 100;
var startX = 20;
var new_scale_abscissa_addx = 40;
var debug = false;
var array_ruler = [];

$(document).ready(function(){
    display_parameters_list();
    //When document is loaded, call build once
    resizeCanvas();
    var ruler1 = new ruler(0,startX);
    current_ruler=ruler1;
    current_ruler.updateVariables();
    current_ruler.buildRuler();
    array_ruler.push(current_ruler);
    console.log(array_ruler);
    paper.view.draw();
    if(debug) {displayDebug();}//prints all values to browser console
    
    arrayCells = ["uniqueID",parseInt(document.getElementById("rulerSize").value),'<a onclick="removeScale('+0+')"><img src="img/glyphicons-17-bin.png" /></a>']
    insertTableRow('rulers_table',"row0",arrayCells);

    $("#rulerParameters" ).change(function() {
        refreshCanvas(current_ruler);
    });
});

document.addEventListener("DOMContentLoaded", function(event) {

    document.getElementById("download_to_svg").onclick = function(){
    var fileName = "Scale_" + getFormatteddate() + ".svg"
    var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
    };
    document.getElementById("add_scale").onclick = function(){

    resizeCanvas()
    var new_ruler = new ruler(array_ruler.length,current_ruler.abscissa + new_scale_abscissa_addx);
    new_ruler.updateVariables();
    
    console.log(array_ruler);
    len = array_ruler.push(new_ruler);
    var index;
    for (0; index < len; ++index) {
        array_ruler[index].buildRuler();
    };
    paper.view.draw();

    arrayCells = ["uniqueID",parseInt(document.getElementById("rulerSize").value),'<a onclick="removeScale('+(array_ruler.length-1)+')"><img src="img/glyphicons-17-bin.png" /></a>']
    insertTableRow('rulers_table',"row"+(document.getElementById("rulers_table").rows.length-1).toString(), arrayCells);
    }
    document.getElementById("save_parameters").onclick = function(){
        rule_parameters = new parameters();
        rule_parameters.save();
    };
});

var insertTableRow = function(tableID, rowId, arrayCells){
    //insert a row in a table.
    var tableRef = document.getElementById(tableID).getElementsByTagName('tbody')[0];
    // Insert a row in the table at the last row
    var newRow   = tableRef.insertRow(tableRef.rows.length);
    newRow.id = rowId
    // Insert a cell in the row at index 0
    for (var i = 0; i < arrayCells.length; i++) {
    //Do something
        var cell = newRow.insertCell(i);
        cell.innerHTML = arrayCells[i];
    }
};

function deleteTableRow(tableID, rowID) {
    //delete a row in a table.
    var i = document.getElementById(rowID).rowIndex;
    document.getElementById(tableID).deleteRow(i);
};

var printDiv = function() {
    //print only the canvas
    var printContents = document.getElementById("printingZone").innerHTML;
     console.log(printContents);
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
};

var resizeCanvas = function(){
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    document.getElementById("myCanvas").width = 210*mmtopx
    document.getElementById("myCanvas").height = 277*mmtopx
};

var displayDebug = function(){
    //print the debug infos in console
    console.info("--All the variables---")
    console.info(ruler);
};

var load_parameters = function(parameters){        
        parameter_list = window.localStorage.getItem(parameters);
        parameter_list = JSON.parse(parameter_list);
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
        document.getElementById("displayVerticalLine").checked=parameter_list.displayVerticalLine;
        document.getElementById("displayBorders").checked=parameter_list.displayBorders;
        document.getElementById("lineAcolor").value = parameter_list.lineAcolor;
        document.getElementById("lineBcolor").value = parameter_list.lineBcolor;
        document.getElementById("lineCcolor").value = parameter_list.lineCcolor;
        
        resizeCanvas()
        current_ruler.updateVariables();
        
        var index, len;
        for (index = 0, len = array_ruler.length; index < len; ++index) {
            array_ruler[index].buildRuler();
        }
        paper.view.draw();
        if(debug) {displayDebug();}//prints all values to browser console
}; 

var display_parameters_list = function(){
        var i = 0,
        oJson = {},
        sKey;
        for (; sKey = window.localStorage.key(i); i++) {
            oJson[sKey] = window.localStorage.getItem(sKey);
            arrayCells = [sKey,'<button class="btn" onclick="load_parameters(\''+sKey+'\')">Restaurer</a>']
            insertTableRow('parameters_table',"row"+i.toString(),arrayCells);
        }
};
var removeScale = function(id){

    array_ruler.pop(current_ruler)
    refreshCanvas();
    deleteTableRow("rulers_table","row"+id)
};

var refreshCanvas = function(current_ruler){
    //anytime anything within the form is altered, call build again
    var index, len;
    resizeCanvas()
    current_ruler.updateVariables();
    for (index = 0, len = array_ruler.length; index < len; ++index) {
        array_ruler[index].buildRuler();
    }
    paper.view.draw();
    if(debug) {displayDebug();}//prints all values to browser console
};

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
        localStorage.setItem('parametres_' + getFormatteddate()
            , JSON.stringify(this));
        show_parameters_list();
    };
};
function getFormatteddate(){
    formattedDate = ("00" + d.getDay()).slice(-2)+
            ("00" + (d.getMonth() + 1)).slice(-2) +
            d.getFullYear() + " - " +
            ("00" + d.getHours()).slice(-2) +
            ("00" + d.getMinutes()).slice(-2) +
            ("00" + d.getSeconds()).slice(-2)
    return formattedDate;
}
function ruler(id, abcissa) {
    this.id=id;
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
        this.VerticalLine = document.getElementById("displayVerticalLine").checked;
        this.Borders = document.getElementById("displayBorders").checked;
        this.arrayListSpecialValues = [this.lineAvalue, this.lineBvalue, this.lineCvalue];
        this.arraySpecialValues = [];
        this.arraySpecialValues[this.lineAvalue] = lineAcolor.value;
        this.arraySpecialValues[this.lineBvalue] = lineBcolor.value;
        this.arraySpecialValues[this.lineCvalue] = lineCcolor.value;
        this.exportButton= document.getElementById('export-button');
    };

    this.buildRuler = function() {
        this.loadArraydensity();
        this.loadArrayalcohol();
        this.displayAlcoholruler();
        this.displayDensityruler();
        this.displayAlltexts();
        this.displayBorders();
        this.displayVerticalline();
    };

    this.loadArraydensity = function() {
        //Loads every volumic mass values in an array
        for (i = this.high; i <= this.low; i+=this.increment) {
            //regression polynomial to make the spacing between ticks progressive.
            this.arrayTickValues[i]=0.0000009009960777*Math.pow(i,3) - 0.003811527044*Math.pow(i,2) + 6.042122602*i - 3025.189377
            }
        //scaling the whole scale to the correct value. see https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
        for (i = this.high; i <= this.low; i+=this.increment) {
            this.arrayTickValues[i]= (this.size/(this.low - this.high))*this.arrayTickValues[i] - (this.size*this.arrayTickValues[this.high])/(this.low - this.high) + this.arrayTickValues[this.high]
            //bringing back the value to start with a first value to 0
            if(i != this.high) {this.arrayTickValues[i] = this.arrayTickValues[i]-this.arrayTickValues[this.high]}
            }
        if(debug) {console.log(this.arrayTickValues)};
    };

    this.loadArrayalcohol = function() {
        //loads every alcohol values in an array
        for (i = this.MIN_ALCOHOL_VALUE; i <= this.MAX_ALCOHOL_VALUE; i+=this.ALCOHOL_INCREMENT) {
            //regression polynomial to make the spacing between ticks progressive.
            this.arrayAlcoholValues[i]=0.0004304317136*Math.pow(i,3) - 0.0228699357*Math.pow(i,2) + 6.744733982*i + 116.0588879
            //scaling the whole scale to the correct value.
            this.arrayAlcoholValues[i]= (this.size/(this.low - this.high))*this.arrayAlcoholValues[i] - (this.size*this.arrayTickValues[this.high])/(this.low - this.high) + this.arrayTickValues[this.high]
            //bringing back the value to start with a first value to 0
            if(i != this.high) {this.arrayAlcoholValues[i] = this.arrayAlcoholValues[i]-this.arrayTickValues[this.high]}
            }
            this.arrayTickValues[this.high] = 0;
        if(debug) {console.log(this.arrayAlcoholValues)}; 
    };

    var displayText = function(message, x, y, justification, rotation, color){
        //displays a text using paperjs
        var text = new paper.PointText(new paper.Point(x,y));
        text.content = message;
        text.justification = justification;
        text.fillColor = color;
        text.rotation=rotation;
    };

    var displayLine = function(xA, yA, xB, yB, thickness, color){
        //displays a line using paperjs
        var tick = new paper.Path.Line([xA,yA],[xB,yB]);//actual line instance
        tick.strokeColor = color;//color of ruler line
        tick.strokeWidth = thickness;//width of ruler line in pixels                    
    };

    this.displayVerticalline = function(){
        //displays the vertical line of a ruler
        if(this.VerticalLine){
            displayLine(this.abscissa*mmtopx, CORRECT_VERTICAL_POSITION_SCALE,this.abscissa*mmtopx, this.arrayTickValues[this.low]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,"1",ScaleColor.value);
        }
    };

    this.displayBorders = function(){
        //displays the borders of a ruler
        if(this.Borders){
            var rectangle = new paper.Rectangle(new paper.Point(0, 0), new paper.Size((this.abscissa+20)*mmtopx, 200*mmtopx));
            var path = new paper.Path.Rectangle(rectangle);
            path.strokeColor = 'black';
            }
    };

    this.displayAlcoholruler = function() {
        //displays the alcohol side of a ruler
        var j=0;
        for (i = this.MIN_ALCOHOL_VALUE; i <= this.MAX_ALCOHOL_VALUE; i+=this.ALCOHOL_INCREMENT) {
                j+=5;
                if(i%1==0){
                    displayLine(this.abscissa*mmtopx+this.line2length*mmtopx,
                        this.arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                        this.abscissa*mmtopx,
                        this.arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                        "1",
                        ScaleColor.value);
                    displayText(i,this.abscissa*mmtopx+7,this.arrayAlcoholValues[i]*mmtopx -5 + CORRECT_VERTICAL_POSITION_SCALE,"left",0,ScaleColor.value);
                }
                else{
                    displayLine(this.abscissa*mmtopx+this.line3length*mmtopx,
                        this.arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                        this.abscissa*mmtopx,
                        this.arrayAlcoholValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                        "1",
                        ScaleColor.value);
                }
            }
    };

    this.displayDensityruler = function() {
        //displays the density side of a ruler
        var j=0
        for (i = this.high; i <= this.low; i++) {
                j+=5;
                if(i%10==0.0 && i>=this.high){
                    displayLine(this.abscissa*mmtopx-this.line1length*mmtopx,
                        this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                        this.abscissa*mmtopx, 
                        this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                        this.line1size,
                        this.displaySpecialValue(this, this.arrayListSpecialValues, this.arraySpecialValues, i));
                    displayText(i,this.abscissa*mmtopx-30+19,this.arrayTickValues[i]*mmtopx -2 + CORRECT_VERTICAL_POSITION_SCALE,"right",0,ScaleColor.value);
                }
                else if(i%5==0){
                    displayLine(this.abscissa*mmtopx-this.line2length*mmtopx,
                        this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                        this.abscissa*mmtopx,
                        this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                        this.line1size,
                        this.displaySpecialValue(this, this.arrayListSpecialValues, this.arraySpecialValues, i));
                }
                else{
                    displayLine(this.abscissa*mmtopx-this.line3length*mmtopx,
                        this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                        this.abscissa*mmtopx,
                        this.arrayTickValues[i]*mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                        this.line1size,
                        this.displaySpecialValue(this, this.arrayListSpecialValues, this.arraySpecialValues, i));
                }
            }
    };

    this.displaySpecialValue = function(ruler, arrayListSpecialValues, arraySpecialValues, valueToBeChecked){
        //check if a value needs to be displayed with a special color.
        if (ruler.arrayListSpecialValues.includes(valueToBeChecked)){
            color = ruler.arraySpecialValues[valueToBeChecked];
        }
        else {
            color =ScaleColor.value;
        }
        return color;
    };

    this.displayAlltexts = function() {
        //Displays fixed texts for a rule.
        displayText("Masse volumique",this.abscissa*mmtopx-70,this.arrayTickValues[this.low]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE,"left",-90,ScaleColor.value);
        displayText("g/l (05) 20ºC",this.abscissa*mmtopx-45,this.arrayTickValues[this.low]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE,"left",-90,ScaleColor.value);
        displayText("Alcool probable",this.abscissa*mmtopx-35,this.arrayTickValues[this.low]*mmtopx +60 + CORRECT_VERTICAL_POSITION_SCALE,"left",-90,ScaleColor.value);
        displayText("MUSTIMETRIE",this.abscissa*mmtopx-11,this.arrayTickValues[this.low]*mmtopx +120 + CORRECT_VERTICAL_POSITION_SCALE,"center",0,ScaleColor.value);
        displayText("COMPANY",this.abscissa*mmtopx-11,this.arrayTickValues[this.low]*mmtopx +140 + CORRECT_VERTICAL_POSITION_SCALE,"center",0,ScaleColor.value);
        displayText("NAME",this.abscissa*mmtopx-11,this.arrayTickValues[this.low]*mmtopx +160 + CORRECT_VERTICAL_POSITION_SCALE,"center",0,ScaleColor.value);
        displayText("1683 grammes de sucre par hecto",this.abscissa*mmtopx+10,this.arrayAlcoholValues[this.MIN_ALCOHOL_VALUE]*mmtopx -100 + CORRECT_VERTICAL_POSITION_SCALE,"center",-90,ScaleColor.value);
        displayText("produisent 1% d'alcool",this.abscissa*mmtopx +20,this.arrayAlcoholValues[this.MIN_ALCOHOL_VALUE]*mmtopx -100 + CORRECT_VERTICAL_POSITION_SCALE,"center",-90,ScaleColor.value);
    };
};
