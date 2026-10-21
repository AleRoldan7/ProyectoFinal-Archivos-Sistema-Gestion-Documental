import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploradorCarpetas } from './explorador-carpetas';

describe('ExploradorCarpetas', () => {
  let component: ExploradorCarpetas;
  let fixture: ComponentFixture<ExploradorCarpetas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploradorCarpetas],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploradorCarpetas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
