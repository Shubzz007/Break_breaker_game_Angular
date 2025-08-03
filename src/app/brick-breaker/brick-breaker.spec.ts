import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrickBreaker } from './brick-breaker';

describe('BrickBreaker', () => {
  let component: BrickBreaker;
  let fixture: ComponentFixture<BrickBreaker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrickBreaker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrickBreaker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
