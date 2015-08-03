( function () {
	window.addEventListener( 'tizenhwkey', function( ev ) {
		if( ev.keyName == "back" ) {
			var page = document.getElementsByClassName( 'ui-page-active' )[0],
				pageid = page ? page.id : "";
			if( pageid === "main" ) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				try{
				if (!choicepage) window.sessionStorage.setItem("joined",null);
				window.history.back();
			} catch (ignore) {
				tizen.application.getCurrentApplication().exit();
			}
			}
		}
	} );
} () );