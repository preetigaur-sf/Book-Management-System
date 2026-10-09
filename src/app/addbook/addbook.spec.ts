import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addbook } from './addbook';

describe('Addbook', () => {
  let component: Addbook;
  let fixture: ComponentFixture<Addbook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addbook],
    }).compileComponents();

    fixture = TestBed.createComponent(Addbook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
