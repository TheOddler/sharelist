import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
	selector: 'app-fs-input',
	templateUrl: './fs-input.component.html',
	styleUrls: ['./fs-input.component.css', '../shared_css/input.css'],
	encapsulation: ViewEncapsulation.None
})
export class FsInputComponent implements OnInit {

	@Input() placeholder: string;
	@Input() floatPlaceholder = 'auto';
	@Input() required = false;
	@Input() alwaysUnderline = true;
	private _document: AngularFirestoreDocument<any>;
	private _field: string;
	private _docObservable: Observable<any>;

	private _changed: Subject<string>;

	constructor() { }

	ngOnInit() { }

	@Input() set document(newDoc: AngularFirestoreDocument<any>) {
		if (this._document !== newDoc) {
			this._document = newDoc;
			this.updateAngular();
		}
	}

	@Input() set field(newField: string) {
		if (this._field !== newField) {
			this._field = newField;
			this.updateAngular();
		}
	}

	private updateAngular() {
		if (this._field && this._document) {
			const doc = this._document;
			const field = this._field;
			this._docObservable = this._document.valueChanges()
				.map(v => {
					return v[field];
				});
			this._changed = new Subject<string>();
			this._changed
				.debounceTime(1000)
				.distinctUntilChanged()
				.subscribe(newVal => {
					const toUpdate = {};
					toUpdate[field] = newVal;
					doc.update(toUpdate);
				});
		}
	}

	update(newValue: string) {
		if (this._changed && newValue) {
			this._changed.next(newValue);
		}
	}

	get observable() {
		return this._docObservable;
	}
}
