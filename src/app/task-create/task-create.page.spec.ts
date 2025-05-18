import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCreatePage } from './task-create.page';
import {async} from "rxjs";

describe('TaskCreatePage', () => {
  let component: TaskCreatePage;
  let fixture: ComponentFixture<TaskCreatePage>;

  // @ts-ignore
  beforeEach(async(() => {
    fixture = TestBed.createComponent(TaskCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
