import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateChartComponent } from './estimate-chart.component';

describe('EstimateChartComponent', () => {
  let component: EstimateChartComponent;
  let fixture: ComponentFixture<EstimateChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimateChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
