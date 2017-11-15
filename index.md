---
title: ShareList
---

# Welcome to ShareList!

<script>
	function getUserData(user) {
		let ref = db.collection('users').doc(user.uid)
		return ref.get().then(function (doc) {
			if (doc.exists) {
				console.log('User found:', doc.data())
				return Promise.resolve(doc.data())
			} else {
				console.log('No user found, creating one...')
				return ref.set({
					name: user.displayName.split(' ')[0]
				}).then(function() {
					return getUserData(user)
				})
			}
		})
	}

	
	let listsListener = null

	function onUserChanged(user) {
		if (listsListener) listsListener() //unsubscribes

		if (user) { //login
			listsListener = db.collection('lists')
			.where('access.' + user.uid, '==', true)
			.onSnapshot(function(lists) {
				console.log(lists)
				lists.forEach(function(list) {
					console.log(list.data());
				});
			}, function(error) {
				console.error('Error getting lists: ', error)
			})
		}
		else { //logout or fail

		}
	}

	$(function () {
		firebase.auth().onAuthStateChanged(
			function (user) { 
				console.log('AuthStateChanged ok: ', user)
				onUserChanged(user)
			},
			function (error) {
				console.log('AuthStateChanged error: ', error)
				onUserChanged(null)
			}
		);
	});
</script>
