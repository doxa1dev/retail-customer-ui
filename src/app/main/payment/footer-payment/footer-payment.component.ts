import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input , Inject, Output , EventEmitter} from '@angular/core';
import { OrderService } from 'app/core/service/order.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-footer-payment',
  templateUrl: './footer-payment.component.html',
  styleUrls: ['./footer-payment.component.scss']
})
export class FooterPaymentComponent implements OnInit {

  @Input() pending_verified: any;
  @Input() verified: any;
  @Input() remaining: number;
  @Input() toPay: number;
  @Input() shipping: number;
  @Input() subtotal: number;
  @Input() total: number;
  @Input() currency: any;
  @Input() uuid: string;
  @Input() linkShare: boolean;
  @Input() selectPayment: boolean;
  @Input() paymentContinue: boolean;
  @Output() addMessage = new EventEmitter();
  @Input() is_buy_for_customer: boolean;
  entity = environment.entity;
  constructor(
    private orderService: OrderService,
    @Inject(DOCUMENT) private document: Document
  ) {
   }
  sessionUuid: string;
  ngOnInit(): void {

  }

  copyLink(){
    const port = this.document.location.port ? `:${this.document.location.port}` : '' ;
    this.orderService.createSessionOrder(this.uuid).subscribe(data=>{
      this.sessionUuid = (data.code === 200) ? data.data : "" ;
      let url = this.entity !== "MY" 
      ? `${this.document.location.protocol}//${this.document.location.hostname}${port}/select-payment?session=${this.sessionUuid}`
      : `${this.document.location.protocol}//${this.document.location.hostname}${port}/payment-options-full?session=${this.sessionUuid}`
      let share = document.createElement('textarea');
      share.value = url;
     
      document.body.appendChild(share);
      share.select();
      document.execCommand('Copy');
      share.remove();
      this.addMessage.emit()
    })
  }

  shareWhatApp(){
    const port = this.document.location.port ? `:${this.document.location.port}` : '';
    this.orderService.createSessionOrder(this.uuid).subscribe(data=>{
      this.sessionUuid = (data.code === 200) ? data.data : "" ;
      let url = this.entity !== "MY" 
      ? `${this.document.location.protocol}//${this.document.location.hostname}${port}/select-payment?session=${this.sessionUuid}`
      : `${this.document.location.protocol}//${this.document.location.hostname}${port}/payment-options-full?session=${this.sessionUuid}`;

      this.whatApp(url);
    })
  }

  whatApp(url){
    const isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return (
          navigator.userAgent.match(/IEMobile/i) ||
          navigator.userAgent.match(/WPDesktop/i)
        );
      },
      any: function () {
        return (
          isMobile.Android() ||
          isMobile.BlackBerry() ||
          isMobile.iOS() ||
          isMobile.Opera() ||
          isMobile.Windows()
        );
      },
    };

    const messageText = `Yippee!%20I've%20sent%20you%20a%20link%20to%20pay%20now%20and%20let%20Thermomix®%20cook%20for%20you%20today:%20`
    if (isMobile.any()) {
      const shareUrl = `whatsapp://send?text=${messageText}${url}`;
      location.href = shareUrl;
    } else {
      window.open(
        `https://web.whatsapp.com/send?l=en&text=${messageText}${encodeURIComponent(url)}`,
        '_blank'
      );
    }
  }

}
