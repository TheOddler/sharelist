import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

export interface Item {
	name: string;
}

export interface ItemMeta {
	parentId: string;
	id: string;
	data: Item;
}

@Component({
	selector: 'app-item-detail',
	templateUrl: './item-detail.component.html',
	styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

	itemDoc: AngularFirestoreDocument<Item>;

	constructor(private afs: AngularFirestore) { }

	ngOnInit() { }

	@Input() set itemMeta(newListMeta: ItemMeta) {
		if (newListMeta != null) {
			this.itemDoc = this.afs.doc('lists/' + newListMeta.parentId + '/items/' + newListMeta.id);
		} else {
			this.itemDoc = null;
		}
	}

}
