var APICalls = require("apiCalls");
var Util = require("util");
var args = $.args;
var GLT_URL = Alloy.Globals.URL.GLT;
var TEAMS_ARGS = {url: Alloy.Globals.URL.GLT_TEAMS, title: "GLT Teams"};
var FIXTURES_ARGS = {url: Alloy.Globals.URL.GLT_FIXTURES, title: "GLT Fixtures"};
var LINKS_ARGS = {url: Alloy.Globals.URL.LINKS, title: "GLT Links"};

var gltItems = [];

var handleSuccessCallback = function(data) {
	gltItems = [];
	var glt = JSON.parse(data).glt;
	if(glt.length > 0) {
		_.map(glt, function(item) {
			if(item.active) {
				//var icon = "images/icons/"+item.menuItem+".png";
				gltItems.push({
					properties : {
						color: "black",
						accessoryTypeColor: "red",
						accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
					},
					//icon: {image: icon, width: "10%", left: 5},
					menuItem: { text: item.menuItem, left: 5,font: {fontWeight: 'bold', fontSize: 20} },
		            template : 'gltTemplate'
				});
			}
		});
    	if(gltItems.length > 0) {
	        var sections = Ti.UI.createListSection({});
	        sections.setItems(gltItems);
	        $.gltList.setSections([sections]);
    	}
    }
    $.activityIndicator.hide();
};

var itemClickHandler = function(e) {
    var item = e.section.getItemAt(e.itemIndex);
	if(gltItems.length > 0 && item.menuItem && item.menuItem.text == "Teams") {
		var teamsView = Alloy.createController('teams/teams', TEAMS_ARGS).getView();
        Alloy.CFG.tabGroup.getActiveTab().open(teamsView);
	} else if(gltItems.length > 0 && item.menuItem && item.menuItem.text == "Fixtures") {
		var fixturesView = Alloy.createController('fixtures/fixtures', FIXTURES_ARGS).getView();
        Alloy.CFG.tabGroup.getActiveTab().open(fixturesView, {});
	} else if(gltItems.length > 0 && item.menuItem && item.menuItem.text == "Links") {
		var linksView = Alloy.createController('links/links', LINKS_ARGS).getView();
        Alloy.CFG.tabGroup.getActiveTab().open(linksView);
	} else {
		var dialog = Ti.UI.createAlertDialog({
            title: "Information",
            message: "We are still working on \""+ item.menuItem.text+"\"?",
            buttonNames: ['Ok'],
            cancel: 1
        });
        dialog.show();
	}
};

$.gltList.addEventListener('itemclick', itemClickHandler);

var initGLTTab = function() {
    var options = {
        method : "GET"
    };
    options.handleSuccessCallback = handleSuccessCallback;
    $.activityIndicator.show({message:" Loading..."});
    APICalls.request(GLT_URL, options);
};

if(OS_ANDROID) {
	$.gltWindow.addEventListener('android:back', function(){
		$.gltWindow.close();
	});
}

initGLTTab();