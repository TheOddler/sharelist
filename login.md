---
title: ShareList Login
layout: login
---

<script type="text/javascript">
	// FirebaseUI config.
	var uiConfig = {
		signInSuccessUrl: '/',
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID
		],
		tosUrl: '/tos/' // Terms of service
	};
	var ui = new firebaseui.auth.AuthUI(firebase.auth());
	ui.start('#firebaseui-auth-container', uiConfig); // Waits for DOM load.
	
	function showLoginState(loggedin) {
		document.getElementById('logged-in').style.display = loggedin ? "" : "none"
		document.getElementById('logged-out').style.display = loggedin ? "none" : ""
	}
	// Check for existing user
	window.addEventListener('load', function () {
		firebase.auth().onAuthStateChanged(
			showLoginState, 
			function (error) {
				console.log(error)
				showLoginState(false)
			});
	});
</script>

# Welcome to the ShareList login page!

<div id="logged-in" style="display: none;" markdown="1">

You are already logged in.
[Click here to continue](/).

Or sign out: 
[Sign out](#){:onclick="firebase.auth().signOut()"}

</div>

<div id="logged-out" style="display: none;" markdown="1">

Login:

<div id="firebaseui-auth-container"></div>

</div>

