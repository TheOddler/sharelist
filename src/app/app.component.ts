import { Component } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface List {
	title: string;
	desc: string;
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
	lists: Observable<List[]>;

	constructor(private afs: AngularFirestore) {

	}

	ngOnInit() {
		this.listsCol = this.afs.collection('lists');
		this.lists = this.listsCol.valueChanges();
	}

	addList() {
		this.afs.collection('lists').add({'title': this.title, 'desc': this.desc});
	}
}
