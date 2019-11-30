import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberlistPage } from './memberlist.page';

describe('MemberlistPage', () => {
  let component: MemberlistPage;
  let fixture: ComponentFixture<MemberlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberlistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
