var colsList = {"Username" : ".user_id",  "Batch"   : ".batch",
		"Course"   : ".course",   "Name"    : ".full_name",
		"Location" : ".location", "Country" : ".country",};

function doList(mediaURL, searchKey) {
    if (searchKey == "Country") {
	function getCountryName(countryCode) {
	    return countryMapping[countryCode];
	}
	$(".country").each(function (idx, val) {
	    var spanElem = $(val);
	    spanElem.html(getCountryName(spanElem.html()));
	});
    }

    $.each(colsList, function (idx, val) {
	    if (idx != searchKey) {
		$("#selectFilter").append("<option val='"+val+"'>"+idx+"</option></option>");
	    }
	});
    var latlng = new google.maps.LatLng(19.97335, -15.8203);
    map_initialize(2, latlng);
    var latitudes = $(".neat .latitude");
    var longitudes = $(".neat .longitude");
    var pairs = $.map(latitudes, function (n, i) {
	    return [parseFloat($(latitudes[i]).html()), parseFloat($(longitudes[i]).html())];
	});
    for (i = 0; i < pairs.length / 2; i++) {
	latlng = new google.maps.LatLng(pairs[2*i],pairs[2*i+1]);
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: $($(".neat .full_name")[i]).html()
	    });
	enableClick(i, marker);
    }

    function enableClick(i, marker) {
	google.maps.event.addListener(marker, 'click', function() {
		function showInfoWindowWithMarker(marker) {
		    function showInfoWindow(results) {
			var contentString = "<strong><a href='"+$($(".neat .user_id")[i]).attr("href")+"'>";
			contentString += marker.title+"</a></strong><br />";
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

    function filter() {
	var filterVal = $("#filterInput").val();
	var filterParam = colsList[$("#selectFilter").val()];
	$(filterParam).each(function (idx) {
		var obj = $(this);
		if (obj.html() && obj.html().search(filterVal) < 0 || obj.val() && obj.val().search(filterVal) < 0) {
		    obj.parent().remove();
		}
	    });
    }
}
