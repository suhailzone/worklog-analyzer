import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbPaginationModule, NgbAlertModule, NgbDatepickerModule, NgbToastModule, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { EstimateChartComponent } from './estimate-chart/estimate-chart.component';
import { NgbToastService } from 'ngb-toast';
import { LogPieChartComponent } from './log-pie-chart/log-pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    EstimateChartComponent,
    LogPieChartComponent
  ],
  imports: [
    AgGridModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbToastModule,
    NgbDatepickerModule, FormsModule, JsonPipe
  ],
  providers: [NgbToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
