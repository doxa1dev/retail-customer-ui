import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-warrantied',
  templateUrl: './warrantied.component.html',
  styleUrls: ['./warrantied.component.scss']
})
export class WarrantiedComponent implements OnInit {

  storageUrl: string = environment.storageUrl;
  @Input() warranty;
  @Input() productName;
  constructor() { }

  ngOnInit(): void {
   // console.log(this.warranty)
  }
  

}
