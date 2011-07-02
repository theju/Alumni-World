var serviceNum = 1;

function addOneMoreService() {
    $('table').append("<tr><td><label id='lService"+serviceNum+"'>Name of service</label><a href='#bottom' id='anchor"+serviceNum+"' onclick='editLabel("+serviceNum+");'>(Edit)</a><input id='service"+serviceNum+"' type='text' /></td></tr>");
    serviceNum += 1;
}

function editLabel(svcNum) {
    $('#lService'+svcNum).replaceWith("<input type='text' id='lService"+svcNum+"' value='"+$('#lService'+svcNum).html()+"' onblur='setName("+svcNum+");' />");
    $('#anchor'+svcNum).hide();
}

function setName(svcNum) {
    $('#lService'+svcNum).replaceWith("<label id='lService"+svcNum+"'>"+$('#lService'+svcNum).val()+"</label>");
    $('#anchor'+svcNum).show();
    $('#service'+svcNum).attr('name', $('#lService'+svcNum).html());
}
