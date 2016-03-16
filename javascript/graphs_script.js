$(document).ready(function() {
	
	$("#generate_button").click(function(){
		
		$("#generate_button").prop("disabled",true);
		
		//erase previous graph
		$("#graph_container").html("<h2>Generating Graph. Please Wait...</h2>");
		
		var selected = $("#plot_select").val();
		if (selected == 1) {
			countPerformances();
		} else if (selected == 2) {
			countAttendance();
		} else if (selected == 3) {
			countYearlyGross();
		}		
		else{
			countPlaysCreated();
		}
		

    }); 
}
);


function countPerformances() {
	
	//how do you declare constants in js?
	start_year = 1670;
	timespan = 130;
		
	results = newResultsArray(timespan,start_year);
	
	$.get("http://api.cfregisters.org/performances_with_totals",function (data,status) {
		
		for (i = 0; i < data.length; i++) {
			var year = parseInt(data[i].date); //this parses the year from the date and stops at the dash!
			if (!isNaN(year)) {
				array_index = year - start_year;
				if (array_index < results.length && array_index >= 0) {
					results[array_index].val += 1;
				}
			}
		}
		
		createD3ScatterPlot(results,"Number of Performances");
	});
}

function countPlaysCreated() {
	
	//how do you declare constants in js?
	start_year = 1670;
	timespan = 130;
		
	results = newResultsArray(timespan,start_year);
	
	$.get("http://api.cfregisters.org/plays",function (data,status) {
		
		for (i = 0; i < data.length; i++) {
			var year = parseInt(data[i].date_de_creation); //this parses the year from the date and stops at the dash!
			if (!isNaN(year)) {
				array_index = year - start_year;
				if (array_index < results.length && array_index >= 0) {
					results[array_index].val += 1;
				}
			}
		}
		
		createD3ScatterPlot(results,"Number of Plays Created");
	});
}

function countAttendance() {
		//how do you declare constants in js?
	start_year = 1670;
	timespan = 130;
		
	results = newResultsArray(timespan,start_year);
	
	$.get("http://api.cfregisters.org/play_ticket_sales",function (data,status) {
		
		for (i = 0; i < data.length; i++) {
			var year = parseInt(data[i].date); //this parses the year from the date and stops at the dash!
			if (!isNaN(year)) {
				array_index = year - start_year;
				if (array_index < results.length && array_index >= 0) {
					results[array_index].val += data[i].total_sold;
				}
			}
		}
		
		createD3ScatterPlot(results,"Yearly Total Attendance");
	});
}

function countYearlyGross() {
		//how do you declare constants in js?
	start_year = 1670;
	timespan = 130;
		
	results = newResultsArray(timespan,start_year);
	
	$.get("http://api.cfregisters.org/performances_with_totals",function (data,status) {
		
		for (i = 0; i < data.length; i++) {
			var year = parseInt(data[i].date); //this parses the year from the date and stops at the dash!
			if (!isNaN(year)) {
				array_index = year - start_year;
				if (array_index < results.length && array_index >= 0) {
					results[array_index].val += data[i].total;
				}
			}
		}
		
		createD3ScatterPlot(results,"Total Yearly Gross");
	});
}

//from http://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array
function newResultsArray(len,offset) {
    var rv = new Array(len);
    for (i = 0; i < rv.length; i++) {
		rv[i] = {year:(i+offset),val:0};
	}
    return rv;
}



function createD3ScatterPlot(data,yaxisname) {
	
	//erase please wait message
	$("#graph_container").html("");
	
	var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.year;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.val;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.Manufacturer;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("#graph_container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yaxisname);

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));});

	$("#generate_button").prop("disabled",false);


}
