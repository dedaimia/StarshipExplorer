import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarshipDetailComponent } from './starship-detail.component';

describe('StarshipComponent', () => {
  let component: StarshipDetailComponent;
  let fixture: ComponentFixture<StarshipDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarshipDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarshipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
