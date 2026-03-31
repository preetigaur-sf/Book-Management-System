import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Editbook } from './editbook';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('Editbook', () => {
  
  let component: Editbook;
  let fixture: ComponentFixture<Editbook>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '1'
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editbook, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Editbook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
