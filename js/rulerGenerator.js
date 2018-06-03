//coeff to multiply pixels to get millimeters (inverse pxtomm = 0.264583)
var mmtopx = 3.779528;
var CORRECT_VERTICAL_POSITION_SCALE = 100;
var startX = 20;
var new_scale_abscissa_addx = 40;
var debug = true;
var array_ruler = [];

$(document).ready(function() {
    //puild the parameter list
    var parameter = new parameters();
    parameter.display();
    //build the rulers
    var ruler1 = new ruler(0, startX);
    ruler1.updateVariables();
    array_ruler.push(ruler1);
    drawAllrulers();
    //build the ruler list
    var scalelist = new scale_list();
    scalelist.display();

    if (debug) {
        displayDebug();
    } //prints all values to browser console
});

document.addEventListener("DOMContentLoaded", function(event) {

    document.getElementById("download_to_svg").onclick = function() {
        //download SVG file button
        var fileName = "Scale_" + getFormatteddate() + ".svg";
        var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({
            asString: true
        }));
        var link = document.createElement("a");
        link.download = fileName;
        link.href = url;
        link.click();
    };

    document.getElementById("rulerParameters").onchange = function() {
        array_ruler[array_ruler.length - 1].updateVariables();
        drawAllrulers();

        scalelist = new scale_list();
        scalelist.display();
    };

    document.getElementById("add_scale").onclick = function() {
        //Add a new scale button
        var new_ruler = new ruler(array_ruler.length, array_ruler[array_ruler.length - 1].abscissa + new_scale_abscissa_addx);
        array_ruler.push(new_ruler);
        new_ruler.updateVariables();
        drawAllrulers();

        //Update Scale list
        scalelist = new scale_list();
        scalelist.display();
    };

    document.getElementById("save_parameters").onclick = function() {
        //Update rule parameters
        rule_parameters = new parameters();
        rule_parameters.save();
    };
});

var insertTableRow = function(tableID, rowId, arrayCells) {
    //insert a row in a table.
    var tableRef = document.getElementById(tableID).getElementsByTagName("tbody")[0];
    // Insert a row in the table at the last row
    var newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.id = rowId;
    var cell;
    // Insert a cell in the row at index 0
    for (i = 0; i < arrayCells.length; i+=1) {
        //Do something
        cell = newRow.insertCell(i);
        cell.innerHTML = arrayCells[i];
    }
};

function drawAllrulers() {
    //update all abscissas origin and re-displays all the rulers.
    // Get a reference to the canvas object
    var canvas = document.getElementById("myCanvas");
    // Create an empty project and a view for the canvas
    paper.setup(canvas);
    len = array_ruler.length;
    var index;
    for (index = 0; index < len; index+=1) {
        array_ruler[index].abscissa = startX + index * new_scale_abscissa_addx;
        array_ruler[index].buildRuler();
    }
    paper.view.draw();
}

var printDiv = function() {
    window.print();
};

var displayDebug = function() {
    //print the debug infos in console
    console.info("--All the variables---");
    console.info(array_ruler);
};

var load_parameters = function(parameters) {
    parameter_list = window.localStorage.getItem(parameters);
    parameter_list = JSON.parse(parameter_list);
    document.getElementById("rulerHigh").value = parameter_list.high;
    document.getElementById("rulerLow").value = parameter_list.low;
    document.getElementById("Increment").value = parameter_list.increment;
    document.getElementById("rulerStart").value = parameter_list.start;
    document.getElementById("rulerStop").value = parameter_list.stop;
    document.getElementById("line1length").value = parameter_list.line1length;
    document.getElementById("line1size").value = parameter_list.line1size;
    document.getElementById("line2length").value = parameter_list.line2length;
    document.getElementById("line2size").value = parameter_list.line2size;
    document.getElementById("line3length").value = parameter_list.line3length;
    document.getElementById("line3size").value = parameter_list.line3size;
    document.getElementById("lineAvalue").value = parameter_list.lineAvalue;
    document.getElementById("lineBvalue").value = parameter_list.lineBvalue;
    document.getElementById("lineCvalue").value = parameter_list.lineCvalue;
    document.getElementById("displayVerticalLine").checked = parameter_list.displayVerticalLine;
    document.getElementById("displayBorders").checked = parameter_list.displayBorders;
    document.getElementById("lineAcolor").value = parameter_list.lineAcolor;
    document.getElementById("lineBcolor").value = parameter_list.lineBcolor;
    document.getElementById("lineCcolor").value = parameter_list.lineCcolor;

    drawAllrulers();
    paper.view.draw();
    if (debug) {
        displayDebug();
    } //prints all values to browser console
};


var removeScale = function(id) {
    var index = $.inArray(id, array_ruler);
    array_ruler.splice(index, 1);
    drawAllrulers();

    scalelist = new scale_list();
    scalelist.display();
};

function getFormatteddate() {
    d = new Date();
    formattedDate = ("00" + d.getDay()).slice(-2) +
        ("00" + (d.getMonth() + 1)).slice(-2) +
        d.getFullYear() + " - " +
        ("00" + d.getHours()).slice(-2) +
        ("00" + d.getMinutes()).slice(-2) +
        ("00" + d.getSeconds()).slice(-2);
    return formattedDate;
}

function scale_list() {
    this.display = function() {
        $("#rulers_table tbody tr").remove();

        var index;
        var len = array_ruler.length;
        for (index = 0; index < len; index+=1) {
            arrayCells = ["uniqueID" + index, array_ruler[index].size, '<a onclick="removeScale(' + array_ruler[index].id + ')"><img src="img/glyphicons-17-bin.png" /></a>'];
            insertTableRow("rulers_table", "row" + index, arrayCells);
        }
    };
}

function parameters() {
    this.save = function() {
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
        this.exportButton = document.getElementById("export-button");

        // Put the object into storage
        localStorage.setItem("parametres_" + getFormatteddate(), JSON.stringify(this));
        this.display();
    };

    this.display = function() {
        var i = 0;
        var oJson = {};
        var sKey;
        for (; sKey = window.localStorage.key(i); i+=1) {
            oJson[sKey] = window.localStorage.getItem(sKey);
            arrayCells = [sKey, '<button class="btn" onclick="load_parameters(\'' + sKey + '\')">Restaurer</a>']
            insertTableRow("parameters_table", "row" + i.toString(), arrayCells);
        }
    };
    this.load = function() {


    }
};

function ruler(id, abscissa) {
    this.id = id;
    this.abscissa = abscissa;
    this.MIN_ALCOHOL_VALUE = 3.5;
    this.MAX_ALCOHOL_VALUE = 18;
    this.ALCOHOL_INCREMENT = 0.5;
    this.arrayTickValues = [];
    this.arrayAlcoholValues = [];

    this.updateVariables = function() {
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
        this.exportButton = document.getElementById("export-button");
        this.scaleColor = ScaleColor.value;
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
        for (i = this.high; i <= this.low; i += this.increment) {
            //regression polynomial to make the spacing between ticks progressive.
            this.arrayTickValues[i] = 0.0000009009960777 * Math.pow(i, 3) - 0.003811527044 * Math.pow(i, 2) + 6.042122602 * i - 3025.189377;
        }
        //scaling the whole scale to the correct value. see https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
        for (i = this.high; i <= this.low; i += this.increment) {
            this.arrayTickValues[i] = (this.size / (this.low - this.high)) * this.arrayTickValues[i] - (this.size * this.arrayTickValues[this.high]) / (this.low - this.high) + this.arrayTickValues[this.high];
            //bringing back the value to start with a first value to 0
            if (i != this.high) {
                this.arrayTickValues[i] = this.arrayTickValues[i] - this.arrayTickValues[this.high];
            }
        }
        if (debug) {
            console.log(this.arrayTickValues);
        };
    };

    this.loadArrayalcohol = function() {
        //loads every alcohol values in an array
        for (i = this.MIN_ALCOHOL_VALUE; i <= this.MAX_ALCOHOL_VALUE; i += this.ALCOHOL_INCREMENT) {
            //regression polynomial to make the spacing between ticks progressive.
            this.arrayAlcoholValues[i] = 0.0004304317136 * Math.pow(i, 3) - 0.0228699357 * Math.pow(i, 2) + 6.744733982 * i + 116.0588879
            //scaling the whole scale to the correct value.
            this.arrayAlcoholValues[i] = (this.size / (this.low - this.high)) * this.arrayAlcoholValues[i] - (this.size * this.arrayTickValues[this.high]) / (this.low - this.high) + this.arrayTickValues[this.high]
            //bringing back the value to start with a first value to 0
            if (i != this.high) {
                this.arrayAlcoholValues[i] = this.arrayAlcoholValues[i] - this.arrayTickValues[this.high]
            }
        }
        this.arrayTickValues[this.high] = 0;
        if (debug) {
            console.log(this.arrayAlcoholValues);
        };
    };

    this.displayText = function(message, x, y, justification, rotation, color) {
        //displays a text using paperjs
        var text = new paper.PointText(new paper.Point(x, y));
        text.content = message;
        text.justification = justification;
        text.fillColor = color;
        text.rotation = rotation;
    };

    this.displayLine = function(xA, yA, xB, yB, thickness, color) {
        //displays a line using paperjs
        var tick = new paper.Path.Line([xA, yA], [xB, yB]);
        //color of ruler line
        tick.strokeColor = color;
        //width of ruler line in pixels
        tick.strokeWidth = thickness;
    };

    this.displayVerticalline = function() {
        //displays the vertical line of a ruler
        if (this.VerticalLine) {
            this.displayLine(this.abscissa * mmtopx, CORRECT_VERTICAL_POSITION_SCALE, this.abscissa * mmtopx, this.arrayTickValues[this.low] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE, "1", this.scaleColor);
        }
    };

    this.displayBorders = function() {
        //displays the borders of a ruler
        if (this.Borders) {
            var rectangle = new paper.Rectangle(new paper.Point((this.abscissa - 20) * mmtopx, 0), new paper.Size(40 * mmtopx, (this.arrayTickValues[this.low] + 80) * mmtopx));
            var path = new paper.Path.Rectangle(rectangle);
            path.strokeColor = "black";
        }
    };

    this.displayAlcoholruler = function() {
        //displays the alcohol side of a ruler
        var j = 0;
        for (i = this.MIN_ALCOHOL_VALUE; i <= this.MAX_ALCOHOL_VALUE; i += this.ALCOHOL_INCREMENT) {
            j += 5;
            if (i % 1 == 0) {
                this.displayLine(this.abscissa * mmtopx + this.line2length * mmtopx,
                    this.arrayAlcoholValues[i] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                    this.abscissa * mmtopx,
                    this.arrayAlcoholValues[i] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                    "1",
                    this.scaleColor);
                this.displayText(i, this.abscissa * mmtopx + 7, this.arrayAlcoholValues[i] * mmtopx - 5 + CORRECT_VERTICAL_POSITION_SCALE, "left", 0, this.scaleColor);
            } else {
                this.displayLine(this.abscissa * mmtopx + this.line3length * mmtopx,
                    this.arrayAlcoholValues[i] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                    this.abscissa * mmtopx,
                    this.arrayAlcoholValues[i] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                    "1",
                    this.scaleColor);
            }
        }
    };

    this.displayDensityruler = function() {
        //displays the density side of a ruler
        var j = 0
        for (i = this.high; i <= this.low; i+=1) {
            j += 5;
            if (i % 10 == 0.0 && i >= this.high) {
                this.displayLine(this.abscissa * mmtopx - this.line1length * mmtopx,
                    this.arrayTickValues[i] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                    this.abscissa * mmtopx,
                    this.arrayTickValues[i] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                    this.line1size,
                    this.displaySpecialValue(this, this.arrayListSpecialValues, this.arraySpecialValues, i));
                this.displayText(i, this.abscissa * mmtopx - 30 + 19, this.arrayTickValues[i] * mmtopx - 2 + CORRECT_VERTICAL_POSITION_SCALE, "right", 0, this.scaleColor);
            } else if (i % 5 == 0) {
                this.displayLine(this.abscissa * mmtopx - this.line2length * mmtopx,
                    this.arrayTickValues[i] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                    this.abscissa * mmtopx,
                    this.arrayTickValues[i] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                    this.line1size,
                    this.displaySpecialValue(this, this.arrayListSpecialValues, this.arraySpecialValues, i));
            } else {
                this.displayLine(this.abscissa * mmtopx - this.line3length * mmtopx,
                    this.arrayTickValues[i] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                    this.abscissa * mmtopx,
                    this.arrayTickValues[i] * mmtopx + CORRECT_VERTICAL_POSITION_SCALE,
                    this.line1size,
                    this.displaySpecialValue(this, this.arrayListSpecialValues, this.arraySpecialValues, i));
            }
        }
    };

    this.displaySpecialValue = function(ruler, arrayListSpecialValues, arraySpecialValues, valueToBeChecked) {
        //check if a value needs to be displayed with a special color.
        if (ruler.arrayListSpecialValues.includes(valueToBeChecked)) {
            color = ruler.arraySpecialValues[valueToBeChecked];
        } else {
            color = this.scaleColor;
        }
        return color;
    };

    this.displayAlltexts = function() {
        //Displays fixed texts for a rule.
        this.displayText("Masse volumique", this.abscissa * mmtopx - 70, this.arrayTickValues[this.low] * mmtopx + 60 + CORRECT_VERTICAL_POSITION_SCALE, "left", -90, this.scaleColor);
        this.displayText("g/l (05) 20ºC", this.abscissa * mmtopx - 45, this.arrayTickValues[this.low] * mmtopx + 60 + CORRECT_VERTICAL_POSITION_SCALE, "left", -90, this.scaleColor);
        this.displayText("Alcool probable", this.abscissa * mmtopx - 35, this.arrayTickValues[this.low] * mmtopx + 60 + CORRECT_VERTICAL_POSITION_SCALE, "left", -90, this.scaleColor);
        this.displayText("MUSTIMETRIE", this.abscissa * mmtopx - 11, this.arrayTickValues[this.low] * mmtopx + 120 + CORRECT_VERTICAL_POSITION_SCALE, "center", 0, this.scaleColor);
        this.displayText("DUJARDIN", this.abscissa * mmtopx - 11, this.arrayTickValues[this.low] * mmtopx + 140 + CORRECT_VERTICAL_POSITION_SCALE, "center", 0, this.scaleColor);
        this.displayText("SALLERON", this.abscissa * mmtopx - 11, this.arrayTickValues[this.low] * mmtopx + 160 + CORRECT_VERTICAL_POSITION_SCALE, "center", 0, this.scaleColor);
        this.displayText("1683 grammes de sucre par hecto", this.abscissa * mmtopx + 10, this.arrayAlcoholValues[this.MIN_ALCOHOL_VALUE] * mmtopx - 100 + CORRECT_VERTICAL_POSITION_SCALE, "center", -90, this.scaleColor);
        this.displayText("produisent 1% d'alcool", this.abscissa * mmtopx + 20, this.arrayAlcoholValues[this.MIN_ALCOHOL_VALUE] * mmtopx - 100 + CORRECT_VERTICAL_POSITION_SCALE, "center", -90, this.scaleColor);
    };
};