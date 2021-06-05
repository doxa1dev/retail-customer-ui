import { isNullOrUndefined } from 'util';
import { Component, OnInit, Input } from '@angular/core';
import { Title} from 'app/core/enum/title';
import { Location} from '@angular/common'
import { Router } from '@angular/router'
@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {
  
  @Input() type: Title;
  @Input() message: string;
  @Input() option : string;
  @Input() link : string;
  @Input() param : any;
  constructor(
    private location : Location,
    private router : Router,
  ) { }
  title_left = Title.LEFT;
  title_dot = Title.DOT;
  title_link = Title.LEFT_LINK;
  ngOnInit(): void {
  }

  back(){
    this.location.back();
  }
  back_link(){
    if(!isNullOrUndefined(this.link))
    {
      if(!isNullOrUndefined(this.param))
      {
        this.router.navigate([this.link], { queryParams: this.param });
        
      }else{
        this.router.navigate([this.link]);
        
      }

      
    }
  }
}
