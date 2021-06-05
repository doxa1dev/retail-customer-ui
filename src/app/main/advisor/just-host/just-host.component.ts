import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Title } from 'app/core/enum/title';
import { OrderJustHost } from 'app/core/models/order.model';
import { CartService } from 'app/core/service/cart.service';
import { SharedService } from 'app/core/service/commom/shared.service';
import { JustHostBackEndStatus, JustHostRenderUIStatus, JustHostService } from 'app/core/service/just-host.service';
import { OrderService } from 'app/core/service/order.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { DialogHostGiftComponent } from 'app/main/common-component/dialog-host-gift/dialog-host-gift.component';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { PROPERTY } from 'app/main/product-detail/product-detail.component';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-just-host',
  templateUrl: './just-host.component.html',
  styleUrls: ['./just-host.component.scss'],
  providers: [MessageService],
})
export class JustHostComponent implements OnInit , AfterViewInit{

  constructor(
    public dialog: MatDialog,
    private orderService : OrderService,
    private router: Router,
    private justHostService : JustHostService,
    private cartService: CartService,
    private sharedService: SharedService,
    private messageService: MessageService,
  ) { }

  title = Title.DOT;
  totalSize: number = 0;
  arrImage  = [];
  storageUrl = environment.storageUrl;
  allOrderRedeem  = [];
  allGift = [];

  total_product: number = 0;
  cartData : any; 
  idCartAdvisor: string;
  cart_Id: string;
  active: boolean;
  propertiesArray: PROPERTY[] = [];
  maxOrder: number;
  advisor_id;
  cartDiscount;
  select_gift

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<OrderJustHost>;

  ngOnInit(): void {
    this.getDataAllOrderRedeem();
  }

  ngAfterViewInit(){
    this.getAllGift();
  }
  
  getDataAllOrderRedeem(){
    this.justHostService.getAllJustHostCustomer().subscribe(data=>{
      if(!CheckNullOrUndefinedOrEmpty(data)){
        this.allOrderRedeem = data;
        this.totalSize = this.allOrderRedeem.length;
        this.dataSource = new MatTableDataSource(this.allOrderRedeem);
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      }
    })
  }

  getAllGift(){
    this.justHostService.getAllGift().subscribe(data=>{
      // console.log("all" , data)
      this.allGift = data.result;
      this.select_gift = data.select_gift;
    })
  }
  
  addGiftToCart(order){
    order.checkRedeem = false;
    if(!CheckNullOrUndefinedOrEmpty(this.allGift)){
      let gift = this.allGift[0]?.component.find(e=> {return e.is_main_gift_product});
      if(this.allGift?.length == 1 && (gift?.properties.length == 0)){
        let main_product = gift;
        this.commonAddTocart(main_product.product_id , main_product.host_gift_id , order.id , main_product.hasAdvisor );
        this.updateStatusJustHost(order);
      }else if(this.allGift?.length > 1 || (this.allGift?.length == 1 && (gift?.properties.length > 0))){
        const dialogNotifi = this.dialog.open(DialogHostGiftComponent, {
          width: "600px",
          data: {
            host_gift: this.allGift,
            select_gift_arr: this.select_gift,
            cartDiscount: this.cartDiscount,
            just_host: true
          },
        });
        dialogNotifi.afterClosed().subscribe(result =>{
          order.checkRedeem = true;
          if(result?.state){
            let host_gift = this.allGift?.find(e=>{return Number(e.id)== Number(result.gift_id)});
            let main_product = host_gift.component.find(e=>{return e.is_main_gift_product})
            this.commonAddTocart(main_product.product_id , main_product.host_gift_id , order.id , main_product.hasAdvisor , result.property );
            this.updateStatusJustHost(order);
          }
        })
      }
    }else{
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:
          "No gift is available.",
          title: "CONFIRM",
          colorButton: true,
        },
      });
      this.updateStatusJustHost(order) ;
      order.checkRedeem = true;
    }
  }

  updateStatusJustHost(order){
    order.status =  JustHostRenderUIStatus.REDEEMED;
    let formUpdate = {
      status: JustHostBackEndStatus.REDEEMED, 
      event_id: order.id
    }
    this.justHostService.updateStatusEvent(formUpdate).subscribe();
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
      gift_type: 'JUST_HOST'
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

  nextToCreateEvent(){
    this.router.navigate(["/advisor/just-host-event-form"]);
  }

  nextToEventDetail(id){
    this.router.navigate(["/advisor/detail-event-form"], { queryParams: { id: id }});
  }
  
  // async onChangeFile(event){
  //   console.log(event)
  //   if(event.target.files?.length > 5){
  //     const dialogRef = this.dialog.open(CommonDialogComponent, {
  //       width: "500px",
  //       data: {
  //         message:
  //           "Cannot add more than 5 files. Please choose another.",
  //         title: "CONFIRM",
  //         colorButton: true,
  //       },
  //     });
  //   }else{
  //     this.arrImage = [];
  //     for (let i = 0; i < event.target.files?.length; i++) {
  //       this.arrImage.push(event.target.files[i]) 
  //     }
  //     console.log(this.arrImage)
  //     this.arrImage.forEach(e=>{
  //       const reader = new FileReader();
  //       reader.readAsDataURL(e);
  //       reader.onload = async (event) => {
  //         let preSignedUrl: string;
  //         let profilePhotoKey: string;
  //         let response = await this.orderService.getPreSignedUrl(Date.now().toString() + e.name, e.type)
  //         if (response.code === 200) {
  //           profilePhotoKey = response.key;
  //           preSignedUrl = response.url;
  //           this.activityService.uploadActivityImage(preSignedUrl, e.type, e).subscribe(
  //             response => {
  //               this.myProfileImgUrl = this.storageUrl + profilePhotoKey;
  //             }
  //           );
  //           this.coverphotokey = profilePhotoKey;
  //           return profilePhotoKey;
  //         }

  //       };
  //     })
  //   }
  // }
}
