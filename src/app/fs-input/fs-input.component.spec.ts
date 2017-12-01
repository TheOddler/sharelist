import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FsInputComponent } from './fs-input.component';

describe('FsInputComponent', () => {
	let component: FsInputComponent;
	let fixture: ComponentFixture<FsInputComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FsInputComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FsInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
