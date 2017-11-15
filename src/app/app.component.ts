import { Component } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface List {
	title: string;
	desc: string;
}

interface ListMeta {
	id: string;
	data: List;
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title: string;
	desc: string;

	listsCol: AngularFirestoreCollection<List>;
	listsMeta: Observable<ListMeta[]>;

	listDoc: AngularFirestoreDocument<List>;
	list: Observable<List>;

	constructor(private afs: AngularFirestore) {

	}

	ngOnInit() {
		this.listsCol = this.afs.collection('lists');
		this.listsMeta = this.listsCol.snapshotChanges()
			.map(actions => {
				return actions.map(a => {
					const data = a.payload.doc.data() as List;
					const id = a.payload.doc.id;
					return { id, data };
				});
			});
	}

	addList() {
		this.afs.collection('lists').add({ 'title': this.title, 'desc': this.desc });
	}

	getList(listId) {
		this.listDoc = this.afs.doc('lists/' + listId);
		this.list = this.listDoc.valueChanges();
	}
}
