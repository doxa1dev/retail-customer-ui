import { Component, OnInit } from '@angular/core';
import { Title } from 'app/core/enum/title';

@Component({
  selector: 'app-recruit-new-advisor-done',
  templateUrl: './recruit-new-advisor-done.component.html',
  styleUrls: ['./recruit-new-advisor-done.component.scss']
})
export class RecruitNewAdvisorDoneComponent implements OnInit {

  title = Title.LEFT;
  
  constructor() { }

  ngOnInit(): void {
  }

}
