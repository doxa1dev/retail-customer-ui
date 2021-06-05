import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  productName = "THERMOMIX@ WHOLESOME VEGAN COOKBOOK TM5";
  oldPrice = "2,345.00";
  newPrice = "SGD 66.00";
  // language = "English";
  // advisor={
  //   name: "Asabella",
  //   id: 686458,
  // }
  
  constructor() { }

  ngOnInit(): void {
  }

}
