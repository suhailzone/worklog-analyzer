import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogPieChartComponent } from './log-pie-chart.component';

describe('LogPieChartComponent', () => {
  let component: LogPieChartComponent;
  let fixture: ComponentFixture<LogPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogPieChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
