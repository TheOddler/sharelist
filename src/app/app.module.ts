import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

// Firebase and Firestore
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { ListDetailComponent } from './list-detail/list-detail.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';

var firebaseConfig = {
	apiKey: "AIzaSyAylSVJHIw49o8297moNhjaNnvcpK9ub94",
	authDomain: "shared-wishlist.firebaseapp.com",
	databaseURL: "https://shared-wishlist.firebaseio.com",
	projectId: "shared-wishlist",
	storageBucket: "shared-wishlist.appspot.com",
	messagingSenderId: "671581161369"
};


@NgModule({
	declarations: [
		AppComponent,
		ListDetailComponent,
		ItemDetailComponent
	],
	imports: [
		BrowserModule,
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFirestoreModule,
		FormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
