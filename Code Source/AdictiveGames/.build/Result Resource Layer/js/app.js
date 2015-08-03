( function () {
	window.addEventListener( 'tizenhwkey', function( ev ) {

		tizen.application.getCurrentApplication().exit();
	} );
} () );