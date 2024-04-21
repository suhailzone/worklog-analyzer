import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbPaginationModule, NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { EstimateChartComponent } from './estimate-chart/estimate-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    EstimateChartComponent
  ],
  imports: [
    AgGridModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbDatepickerModule, FormsModule, JsonPipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
