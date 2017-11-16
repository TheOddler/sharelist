import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

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
	listTitleChanged: Subject<string> = new Subject<string>();

	constructor(private afs: AngularFirestore) {
		this.listTitleChanged
			.debounceTime(1000)
			.distinctUntilChanged() // only emit if value is different from previous value
			.subscribe(t => {
				console.log(t);
				this.listDoc.update({title: t})
			});
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

	deleteList(listId) {
		this.afs.doc('lists/' + listId).delete();
	}

	getList(listId) {
		this.listDoc = this.afs.doc('lists/' + listId);
		this.list = this.listDoc.valueChanges();
	}

	updateListTitle(t) {
		this.listTitleChanged.next(t);
	}
}
