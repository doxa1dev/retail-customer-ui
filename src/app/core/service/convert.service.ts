import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import { QUESTION_QUESTIONNAIRE } from '../constants/constant';


@Injectable(
  {
    providedIn: "root",
  }
)
export class ConvertService {

  questionQuestionnaire = QUESTION_QUESTIONNAIRE;
  constructor() { }

    downloadFile(data, filename='data', totalQuantity ,  totalPrice, typeReportValue) {
      let csvData;

      if(!isNullOrUndefined(typeReportValue)){
        if (typeReportValue === 'total_sales') {
          csvData = this.ConvertToCSV(data, ['shippingLocation','orderID','customerFirstName', 'customerLastName', 'customerID', 'phoneNumber', 'email', 'advisorName', 'advisorID',
          'teamManagerName', 'teamManagerID', 'branchName', 'product', 'quantity', 'totalAmount', 'orderStatus', 'salesType',
          'startDay', 'lastUpdate'], ['Area','Order ID','First Name', 'Last Name', 'ID', 'Phone Number', 'Email', 'Advisor Name', 'Advisor ID',
          'Team Manager Name', 'Team Manager ID', 'Branch Name', 'Product', 'Quantity', 'Total Amount', 'Order Status', 'Sales Types',
          'Start Day   ', 'Last Update   '] ,totalQuantity, totalPrice);

        } else if (typeReportValue === 'naep_recruitment'){
          csvData = this.ConvertToCSVForNAEP(data, ['advisorName','advisorID', 'dateJoin', 'recruiterName', 'recruiterId',
          'teamManagerName', 'teamManagerID', 'branchName', 'branchId', 'email', 'mobilePhone', 'addressLine1', 'addressLine2',
          'addressLine3', 'bankCode', 'bankAccountNumber', 'bankHolder'], ['Advisor','Advisor ID', 'Date join', 'Recruiter', 'Recruiter ID',
          'Team manager name', 'Team manager ID', 'Branch name',  'Branch manager ID', 'Email', 'Mobile phone', 'Address 1', 'Address 2',
          'Address 3', 'Bank code', 'Bank account number', 'Bank holder']);

        } else if (typeReportValue === 'first_sales'){
          csvData = this.ConvertToCSVForNAEP(data, ['advisorName','advisorID', 'dateJoin', 'product', 'firstSalesOn', 'totalDays', 'recruiterName', 'recruiterId',
          'teamManagerName', 'teamManagerID', 'branchName','branchId', 'email', 'mobilePhone', 'addressLine1', 'addressLine2',
          'addressLine3', 'bankCode', 'bankAccountNumber', 'bankHolder'], ['Advisor','Advisor ID', 'Date join', 'Product', 'First sales on', 'Total days', 'Recruiter name', 'Recruiter ID',
          'Team manager name', 'Team manager ID', 'Branch name',  'Branch manager ID','Email', 'Mobile phone', 'Address 1', 'Address 2',
          'Address 3', 'Bank code', 'Bank account number', 'Bank holder']);

        } else if (typeReportValue === 'naep_success'){
          csvData = this.ConvertToCSVForNAEP(data, ['advisorName','advisorID', 'dateJoin', 'recruiterName', 'recruiterId',
          'teamManagerName', 'teamManagerID', 'branchName', 'branchId','email', 'mobilePhone', 'addressLine1', 'addressLine2',
          'addressLine3', 'bankCode', 'bankAccountNumber', 'bankHolder'], ['Advisor','Advisor ID', 'Date join', 'Recruiter', 'Recruiter ID',
          'Team manager name', 'Team manager ID', 'Branch name', 'Branch manager ID', 'Email', 'Mobile phone', 'Address 1', 'Address 2',
          'Address 3', 'Bank code', 'Bank account number', 'Bank holder']);

        } else if (typeReportValue === 'questionnaire') {
          csvData = this.ConvertToQuestionnaire(data, 
            [
              'nameInIC', 'preferredName', 'email', 'phoneNumber', 'answer1', 'answer2', 'answer3', 'answer4', 'answer5', 'answer6', 'answer7', 'answer8',
              'answer9', 'answer10', 'answer11', 'answer12', 'answer13', 'answer14'
            ], 
            ['Name as in I.C', 'Preferred Name', 'Email', 'Phone Number', this.questionQuestionnaire[0].text, this.questionQuestionnaire[1].text, this.questionQuestionnaire[2].text,
            this.questionQuestionnaire[3].text, this.questionQuestionnaire[4].text, this.questionQuestionnaire[5].text,
            this.questionQuestionnaire[6].text, this.questionQuestionnaire[7].text, this.questionQuestionnaire[8].text,
            this.questionQuestionnaire[9].text, this.questionQuestionnaire[10].text, this.questionQuestionnaire[11].text,
            this.questionQuestionnaire[12].text, this.questionQuestionnaire[13].text]);

        }
      }

        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename + ".csv");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }

    ConvertToCSV(objArray, headerList , option, totalQuantity , totalPrice) {
         let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
         let str = '';
         let row = 'No,';
         let total = 'Total'
         for (let index in option) {
             row += option[index] + ',';
         }
         row = row.slice(0, -1);
         str += row + '\r\n';
         for (let i = 0; i < array.length; i++) {
             let line = (i+1)+'';
             for (let index in headerList) {
                let head = headerList[index];

                 line += ',' + array[i][head];
             }
             str += line + '\r\n';
         }
         let line1 =',' +',' + ',' + ',' + ',' + ',' + ','+ ','+ ',' + ',' + ',' + ',' + ',' + total + ',' + totalQuantity + ',' + totalPrice;
         str += line1 + '\r\n';
         return str;
    }

    ConvertToCSVForNAEP(objArray, headerList , option) {
      let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      let str = '';
      let row = 'No,';
      let total = 'Total'
      for (let index in option) {
          row += option[index] + ',';
      }
      row = row.slice(0, -1);
      str += row + '\r\n';
      for (let i = 0; i < array.length; i++) {
          let line = (i+1)+'';
          for (let index in headerList) {
             let head = headerList[index];

              line += ',' + array[i][head];
          }
          str += line + '\r\n';
      }
      // let line1 =',' + ',' + ',' + ',' + ',' + ','+ ','+ ',' + ',' + total +',' + totalQuantity + ',' + totalPrice;
      // str += line1 + '\r\n';
      return str;
    }

    ConvertToQuestionnaire(objArray, headerList , option) {
      let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      let str = '';
      let row = '';
      for (let index in option) {
          row += option[index] + ',';
      }
      row = row.slice(0, -1);
      str += row + '\r\n';
      for (let i = 0; i < array.length; i++) {
          let line = '';

          for (let index in headerList) {
            let head = headerList[index];
            line += array[i][head] + ',';
          }
          str += line + '\r\n';
      }
      return str;
    }
}

export class Report {
  orderID: string;
  shippingLocation: string;
  customerName: string;
  customerPreferredName: string;
  customerFirstName: string;
  customerLastName: string;
  phoneNumber: string;
  email: string;
  customerID: string;
  advisorName: string;
  advisorID: string;
  teamManagerName: string;
  teamManagerID: string;
  branchName: string;
  branchId: string;
  product: string;
  quantity: string;
  orderStatus: string;
  totalAmount: string;
  startDay: string;
  lastUpdate: string;
  // lastLine: string;
  dateJoin: string;
  recruiterName: string;
  recruiterId: string;
  mobilePhone: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  bankCode: string;
  bankAccountNumber: number;
  bankHolder: string;
   string;

  firstSalesOn: string;
  totalDays: number;
  salesType: string;
}

