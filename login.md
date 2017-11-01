---
title: ShareList Login
includes:
- firebase_login_ui.html
---

# Welcome to the ShareList login page!

<div class="user-logged-in" style="display: none;" markdown="1">

You are already logged in.
[Click here to continue](/).

Or sign out: 
[Sign out](#){:onclick="firebase.auth().signOut()"}

</div>

<div class="user-logged-out" style="display: none;" markdown="1">

<div id="firebaseui-auth-container"></div>

</div>

