$(document).ready(function() {
	//get parameters from our URL	

	var title = getParameterByName('title');

	if (title == null) {
		alert("Title not in URL");
		return;
	}


	
	//get general play info, should return one item
	$.get("http://api.cfregisters.org/plays?title=eq." + title,
	function (data,status) {

		if (data.length > 0) {
			var decodedTitle = decodeURIComponent(title.replace(/\+/g, " "));
			$("#play_title").html(decodedTitle);
			$("#author").html("Author: " + data[0].author);
			$("#genre").html("Genre: " + data[0].genre);
			$("#creation_date").html("Date Written: " + data[0].date_de_creation);
			$("#number_of_acts").html("Number of Acts: " + data[0].acts);
		} else {
			alert("URL Parameters parsed, but play not found in CFRP Database.");
		}
	});

	//just for all-time revenue, should also return one object
	$.get("http://api.cfregisters.org/plays_with_totals?title=eq." + title,
	function (data,status) {
		if (data.length > 0) {
			$("#alltime_revenue").html("All-time Revenue: " + data[0].total +" livres");
		}
	});

	
	//get seating sales
	$.get("http://api.cfregisters.org/performances_with_totals?title=eq." + title,
	function (data,status) {

		if (data.length > 0) {
			for (i = 0; i< data.length; i++) {
			$("#performancesTable").append("<tr>" +
				"<td>" + "<a href=\"performance.html?title=" + title + "&date=" +data[i].date + "\">" + data[i].date + "</a>" + "</td>" +
				"<td>" + data[i].total+ "</td>" +
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
