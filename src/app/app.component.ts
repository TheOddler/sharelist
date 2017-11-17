import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { List, ListMeta } from './list-detail/list-detail.component';

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

	selectedListMeta: ListMeta;

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

	deleteList(deleteListMeta) {
		this.afs.doc('lists/' + deleteListMeta.id).delete();
		if (deleteListMeta == this.selectedListMeta) {
			this.selectedListMeta = null;
		}
	}
}
