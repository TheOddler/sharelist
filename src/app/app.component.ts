import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
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
		this.setupAfsConnection();
		this.listsMeta.take(1)
			.subscribe( metas => {
				this.selectedListMeta =
					metas.length > 0 ? metas[0] : null;
			});
	}

	private setupAfsConnection() {
		this.listsCol = this.afs.collection<List>('lists', ref => ref.orderBy('title'));
		this.listsMeta = this.listsCol.snapshotChanges()
			.map(actions => {
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
			this.listsCol.add({ 'title': this.title, 'desc': this.desc });
			this.title = '';
			this.desc = '';
		}
	}

	onSelectedListDeleted() {
		this.setupAfsConnection(); // temp fix for double deletes
		this.selectedListMeta = null;
	}
}
