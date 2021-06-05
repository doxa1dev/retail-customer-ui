import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-placeholder-loading',
  templateUrl: './placeholder-loading.component.html',
  styleUrls: ['./placeholder-loading.component.scss']
})
export class PlaceholderLoadingComponent implements OnInit {

  @Input() component: any;

  constructor() { }

  ngOnInit(): void {
  }

}
