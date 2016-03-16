$(document).ready(function() {
	//get parameters from our URL	

	var title = getParameterByName('title');
	var date = getParameterByName('date');


	if (title == null) {
		alert("Title not in URL");
		return;
	} else if (date == null) {
		alert("Date not in URL");
		return;
	}


	
	//get performance financial info and populate (should return an array of one object)
	$.get("http://api.cfregisters.org/performances_with_totals?title=eq." + title +"&date=eq." + date,
	function (data,status) {

		if (data.length > 0) {
			var decodedTitle = decodeURIComponent(title.replace(/\+/g, " "));
			$("#play_title").html(decodedTitle);
			$("#date").html("Date: " + date);
			$("#performance_revenue").html("Performance Revenue: " + data[0].total);
		} else {
			alert("URL Parameters parsed, but play not found in CFRP Database.");
		}
	});


	//get seating sales
	$.get("http://api.cfregisters.org/play_ticket_sales?title=eq." + title +"&date=eq." + date,
	function (data,status) {

		if (data.length > 0) {
			for (i = 0; i< data.length; i++) {
			$("#seatsSoldTable").append("<tr>" +
				"<td>" + data[i].name + "</td>" +
				"<td>" + data[i].total_sold+ "</td>" +
				"</tr>");
			}
		} else {
			alert("URL Parameters parsed, but play sales info not found in CFRP Database.");
		}
	});


});

//copied from: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
//modified so: we retain case-sensitivity and don't replace '+' with space
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return results[2];
    //return decodeURIComponent(results[2].replace(/\+/g, " "));
}


