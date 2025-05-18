import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidateMissionsPage } from './validate-missions.page';

describe('ValidateMissionsPage', () => {
  let component: ValidateMissionsPage;
  let fixture: ComponentFixture<ValidateMissionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ValidateMissionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
