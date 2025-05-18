import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MySubmissionsPage } from './my-submissions.page';

describe('MySubmissionsPage', () => {
  let component: MySubmissionsPage;
  let fixture: ComponentFixture<MySubmissionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MySubmissionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
