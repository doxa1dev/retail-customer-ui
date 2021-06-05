import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { Title } from 'app/core/enum/title';
import { JustHostService } from 'app/core/service/just-host.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.component.html',
  styleUrls: ['./detail-event.component.scss']
})
export class DetailEventComponent implements OnInit {

  constructor(
    private justHostService : JustHostService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }
  title = Title.LEFT_LINK;
  eventDetail: any;
  event_id : number;
  imgUrl: string;
  storageUrl = environment.storageUrl;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param=>{
      this.event_id = param.id;
      this.getDataDetail(this.event_id);
    })
  }

  getDataDetail(id){
    this.justHostService.getJustHostDetail(id).subscribe(data=>{
      console.log(data)
      this.eventDetail = data;
      this.imgUrl = this.storageUrl + data.demo_photo;
    })
  }

  goBack(){
    this.router.navigate(['/advisor/just-host'])
  }
}
