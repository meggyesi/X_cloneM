import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCommentComponent } from './send-comment.component';

describe('SendCommentComponent', () => {
  let component: SendCommentComponent;
  let fixture: ComponentFixture<SendCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendCommentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
