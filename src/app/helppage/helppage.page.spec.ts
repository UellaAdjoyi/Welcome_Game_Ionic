import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelppagePage } from './helppage.page';

describe('HelppagePage', () => {
  let component: HelppagePage;
  let fixture: ComponentFixture<HelppagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HelppagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
