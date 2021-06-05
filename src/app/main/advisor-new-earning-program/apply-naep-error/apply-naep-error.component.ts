import { Component, OnInit } from '@angular/core';
import { Title } from 'app/core/enum/title';

@Component({
  selector: 'app-apply-naep-error',
  templateUrl: './apply-naep-error.component.html',
  styleUrls: ['./apply-naep-error.component.scss']
})
export class ApplyNaepErrorComponent implements OnInit {

  title = Title.LEFT;
  
  constructor() { }

  ngOnInit(): void {
  }

}
