import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

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
	listTitleChanged: Subject<string> = new Subject<string>();

	constructor(private afs: AngularFirestore) {
		this.listTitleChanged
			.debounceTime(1000)
			.distinctUntilChanged()
			.subscribe(t => {
				console.log(t);
				this.listDoc.update({title: t})
			});
	}

	ngOnInit() {
	}
	
	updateListTitle(t) {
		this.listTitleChanged.next(t);
	}

	@Input() set listMeta(newListMeta: ListMeta) {
		console.log("setListMeta...", newListMeta)
		if (newListMeta != null) {
			this.listDoc = this.afs.doc('lists/' + newListMeta.id);
			this.list = this.listDoc.valueChanges();
		}
		else {
			this.listDoc = null;
			this.list = null;
		}
	}
}
