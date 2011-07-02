var map;

function getLocationDescr(latlng, fn) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': latlng}, function (results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
		if (results[0]) {
		    fn(results);
		}
	    } 
	    else {
		alert("Geocoder failed due to: " + status +".\nPlease try after a while or contact the administrator.");
	    }
	});
}

function init_latLng() {
    var latitude = 17.418808;
    var longitude = 78.410121;

    if (!$("#id_latitude").val()) {
      $("#id_latitude").val("17.418808");
    } else {
      latitude = $("#id_latitude").val();
    }
    if (!$("#id_longitude").val()) {
      $("#id_longitude").val("78.410121");
    } else {
      longitude = $("#id_longitude").val();
    }
    return {"latitude": latitude,
            "longitude": longitude}
}

function map_initialize(zoom, latlng) {
    var myOptions = {
	zoom: zoom,
	center: latlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

function initialize() {
    var latLon = init_latLng();
    var latlng = new google.maps.LatLng(latLon.latitude, latLon.longitude);
    map_initialize(6, latlng);
    var marker = new google.maps.Marker({
	    position: latlng, 
	    map: map, 
	    title: $("#fullName").html(),
            draggable: true
	});

    google.maps.event.addListener(marker, 'click', function() {
	    function showInfoWindowWithMarker(marker) {
		function showInfoWindow(results) {
		    userLocation = $("#location").val();
		    var contentString = "<strong>Location</strong>: " + results[0].formatted_address;
		    if (userLocation) {
			contentString += "\n<strong>Location (as entered by user)</strong>: " + userLocation;
		    }
		    var infowindow = new google.maps.InfoWindow({
			    content: contentString
			});
		    infowindow.open(map,marker);
		}
		return showInfoWindow;
	    }
	    getLocationDescr(this.position, showInfoWindowWithMarker(this));
	});    

    if ($("#editProfile").length > 0) {
	google.maps.event.addListener(marker, "dragend", function (event) {
		function reverseGeocode(results) {
		    for (i = 0; i < results.length; i++) {
			for (j = 0; j < results[i].types.length; j++) {
			    if (results[i].types[j] == "country") {
				$('#id_country').val(results[i].address_components[0].short_name);
			    }
			}
		    }
		    $('#id_latitude').val(event.latLng.lat());
		    $('#id_longitude').val(event.latLng.lng());
		    $('#id_location_description').html(results[0].formatted_address);
		    marker.position = event.latLng;
                    google.maps.event.trigger(marker, 'click');
		}
		getLocationDescr(event.latLng, reverseGeocode);
	    });
    }
}

function map_plot(latitude, longitude) {
   var latlng = new google.maps.LatLng(latitude, longitude);
   var marker = new google.maps.Marker({
	    position: latlng, 
	    map: map
	});
}
