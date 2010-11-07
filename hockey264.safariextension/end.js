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
		
		nlFlexPlayerDiv.appendChild(ipadPlayer);
		ipadPlayer.setAttribute('style','');
		nlFlexPlayerDiv.parentNode.setAttribute('class', 'playerContainer');
	}
}
