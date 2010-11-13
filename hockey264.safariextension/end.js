if( window.top == window ) {
	// this script tag is for the video.nhl.com page
	// it only servces mp4 to the ipad, but I effected force the ipad check to return true
	// when a clip is played, some meta info is downloaded via xhr.  it's xml and tells the video
	// player what to play.
	// by default it plays whatever's contained in the video-clip tag, but this is only used by flash
	// we need to force it to read from the alt-video-clip element that tells the video player to load
	// the mp4 content.
	// it's a bit hacky but works.

	if( re.test(document.URL) ) {
		var script = document.createElement('script');
		script.innerHTML = "var g_isipad = true; " +
		"  var  g_videoClipTag = 'alt-video-clip';  ";

		document.body.insertBefore(script,document.body.firstChild);
		
		var ipadPlayer = document.getElementById('ipadPlayer');
		var nlFlexPlayerDiv = document.getElementById('nlFlexPlayerDiv');
		if( nlFlexPlayerDiv ) {
			nlFlexPlayerDiv.appendChild(ipadPlayer);
			ipadPlayer.setAttribute('style','');
			nlFlexPlayerDiv.parentNode.setAttribute('class', 'playerContainer');			
		}
	}
	
	
	var recap = /nhl\.com\/ice\/recap/;
	if( recap.test(document.URL) ) {
		
		var reportAnchorElement = document.evaluate( '//a[contains(@href,"htmlreports")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
		var reg = /htmlreports\/(\d+)\/\D+(\d+)(\d{3})/;
		var seasonId;
		var gameId;
		var otherId;
		
		if( regResults = reg.exec(reportAnchorElement.getAttribute('href') ) ) {
			seasonId = regResults[1];
			gameId = regResults[3];
			otherId = regResults[2];
		}
		
		safari.self.tab.dispatchMessage("getHighlights", {"xml":1,"season": seasonId, "type":2, "number": gameId});
		safari.self.addEventListener("message", function(event) {

			if( event.name == "highlightsReady") {
				var highlights = (new DOMParser()).parseFromString(event.message, "text/xml");
				
				document.addEventListener('DOMNodeInserted', function(event) {
					const element = event.target;		
					if ( element instanceof HTMLEmbedElement ) {
						var reg = /eid=(\w+)/;
						
						var result = reg.exec(element.getAttribute('flashvars'));
						var eid = result[1];
						
						var altClip = document.evaluate('//event-id[.="'+ eid +'"]/../alt-video-clip',highlights, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
						if( altClip ) {
							var video = document.createElement('video');
							video.setAttribute('src',altClip.textContent);
							video.setAttribute('autoplay','autoplay');
							video.setAttribute('controls','controls');
							
							var parentNode = element.parentNode;
							if( parentNode ) {
								parentNode.removeChild(element);
								parentNode.appendChild(video);
							}
						}
						
				
					}
				} ,true);							
			}
			
		}, false);
		
	}
}
