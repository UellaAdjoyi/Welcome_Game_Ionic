import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumFeedDetailPage } from './forum-feed-detail.page';
import {async} from "rxjs";

describe('ForumFeedDetailPage', () => {
  let component: ForumFeedDetailPage;
  let fixture: ComponentFixture<ForumFeedDetailPage>;

  // @ts-ignore
  beforeEach(async(() => {
    fixture = TestBed.createComponent(ForumFeedDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
