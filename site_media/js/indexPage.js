function sortFn(a, b) {
    return a[1] > b[1] ? 1 : -1;
}

$(document).ready(function () { 
    var countryList = [];
    $("#stat div div.country p[id]").each(function(i, k) { 
	var numPeople = $(this).siblings("p").html();
	$(k).html("<a href='/country/"+$(k).attr("id")+"/'>"+countryMapping[$(k).attr("id")]+"</a>");
	countryList.push([$(k).parents("div.country"), numPeople]);
    });
    countryList.sort(sortFn);
    countryList.reverse();
    $("#stat div div.country").remove();
    $.each(countryList, function(i, k) { 
	$("#stat div").first().append(k[0]);
    });
    var batchList = [];
    $("#stat div div.batch p[id]").each(function(i, k) { 
	var numPeople = $(this).siblings("p").html();
	batchList.push([$(k).parents("div.batch"), numPeople]);
    });
    batchList.sort(sortFn);
    batchList.reverse();
    $("#stat div div.batch").remove();
    $.each(batchList, function(i, k) { 
	$("#stat div").last().append(k[0]);
    });
    $("#stat").accordion({header: "> h4"});
});
