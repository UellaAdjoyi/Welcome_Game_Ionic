import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumDetailPage } from './forum-detail.page';

describe('ForumDetailPage', () => {
  let component: ForumDetailPage;
  let fixture: ComponentFixture<ForumDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
