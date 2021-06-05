import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Title } from 'app/core/enum/title';
import { OrderRedeem } from 'app/core/models/order.model';
import { AuthService } from 'app/core/service/auth.service';
import { CartService } from 'app/core/service/cart.service';
import { SharedService } from 'app/core/service/commom/shared.service';
import { HostGiftAdvisorType, HostGiftEnum, OrderService } from 'app/core/service/order.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { DialogHostGiftComponent } from 'app/main/common-component/dialog-host-gift/dialog-host-gift.component';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { PROPERTY , ArrayProperties } from 'app/main/product-detail/product-detail.component';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-host-gift',
  templateUrl: './host-gift.component.html',
  styleUrls: ['./host-gift.component.scss'],
  providers: [MessageService],
})
export class HostGiftComponent implements OnInit {

  title = Title.DOT;
  totalSize: number = 0;
  allOrderRedeem  = [];
  allHostGift: any;
  total_product: number = 0;
  cartData : any; 
  idCartAdvisor: string;
  cart_Id: string;
  active: boolean;
  propertiesArray: PROPERTY[] = [];
  maxOrder: number;
  advisor_id;
  cartDiscount;
  constructor(
    private router : Router,
    private orderService : OrderService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private cartService: CartService,
    private _Auth: AuthService,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<OrderRedeem>;

  ngOnInit(): void {
    this.getDataAllOrderRedeem();
    this.getCartCustomer();
    this.checkAdvisor();
  }

  getDataAllOrderRedeem(){
    this.orderService.getAllOrderHostGift().subscribe(data=>{
      if(!CheckNullOrUndefinedOrEmpty(data)){
        this.allOrderRedeem = data;
        this.totalSize = this.allOrderRedeem.length;
        this.dataSource = new MatTableDataSource(this.allOrderRedeem);
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      }
    })
  }

  async getHostGift(date){
    await this.orderService.getAllHostGift(date);
  }

  getCartCustomer(){
    this.cartService.getCartByCustomerId().subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.cartData = data;
        this.idCartAdvisor = data.cart_advisor_customer_id;
        this.cart_Id = data.id;
        this.total_product = data.cartItems.length;
      } else {
        this.total_product = 0;
      }
    });
  }

  async addGiftToCart(order){
    order.checkRedeem = false;
    let response = await this.orderService.getAllHostGift(order.date_query);
    this.allHostGift = response?.gift;
    this.cartDiscount = response?.discountCart;

    if(!CheckNullOrUndefinedOrEmpty(this.allHostGift?.host_gift)){
      let gift = this.allHostGift?.host_gift[0]?.component.find(e=> {return e.is_main_gift_product});
      if(this.allHostGift?.host_gift.length == 1 && (gift?.properties.length == 0)){
        let main_product = this.allHostGift?.host_gift[0]?.component.find(e=>{return e.is_main_gift_product})
        this.commonAddTocart(main_product.product_id , main_product.host_gift_id , order.advisor_host_gift_id , main_product.hasAdvisor );
        this.updateStatusHostGift(order);
      }else if(this.allHostGift?.host_gift.length > 1 || (this.allHostGift?.host_gift.length == 1 && (gift?.properties.length > 0))){
        const dialogNotifi = this.dialog.open(DialogHostGiftComponent, {
          width: "600px",
          data: {
            host_gift: this.allHostGift.host_gift,
            select_gift_arr: this.allHostGift.select_host_gift,
            cartDiscount: this.cartDiscount
          },
        });
        dialogNotifi.afterClosed().subscribe(result =>{
          order.checkRedeem = true;
          if(result?.state){
            let host_gift = this.allHostGift?.host_gift.find(e=>{return Number(e.id)== Number(result.gift_id)});
            let main_product = host_gift.component.find(e=>{return e.is_main_gift_product})
            this.commonAddTocart(main_product.product_id , main_product.host_gift_id , order.advisor_host_gift_id , main_product.hasAdvisor , result.property );
            this.updateStatusHostGift(order);
          }
        })
      }
    }else{
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:
          "No host gift is available.",
          title: "CONFIRM",
          colorButton: true,
        },
      });
      this.updateStatusHostGift(order , true) ;
      order.checkRedeem = true;
    }
  }

  updateStatusHostGift(order , applicable?){
    order.status = !applicable ? HostGiftEnum.REDEEMED : HostGiftEnum.NOT_APPLICABLE
    let formUpdate = {
      status: !applicable ? HostGiftAdvisorType.REDEEMED : HostGiftAdvisorType.NOT_APPLICABLE, 
      id: order.advisor_host_gift_id
    }
    this.orderService.updateHostGiftStatus(formUpdate).subscribe();
  }

  commonAddTocart(id , host_gift_id , advisor_host_gift_id , hasAdvisor ,  propertiesOfProduct?)
  {
    const param = {
      product_id: id,
      quantity: 1,
      properties: !CheckNullOrUndefinedOrEmpty(propertiesOfProduct) ? propertiesOfProduct : {},
      is_deleted: false,
      advisor_customer_id: hasAdvisor
      ? this.advisor_id.id : null,
      host_gift_id: host_gift_id,
      advisor_host_gift_id: advisor_host_gift_id,
      gift_type: 'HOST_GIFT'
    };
    
    this.cartService.addToCart(param).subscribe((data) => {
      if (data.code === 200) {
        this.sharedService.sharedMessage.subscribe(
          (message) => (this.total_product = message)
        );
        this.sharedService.nextCart(this.total_product + 1);
        this.active = false;
        this.messageService.add({ summary: 'Added to cart successfully.', severity: 'success', life: 4000});
      }else if ( data.code === 201 && data.message === "Product exceeds max order number.") 
      {
        this.active = false;
        const dialogRef = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              "Cannot order more than " +
              this.maxOrder +
              " for this product.",
            title: "CONFIRM",
            colorButton: true,
          },
        });
      }
      else if( data.code === 203){
        this.active = false;
        const dialogRef = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              "Cannot add a product with different currency into an existing cart. Please choose another.",
            title: "CONFIRM",
            colorButton: true,
          },
        });
      }
    });
  }

  
  checkAdvisor() {
    this._Auth.getAdvisorByCustomer().subscribe(
      (response) => {
        if (!CheckNullOrUndefinedOrEmpty(response)) {
          this.advisor_id = response;
        }
      }
    );
  }

}
