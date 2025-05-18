import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrokComponent } from './grok.component';

describe('GrokComponent', () => {
  let component: GrokComponent;
  let fixture: ComponentFixture<GrokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrokComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
