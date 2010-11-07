if( window.top == window ) {

	// no need to run this on the video page
	var re = /video\.nhl\.com/;
	if( !re.test(document.URL) ) {
		// the end script gets called after $(document).ready so I can't intercept the function that gets called.
		// so what I do instead is setup some listeners for node removal/insertion and intercept the insertion of 
		// the flash crap and remove of the nice html and revert the changes.
	
		// mbvHome contains the nice HTML version that we want on the page, not the crappy flash that replaces it.
		// I need a reference to it so that when the flash is added, I can remove the flash and append mbvHome
		var mbvHome;

		document.addEventListener('DOMNodeRemoved', function(event) {
			const element = event.target;
			if( element.id == 'mbvHome') {
				mbvHome = element;
			}
		} ,false);
	
		document.addEventListener('DOMNodeInserted', function(event) {
		
			const element = event.target
			if(element instanceof HTMLObjectElement && element.id == 'nhl') {
				var parentNode = element.parentNode;
				parentNode.removeChild(element);
				parentNode.appendChild(mbvHome);
			}
		
		} ,true);		
	}

}