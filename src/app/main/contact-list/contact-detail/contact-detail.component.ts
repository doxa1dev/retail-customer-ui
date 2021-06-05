import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from 'app/core/enum/title';
import { MyContactsService } from 'app/core/service/my-contact.service';
import { environment } from 'environments/environment';
import { CustomerInformation } from 'app/core/models/my-customers';
import { Product } from 'app/core/models/product.model';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { DialogConfirmComponent} from 'app/main/common-component/dialog-confirm/dialog-confirm.component'
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {

  version1 = environment.questionnaireOneVersion;
  version2 = environment.questionnaireTwoVersion;
  uuid: string;
  title = Title.LEFT;

  customer = new CustomerInformation();
  storageUrl = environment.storageUrl;
  imageAdvisor: string;
  imageRecruiter: string;
  imageTeamLeader: string;
  isShowListedPrice: boolean;
  imageBranchManager: string;
  totalSize: number = 0;
  listedPrice: string;
  price: string;
  currencyCode: string;
  @Input() product: Product;
  orderHistory;
  existValue: any;

  FULL_PAYMENT_GIFT = 'Full Payment Gift';
  ONLINE_BANK_TRANSFER_PAYMENT_GIFT = 'Online Bank Transfer Payment Gift';

  constructor(private activatedRoute: ActivatedRoute,
    private contact: MyContactsService,
    public  dialog    : MatDialog,

    private router: Router) {
      this.existValue = false;
    }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.uuid = params.uuid;
    });

    this.getDataContactDetail(this.uuid, this.version1, this.version2);
  }

  getDataContactDetail(uuid, version1, version2) {
    this.contact.getContactDetail(uuid, version1, version2).subscribe(data => {
      this.customer = data;
      this.totalSize = data.orderHistory.length;

      if (!CheckNullOrUndefinedOrEmpty(this.customer.advisorImage)) {
        this.imageAdvisor = this.storageUrl + this.customer.advisorImage;
      } else {
        this.imageAdvisor = 'assets/icons/ICON/UserMenu.svg';
      }

      if (!CheckNullOrUndefinedOrEmpty(this.customer.recruiterImage)) {
        this.imageRecruiter = this.storageUrl + this.customer.recruiterImage
      } else {
        this.imageRecruiter = 'assets/icons/ICON/UserMenu.svg';
      }

      if (!CheckNullOrUndefinedOrEmpty(this.customer.branchManagerImage)) {
        this.imageBranchManager = this.storageUrl + this.customer.branchManagerImage
      } else {
        this.imageBranchManager = 'assets/icons/ICON/UserMenu.svg';
      }

      if (!CheckNullOrUndefinedOrEmpty(this.customer.teamLeaderImage)) {
        this.imageTeamLeader = this.storageUrl + this.customer.teamLeaderImage
      } else {
        this.imageTeamLeader = 'assets/icons/ICON/UserMenu.svg';
      }

      this.existValue = this.checkHiddenAdvisingTeam(this.customer);
    })
  }

  checkHiddenAdvisingTeam(customerInfo) {
    return (customerInfo.advisorId || customerInfo.advisorName || customerInfo.advisorImage)
          || (customerInfo.branchManagerId || customerInfo.branchManagerName || customerInfo.branchManagerImage)
          || (customerInfo.recruiterId || customerInfo.recruiterName || customerInfo.recruiterImage)
          || (customerInfo.teamLeaderId || customerInfo.teamLeaderName || customerInfo.teamLeaderImage);
  }

  onViewQuestionOne() {
    this.router.navigate(['advisor/my-customers/questionnaire-one'], {queryParams: {uuid: this.uuid}})
  }

  onViewQuestionTwo() {
    this.router.navigate(['advisor/my-customers/questionnaire-two'], {queryParams: {uuid: this.uuid}})
  }

  totalItem(order) {
    let total = 0;
    if (order.listProduct.length > 0)
    {
      order.listProduct.forEach(product =>
      {
        total = total + product.quantity;
      });
      return total;
    }
  }

  deleteContact(){
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: { message: 'If you remove this Contact, both of you will not be able to see each other in My Contacts. Are you sure you want to continue?', type : "COMMON",btnNo :"NO",btnYes:"YES" }
      
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result === true){
        this.contact.removeContactList(this.customer.id).subscribe(data=>{
          if(data.code === 200)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Remove this contact successfully.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(data =>
            {
              this.router.navigate(['/contact-list'])
            })
          }else{
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Error happen when remove this Contact. Please try later.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(data =>
            {
              return;
            })
          }
        })
       
      }else{
        dialogRef.close();
      }
    })
  }
}
