import { Component, OnInit ,Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-pay',
  templateUrl: './footer-pay.component.html',
  styleUrls: ['./footer-pay.component.scss']
})
export class FooterPayComponent implements OnInit {
  @Input() subTotal = 0;
  shipping = 5.00;
  @Input() sumTotal = 0;
  @Input() showButton : String;

  showbtnCheckOut = true;
  showbtnViewSummary = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadButton();
  }

  loadButton() {
    if (this.showButton === "CHECK OUT") {
      this.showbtnCheckOut = false;
      this.showbtnViewSummary = true;
    } 
    else if (this.showButton === "VIEW SUMMARY") {
      this.showbtnCheckOut = true;
      this.showbtnViewSummary = false;
    }
  }

  movedOnCheckOut() {
    this.router.navigate(['/check-out']);
  }

  movedOnOrderSummary() {
    this.router.navigate(['/order-summary']);
  }
}
