import { Product } from './../../../../core/models/product.model';
import { Component, Input, OnInit } from '@angular/core';
import { Title } from 'app/core/enum/title';
import { ActivatedRoute, Router } from '@angular/router';
import { MyCustomersService } from 'app/core/service/my-customers.service';
import { environment } from 'environments/environment';
import { CustomerInformation } from 'app/core/models/my-customers';
import { isNullOrUndefined } from 'util';
import { Order } from 'app/core/service/order.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

  uuid: string;
  title = Title.LEFT;

  version1 = environment.questionnaireOneVersion;
  version2 = environment.questionnaireTwoVersion;
  customer = new CustomerInformation();
  storageUrl = environment.storageUrl;
  imageAdvisor: string;
  imageRecruiter: string;
  imageTeamLeader: string;
  isShowListedPrice: boolean;
  imageBranchManager: string;
  totalSize: number = 0;
  listedPrice: string;
  price:string;
  currencyCode: string;
  @Input() product: Product;
  FULL_PAYMENT_GIFT = 'Full Payment Gift';
  ONLINE_BANK_TRANSFER_PAYMENT_GIFT = 'Online Bank Transfer Payment Gift';
  existValue: any;

  orderHistory;
  constructor(private activatedRoute: ActivatedRoute,
    private customerService: MyCustomersService,
    private router: Router) {
      this.existValue = false;
    }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.uuid = params.uuid;
    });

    this.customerService.getCustomerDetail(this.uuid, this.version1, this.version2).subscribe(
      data => {
        this.customer = data;
        this.totalSize = data.orderHistory.length;
        if (!isNullOrUndefined(this.customer.advisorImage)) {
          this.imageAdvisor = this.storageUrl + this.customer.advisorImage
        } else {
          this.imageAdvisor = 'assets/icons/ICON/UserMenu.svg';
        }

        if (!isNullOrUndefined(this.customer.recruiterImage)) {
          this.imageRecruiter = this.storageUrl + this.customer.recruiterImage
        } else {
          this.imageRecruiter = 'assets/icons/ICON/UserMenu.svg';
        }

        if (!isNullOrUndefined(this.customer.branchManagerImage)) {
          this.imageBranchManager = this.storageUrl + this.customer.branchManagerImage
        } else {
          this.imageBranchManager = 'assets/icons/ICON/UserMenu.svg';
        }

        if (!isNullOrUndefined(this.customer.teamLeaderImage)) {
          this.imageTeamLeader = this.storageUrl + this.customer.teamLeaderImage
        } else {
          this.imageTeamLeader = 'assets/icons/ICON/UserMenu.svg';
        }
        this.existValue = this.checkHiddenAdvisingTeam(this.customer);
      }
    )
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

  totalItem(order)
  {
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

}
