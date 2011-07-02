function clearInput(obj) {
    $(obj).val("");
}

function redirectToBatch() {
    window.location = "/batch/"+$("#batchInput").val()+"/";
}

function redirectToCourse() {
    window.location = "/course/"+$("#courseSelect").val()+"/";
}

function redirectToCountry() {
    window.location = "/country/"+$("#countrySelect").val()+"/";
}

function redirectToClass() {
    window.location = "/batch/"+$("#batchInput").val()+"/course/"+$("#courseSelect").val()+"/";
}

function setupBatchSearch() {
    var batchInput = "<p><input type='text' id='batchInput' onclick='clearInput(this);' value='Enter the year' /></p>"+
	             "<p><input type='submit' value='Search' onclick='redirectToBatch();' /></p>";
    $("#batch").children("p").remove();
    $("#batch").append(batchInput);
}

function setupCourseSearch() {
    var courseInput = "<p><select id='courseSelect'>"+
	                  "<option value='CIV'>Civil Engineering</option>"+
	                  "<option value='CSE'>Computer Science Engineering</option>"+
	                  "<option value='ECE'>Electronics and Communication Engineering</option>"+
	                  "<option value='EEE'>Electrical and Electronics Engineering</option>"+
	                  "<option value='IT'>Information Technology</option>"+
	                  "<option value='MECH'>Mechanical Engineering</option>"+
	                  "<option value='PROD'>Production Engineering</option>"+
	               "</select></p>"+
	               "<p><input type='submit' value='Search' onclick='redirectToCourse();' /></p>";
   $("#course").children("p").remove();
   $("#course").append(courseInput);
}

function setupClassSearch() {
    var classInput = "<p>Batch<input type='text' id='classInput' onclick='clearInput(this);' value='Enter the year' /></p>";
    // classInput    += "<p>Course<select id='classSelect'>"+
    // 	                   "<option value='CIV'>Civil Engineering</option>"+
    // 	                   "<option value='CSE'>Computer Science Engineering</option>"+
    // 	                   "<option value='ECE'>Electronics and Communication Engineering</option>"+
    // 	                   "<option value='EEE'>Electrical and Electronics Engineering</option>"+
    // 	                   "<option value='IT'>Information Technology</option>"+
    // 	                   "<option value='MECH'>Mechanical Engineering</option>"+
    // 	                   "<option value='PROD'>Production Engineering</option>"+
    // 	                "</select></p>"+
    classInput += "<p><input type='submit' value='Search' onclick='redirectToClass();' /></p>";
   $("#class").children("p").remove();
   $("#class").append(classInput);
}

function setupCountrySearch() {
    var countryInputStart = "<p><select id='countrySelect'>";
    $.each(countryMapping, function (idx, val) { 
	    countryInputStart += "<option value='"+idx+"'>"+val+"</option>";
	});
    var countryInputEnd = "</select></p><p><input type='submit' value='Search' onclick='redirectToCountry();' /></p>";
    var countryInput = countryInputStart + countryInputEnd;
    $("#country").children("p").remove();
    $("#country").append(countryInput);
}

