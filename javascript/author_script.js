$(document).ready(function() {
	//get parameters from our URL	

	var author = getParameterByName('author');

	if (author== null) {
		alert("Author not in URL");
		return;
	}


	
	//get all plays from that author
	$.get("http://api.cfregisters.org/plays?author=eq." + author,
	function (data,status) {



		if (data.length > 0) {
			var uniquePlayNames = [];

			var decodedAuthor = decodeURIComponent(author.replace(/\+/g, " "));
			$("#author").html("Author Name: " + decodedAuthor);
			var playCount = 0;

			for (i = 0; i < data.length; i++) {
				//plays are repeated in the database, so check if it is unique
				if ($.inArray(data[i].title, uniquePlayNames) == -1) {
					uniquePlayNames.push(data[i].title);
					var encodedPlayTitle = encodeURIComponent(data[i].title);
					playCount += 1;
					$("#playsTable").append("<tr>" +
					"<td>" + "<a href=\"play.html?title=" + encodedPlayTitle + "\">" + data[i].title + "</a>" + "</td>" +
					"<td>" + data[i].date_de_creation+ "</td>" +
					"</tr>");
				}

			}

			$("#number_of_plays").html("Number of Plays Written: " + playCount)
		} else {
			alert("URL Parameters parsed, but author not found in CFRP Database.");
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