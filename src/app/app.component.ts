import { Component, ViewChild, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // AG Grid Component
import { ColDef, IDateFilterParams } from 'ag-grid-community'; // Column Definition Type Interface
import { Injectable } from '@angular/core';
import {  WorkBook, read, utils, write, readFile } from 'xlsx';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkLog } from './modules/WorkLog';
import  {  NgbToast, NgbToastService, NgbToastType }  from  'ngb-toast';
var moment = require('moment')

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  styles: [`
		.dp-hidden {
			width: 0;
			margin: 0;
			border: none;
			padding: 0;
		}
		.custom-day {
			text-align: center;
			padding: 0.185rem 0.25rem;
			display: inline-block;
			height: 2rem;
			width: 2rem;
		}
		.custom-day.focused {
			background-color: #e6e6e6;
		}
		.custom-day.range,
		.custom-day:hover {
			background-color: rgb(2, 117, 216);
			color: white;
		}
		.custom-day.faded {
			background-color: rgba(2, 117, 216, 0.5);
		}
	`],
})
export class AppComponent {
  title = 'worklog-analyzer';
  rowData: WorkLog[] = [];
  isViewTypeList:boolean = true;
  errMsg = '';
  showToast = false;
  constructor(private  toastService:  NgbToastService) {}
  hideToast(){
    this.showToast = false;
  }
  showSuccess(): void {
		const toast: NgbToast = {
			toastType:  NgbToastType.Success,
			text:  "This is an sample success toast with dismissible action",
			dismissible:  true,
			onDismiss: () => {
				console.log("Toast dismissed!!");
			}
		}
		this.toastService.show(toast);
	}
	
	removeToast(toast: NgbToast): void {
		this.toastService.remove(toast);
	}
  filterParams: IDateFilterParams = {
    comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split("/");
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0]),
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
      return 0;
    },};
  calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
  changeView(type:string){
    this.isViewTypeList = (type === 'list') ? true : false
  }
	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}
  isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "author" },
    { field: "logDate", filter: "agDateColumnFilter",
    filterParams: this.filterParams, },
    { field: "workLog" },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: "agTextColumnFilter",
    menuTabs: ["filterMenuTab"],
  };
  async handleFileInput(files: any | null){
    let f: File = files?.files.item(0);
    let fileName = f.name.split('.');
    if(fileName.length !== 2 || fileName[1] !== 'xlsx'){
      alert('Invalid file type')
      return;
    } 
    if (f){
      let x = new Blob([f]);
      try{
        let y = await this.convertExcelToJson(x)
        this.rowData = y;
      }
      catch(ex:any){
        // this.showSuccess()
        // this.errMsg = ex.toString()
        // this.showToast = true;
        alert(ex)
      }
    }
  }
  readOpts = { // <--- need these settings in readFile options
    cellText:false, 
    cellDates:true
  };
  
  convertExcelToJson(file: Blob): Promise<WorkLog[]>
   {
    let reader = new FileReader();
    let workbookkk: WorkBook;
    let XL_row_object : any[];
    let json_object;
    reader.readAsBinaryString(file);
    return new Promise((resolve, reject) => {
      reader.onload = function(){
        try {
          
          let data = reader.result;
          workbookkk=read(data,{type: 'binary'});
          workbookkk.SheetNames.forEach(function(sheetName) {
          // Here is your object
          XL_row_object = utils.sheet_to_json(workbookkk.Sheets[sheetName], {
            header: 1,
            defval: '',
            blankrows: true,
            raw: false,
            dateNF: 'd"/"m"/"yyyy' // <--- need dateNF in sheet_to_json options (note the escape chars)
          });
          let wl: WorkLog[] = [];
          if(XL_row_object[0][0] !== 'AUTHOR'){
            reject("Invalid file data")
          }
          XL_row_object?.slice(1).forEach((log:any) => {
            log[0] !== '' && 
            wl.push(
              {author: log[0], logDate: moment().format(log[1], "DD/MM/YYYY" ), workLog: Number.parseInt(log[2])})
            })
            resolve(wl);
          });
        } catch (error) {
          reject(error)
        }
        };
    });
  }
}
