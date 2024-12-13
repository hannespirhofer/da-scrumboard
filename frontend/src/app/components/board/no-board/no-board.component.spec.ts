import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoBoardComponent } from './no-board.component';

describe('NoBoardComponent', () => {
  let component: NoBoardComponent;
  let fixture: ComponentFixture<NoBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
