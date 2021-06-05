import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {

  private message = new BehaviorSubject(0);
  private news = new BehaviorSubject(0);
  //payment
  private selectPayment = new BehaviorSubject(0);
  private valuePayPartially = new BehaviorSubject(0);
  private valueToPay = new BehaviorSubject(0);
  private valueRemaining = new BehaviorSubject(0);
  private hasSinglePaymentGift = new BehaviorSubject(false);
  private hasOnlineBankingGift = new BehaviorSubject(false);
  private selectedGifts = new BehaviorSubject([]);

  sharedMessage = this.message.asObservable();
  sharedNews = this.news.asObservable();
  sharedSelectPayment = this.selectPayment.asObservable();
  sharedPayPartially = this.valuePayPartially.asObservable();
  sharedToPay = this.valueToPay.asObservable();
  sharedRemaining = this.valueRemaining.asObservable();
  sharedSinglePaymentGift = this.hasSinglePaymentGift.asObservable();
  sharedOnlineBankingGift = this.hasOnlineBankingGift.asObservable();
  sharedSelectedGifts = this.selectedGifts.asObservable();

  constructor() { }

  nextCart(cartNumber: number) {
    this.message.next(cartNumber);
  }

  nextNewsNotification(notificationNumber: number) {
    this.news.next(notificationNumber);
  }

  nextPayment(valueRadio: number) {
    this.selectPayment.next(valueRadio);
  }

  nextValuePayPartially(value: number) {
    this.valuePayPartially.next(value);
  }

  nextValueToPay(value: number) {
    this.valueToPay.next(value);
  }

  nextValueRemaining(value: number) {
    this.valueRemaining.next(value);
  }

  nextHasSinglePaymentGift(value: boolean) {
    this.hasSinglePaymentGift.next(value);
  }

  nextHasOnlineBankingGift(value: boolean) {
    this.hasOnlineBankingGift.next(value);
  }

  nextGifts(value: any) {
    this.selectedGifts.next(value);
  }
}
