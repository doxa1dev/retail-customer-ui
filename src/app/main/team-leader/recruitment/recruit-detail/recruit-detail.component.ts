import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Title} from 'app/core/enum/title'
import { ActivatedRoute, Router} from '@angular/router';
import { isNullOrUndefined } from 'util';
import { TeamdLeaderService} from 'app/core/service/teamleader.service';
import { recruitDetail} from 'app/core/models/list_recruit.model'
import { environment} from "environments/environment";
import { RecruitEnum} from "app/core/enum/recruit";
import { CommonDialogComponent} from 'app/main/common-dialog/common-dialog.component';
import { DialogConfirmComponent} from 'app/main/common-component/dialog-confirm/dialog-confirm.component'
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-recruit-detail',
  templateUrl: './recruit-detail.component.html',
  styleUrls: ['./recruit-detail.component.scss']
})
export class RecruitDetailComponent implements OnInit {
  title = Title.LEFT;
  dataReturn: recruitDetail;
  uuid_recruit: string;
  inputComment : string = '';
  showError : boolean;
  storage_url = environment.storageUrl;
  status_pending = RecruitEnum.PENDING;
  status_approve = RecruitEnum.APPROVED;
  status_reject = RecruitEnum.REJECTED;
  is_have_avatar : boolean = false;
  constructor(
    private location: Location,
    public dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private teamdLeaderService: TeamdLeaderService,
    private router : Router,
    public translateService: TranslateService
  ) { }

  ngOnInit(): void
  {
    this._activatedRoute.queryParams.subscribe(params =>
    {
      this.uuid_recruit = params.uuid;
    })
    if(!isNullOrUndefined(this.uuid_recruit)){
      this.teamdLeaderService.getRecruitDetail(this.uuid_recruit).subscribe(
        (data) => {
          this.dataReturn = data;
          this.is_have_avatar = this.dataReturn.photo_key == null ? false : true;
        }
      );
    }
  }


  rejectRecruit()
  {
    if (this.inputComment === '' )
    {
      this.showError = true;
      return;
    }
    else{
      this.showError = false;
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      // data: { message: 'Do you wish to reject?', type : "REJECTED" }
      data: { message: this.translateService.instant('TEAM_LEADER.CONFIRM_REJECT'), type : "REJECTED" }
    });
    dialogRef.afterClosed().subscribe(result =>
    {
      if (result === true)
      {
        this.teamdLeaderService.recruitApproveOrReject(this.uuid_recruit, { comment: this.inputComment, isApproval: false}).subscribe((data)=>{
          if (data.code === 200)
          {
            this.router.navigate(['teamleader/recruitment'])
          }
        })

      } else
      {
        dialogRef.close();
      }
    })
    }
    
  }

  approveRecruit()
  {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      // data: { message: 'Do you wish to approve?', type : "APPROVED" }
      data: { message: this.translateService.instant('TEAM_LEADER.CONFIRM_APPROVE'), type : "APPROVED" }
    });
    dialogRef.afterClosed().subscribe(result =>
    {
      if (result === true)
      {

        this.teamdLeaderService.recruitApproveOrReject(this.uuid_recruit, { comment: null, isApproval: true }).subscribe((data) =>
        {
           if (data.code === 200)
          {
             this.router.navigate(['teamleader/recruitment'])
          }
        })

      } else
      {
        dialogRef.close();
      }
    })
  }
  back()
  {
    this.location.back();
  }
}
