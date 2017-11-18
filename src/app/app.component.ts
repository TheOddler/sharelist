import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { List, ListMeta } from './list-detail/list-detail.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	title: string;
	desc = '';

	listsCol: AngularFirestoreCollection<List>;
	listsMeta: Observable<ListMeta[]>;

	selectedListMeta: ListMeta;

	constructor(
		private afs: AngularFirestore,
		public afAuth: AngularFireAuth) {
	}

	ngOnInit() {
		this.listsCol = this.afs.collection<List>('lists', ref => ref.orderBy('title'));
		this.listsMeta = this.listsCol.snapshotChanges()
			.map(actions => {
				if (!this.selectedListMeta) {
					const first = actions.find(a => a.type === 'added');
					this.selectedListMeta = {
						id: first.payload.doc.id,
						data: first.payload.doc.data() as List
					};
				}
				return actions.map(a => {
					const data = a.payload.doc.data() as List;
					const id = a.payload.doc.id;
					return { id, data };
				});
			});
	}

	login() {
		this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
	}

	logout() {
		this.afAuth.auth.signOut();
	}

	addList() {
		if (this.title) {
			this.afs.collection('lists').add({ 'title': this.title, 'desc': this.desc });
			this.title = '';
			this.desc = '';
		}
	}

	deleteList(deleteListMeta) {
		this.afs.doc('lists/' + deleteListMeta.id).delete();
		if (deleteListMeta === this.selectedListMeta) {
			this.selectedListMeta = null;
		}
	}
}
