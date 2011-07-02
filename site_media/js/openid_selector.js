function clearInfoMsg() {
    $('#infoMsg').html('');
}

function showInfoMsg(provider) {
    clearInfoMsg();
    $('#infoMsg').html("Please replace the 'username' below with your "+provider+ " username.");
}

function fillEndPoint(provider) {
    if (provider == "google") {
	clearInfoMsg();
	$('#openid_url').val('https://www.google.com/accounts/o8/id');
    }
    else if (provider == "yahoo") {
	clearInfoMsg();
	$('#openid_url').val('http://yahoo.com/');
    }
    else if (provider == "lj") {
	showInfoMsg("LiveJournal");
	$('#openid_url').val('http://username.livejournal.com');
    }
    else if (provider == "blogger") {
	showInfoMsg("Blogger");
	$('#openid_url').val('http://username.blogspot.com/');
    }
    else if (provider == "flickr") {
	showInfoMsg("Flickr");
	$('#openid_url').val('http://flickr.com/username');
    }
    else if (provider == "myspace") {
	showInfoMsg("MySpace");
	$('#openid_url').val('http://myspace.com/username');
    }
    else if (provider == "wordpress") {
	showInfoMsg("Wordpress");
	$('#openid_url').val('http://username.wordpress.com');
    }
    else if (provider == "aol") {
	showInfoMsg("AOL");
	$('#openid_url').val('http://openid.aol.com/username');
    }
    else {
	clearInfoMsg();
	$('#openid_url').val('http://{ Enter other Openid }');
    }
}