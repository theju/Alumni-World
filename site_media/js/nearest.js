Number.prototype.toRad = function() {  // convert degrees to radians
    return this * Math.PI / 180;
}

/*
 * Use Law of Cosines to calculate distance (in km) between two points specified by latitude/longitude 
 * (in numeric degrees).
 */
function distCosineLaw(lat1, lon1, lat2, lon2) {
    /* Taken from http://www.movable-type.co.uk/scripts/latlong.html */
    var R = 6371; // earth's mean radius in km
    var d = Math.acos(Math.sin(lat1.toRad())*Math.sin(lat2.toRad()) +
		      Math.cos(lat1.toRad())*Math.cos(lat2.toRad())*Math.cos((lon2-lon1).toRad())) * R;
    return Math.round(d);
}

function mapDraw(user) {
    var personLatLng = new google.maps.LatLng(user.latitude, user.longitude);
    var marker = new google.maps.Marker({
	    position: personLatLng,
	    map: map,
	    title: user.full_name
	});
    google.maps.event.addListener(marker, 'click', function() {
            function showInfoWindowWithMarker(marker) {
                function showInfoWindow(results) {
		    var contentString = "<strong><a href='/user/"+user.user_id+"/'>"+marker.title+"</a></strong><br />";
		    contentString += "<strong>Location</strong>: " + results[0].formatted_address+"<br />";
                    var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                    infowindow.open(map,marker);
                }
                return showInfoWindow;
            }
            getLocationDescr(this.position, showInfoWindowWithMarker(this));
        });
}

function nearest(user, mediaURL) {
    if (user == "None") {
	return false;
    }
    $.getJSON("/getNearest/user/"+user+"/",
	      {},
	      function (data) {
		  // Save the data for later use;
		  var jsonData = data;
		  var userLat;
		  var userLon;
		  $.each(jsonData, function (idx, val) {
			  if (val.user_id == user) {
				  userLat = val.latitude;
				  userLon = val.longitude;
			  }
		      });
		  var nearestPeople = [];
		  $.each(jsonData, function(idx, val) {
			  domString = "<span class='neat'>";
			  if (val.user_id != user) {
			      var distance_to_user = distCosineLaw(val.latitude, val.longitude, userLat, userLon);
			      domString += "<p>";
			      domString += "<a href='/user/"+val.user_id+"/'>"+val.user_id+"</a>";
			      domString += "<a href='/country/"+val.country+"/'>";
			      domString += "<img class='flag' src='"+mediaURL+"images/flags/"+val.country.toLowerCase()+".gif' />";
			      domString += "</a><br />";
			      domString += "Name: "+val.full_name+"<br />";
			      domString += "Batch: <a href='/batch/"+val.batch+"/'>"+val.batch+"</a><br />";
			      domString += "Location: "+val.location_description+"<br />";
			      domString += "Country: <a href='/country/"+val.country+"/'>"+countryMapping[val.country]+"</a><br />";
			      domString += "Distance: "+distance_to_user+" km<br />";
			      domString += "</p>";
			      nearestPeople.push([distance_to_user, domString]);
			  }
			  domString += "</span>";
			  mapDraw(val);
		      });
		  nearestPeople.sort(function (a,b) {
			  return a[0] - b[0];
		      });
		  var colElem = $("#main");
		  $.each(nearestPeople, function(idx, val) {
			  colElem.append(val[1]);
		      });
	      });
}
