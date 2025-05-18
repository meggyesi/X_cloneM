import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTweetComponent } from './send-tweet.component';

describe('SendTweetComponent', () => {
  let component: SendTweetComponent;
  let fixture: ComponentFixture<SendTweetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendTweetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendTweetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
