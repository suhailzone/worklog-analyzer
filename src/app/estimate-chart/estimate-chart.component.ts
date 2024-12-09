import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Chart } from 'chart.js/auto';
import { WorkLog } from '../modules/WorkLog';

@Component({
  selector: 'app-estimate-chart',
  templateUrl: './estimate-chart.component.html',
  styleUrls: ['./estimate-chart.component.scss']
})
export class EstimateChartComponent implements OnInit, OnChanges {
  chart: Chart | null = null
  constructor() {}
  ngOnInit(): void {
    
  }
  @Input() fromDate: NgbDate | null = null;
  @Input() toDate: NgbDate | null = null;
  @Input() rowData: WorkLog[] | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (this.fromDate && this.toDate && this.rowData && this.rowData?.length > 0){
      let authors: string[] = []
      this.rowData.forEach(rd => {
        if(!authors.includes(rd.author))
          authors.push(rd.author)
      });
      let from = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
      let to = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
      let dates : string[] = [];
      while (from <= to) {
        let date = new Date(from);
        dates = [...dates, `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`]
        from.setDate(from.getDate() + 1);
      }
      let datasets: any[] = []
      authors.forEach(a => {
        let dsData: any = {
          label: a,
          borderWidth: 2,
          data: [],
          borderColor: this.random_rgba(),
          tension: 0.3
        }
        let authorData = this.rowData?.filter(rd => rd.author === a);
        dates.forEach(d => {
          let authorDate = authorData?.find(ad => ad.logDate && this.getDate(ad.logDate, d))
          if (authorDate){
            dsData.data.push(authorDate.workLog)
          }else{
            dsData.data.push(0)
          }
        })
        datasets.push(dsData)
      })
      console.log(datasets)
      this.chart?.destroy()
      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: dates,
          datasets: datasets,
        },
      });
    }
  }  
  getDate(logDate: Date, dateToMatch:string): boolean{
    let splittedDate = logDate.toString().split('/');
    let dtm = dateToMatch.split('/')
    return splittedDate[0].replace(/^0+/, '') === dtm[1] 
      && splittedDate[1].replace(/^0+/, '') == dtm[0] 
      && splittedDate[2] == (dtm[2].length > 2 ? dtm[2].slice(2,4) : dtm[2])
  }
  random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
  }
}
