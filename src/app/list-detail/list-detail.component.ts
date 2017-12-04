import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Item, ItemMeta } from '../item-detail/item-detail.component';
import { FsInputComponent } from '../fs-input/fs-input.component';

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

	itemsCol: AngularFirestoreCollection<Item>;
	itemsMeta: Observable<ItemMeta[]>;

	newItemName: string;

	@Output() onDeleted = new EventEmitter();

	constructor(private afs: AngularFirestore) { }

	ngOnInit() { }

	@Input() set listMeta(newListMeta: ListMeta) {
		if (newListMeta != null) {
			this.listDoc = this.afs.doc('lists/' + newListMeta.id);

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
		} else {
			this.listDoc = null;
			this.itemsMeta = null;
		}
	}

	delete() {
		this.onDeleted.emit();
		this.listDoc.delete();
	}

	addItem() {
		if (this.listDoc && this.newItemName) {
			const newItem = this.itemsCol.add({ name: this.newItemName });
			this.newItemName = '';
		}
	}

	trackByFn(index: any, item: ItemMeta) {
		return item.id;
	}
}
