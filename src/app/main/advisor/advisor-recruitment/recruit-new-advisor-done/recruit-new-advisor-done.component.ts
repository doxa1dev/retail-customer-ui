import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from 'app/core/enum/title';

@Component({
  selector: 'app-recruit-new-advisor-done',
  templateUrl: './recruit-new-advisor-done.component.html',
  styleUrls: ['./recruit-new-advisor-done.component.scss']
})
export class RecruitNewAdvisorDoneComponent implements OnInit {

  constructor(private router: Router) { }
  title = Title.LEFT
  ngOnInit(): void {
  }

  back(){
    this.router.navigate(['advisor/recruitment']);;
  }
}
