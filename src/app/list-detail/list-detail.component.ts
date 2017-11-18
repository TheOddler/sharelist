import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Item, ItemMeta } from '../item-detail/item-detail.component';

export interface List {
	title: string;
	desc: string;
}

export interface ListMeta {
	id: string;
	data: List;
}

@Component({
	selector: 'app-list-detail',
	templateUrl: './list-detail.component.html',
	styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit {

	listDoc: AngularFirestoreDocument<List>;
	list: Observable<List>;
	listTitleChanged = new Subject<{doc: AngularFirestoreDocument<List>, title: string}>();

	itemsCol: AngularFirestoreCollection<Item>;
	itemsMeta: Observable<ItemMeta[]>;

	constructor(private afs: AngularFirestore) {
		this.listTitleChanged
			.debounceTime(1000)
			.distinctUntilChanged()
			.subscribe(info => {
				console.log(info.title);
				info.doc.update({title: info.title})
			});
	}

	ngOnInit() {
	}
	
	updateListTitle(newTitle) {
		this.listTitleChanged.next({
			doc: this.listDoc,
			title: newTitle
		});
	}

	@Input() set listMeta(newListMeta: ListMeta) {
		if (newListMeta != null) {
			this.listDoc = this.afs.doc('lists/' + newListMeta.id);
			this.list = this.listDoc.valueChanges();

			this.itemsCol = this.afs.collection('lists/' + newListMeta.id + '/items');
			this.itemsMeta = this.itemsCol.snapshotChanges()
				.map(actions => {
					return actions.map(a => {
						const data = a.payload.doc.data() as Item;
						const id = a.payload.doc.id;
						const parentId = newListMeta.id;
						return { parentId, id, data };
					});
				});
		}
		else {
			this.listDoc = null;
			this.list = null;
			this.itemsCol = null;
			this.itemsMeta = null;
		}
	}
}
