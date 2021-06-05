import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Product } from 'app/core/models/product.model';
import { OrderService, Order } from 'app/core/service/order.service';
import { isNullOrUndefined } from 'util';
import * as jwt_decode from 'jwt-decode';
import { Title } from 'app/core/enum/title';
import { GridApi } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-tabs-bar',
    templateUrl: './tabs-bar.component.html',
    styleUrls: ['./tabs-bar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TabsBarComponent implements OnInit {
    title = Title.LEFT;

    // orders: Order;
    listOrders: Array<Order> = [];
    ordersLength: number = 0;
    /** To Pay*/
    listOrdersToPay: Array<Order> = [];
    toPayLength: number = 0;
    /** To Verify*/
    listOrdersToVerify: Array<Order> = [];
    toVerifyLength: number = 0;
    /** To Ship*/
    listOrdersToShip: Array<Order> = [];
    toShipLength: number = 0;
    /** To Receive*/
    listOrdersToReceive: Array<Order> = [];
    toReceiveLength: number = 0;
    /** To Unbox*/
    listOrdersToUnbox: Array<Order> = [];
    toUnboxLength: number = 0;
    /** To Host*/
    listOrdersToHost: Array<Order> = [];
    toHostLength: number = 0;
    /** To Completed*/
    listOrdersToCompleted: Array<Order> = [];
    completedLength: number = 0;
    /** To Cancel*/
    listOrdersToCancel: Array<Order> = [];
    cancelLength: number = 0;
    /** Selected Index Tab */
    selectedIndex: number;
    // flagAdvisor
    flagAdvisor: boolean = true;

    gridApi: GridApi;
    page: number;

    // translation
    lstEnTranslation: any[] = [];
    lstZhTranslation: any[] = [];
    lstMyTranslation: any[] = [];

    // search
    keySearch: string;
    isSearch: boolean;

    constructor(
        private orderService: OrderService,
        private spinner: NgxSpinnerService,
        private translateService: TranslateService
    ) {
        this.count();
        this.keySearch = "";
        this.isSearch = false;
    }

    // listProduct: Array<Product> = [];

    ngOnInit(): void {
        var token = localStorage.getItem('token');
        var decoded = jwt_decode(token);
        if (!isNullOrUndefined(decoded) && decoded.role.length > 0) {
            if (decoded.role.indexOf("ADVISOR") !== -1) {
                this.flagAdvisor = true;
            }
            else {
                this.flagAdvisor = false;
            }
        } else {
            this.flagAdvisor = false;
        }
        var tabSelect = history.state.selectTab;
        if (!isNullOrUndefined(tabSelect)) {
            this.selectedIndex = tabSelect;

        } else {
            this.selectedIndex = 0;
        }
        this.mapIndex(this.selectedIndex, false);
    }

    ngAfterViewInit(): void {
        var pagBefore = document.getElementsByClassName('mat-tab-header-pagination-before');
        if (!isNullOrUndefined(pagBefore) && pagBefore.length > 0) {
            document.getElementsByClassName('mat-tab-header-pagination-before')[0].remove();
            document.getElementsByClassName('mat-tab-header-pagination-after')[0].remove();
        }
    }
    onTabChanged(event) {
        if (!isNullOrUndefined(event.index)) {
            this.mapIndex(event.index, false)
        }
    }

    renderData(status) {

        this.orderService.getOrderList(this.flagAdvisor, status, this.keySearch, 1, 10)
            .subscribe(data => {
                this.listOrders = [];
                if (!isNullOrUndefined(data) && data.length > 0) {
                    this.listOrders = data;
                    this.page = 1;
                    this.spinner.hide();

                    this.listOrders.forEach(order => {
                        order.listProduct.forEach(product => {
                            product.translations.forEach(translation => {
                                if (translation.language_code === 'en') {
                                    let objTranslate = {};
                                    objTranslate["OrderId"] = order.id;
                                    objTranslate["ProductId"] = translation.productId;
                                    objTranslate["Title"] = translation.title;
                                    this.lstEnTranslation.push(objTranslate);
                                } else if (translation.language_code === 'en') {
                                    let objTranslate = {};
                                    objTranslate["OrderId"] = order.id;
                                    objTranslate["ProductId"] = translation.productId;
                                    objTranslate["Title"] = translation.title;
                                    this.lstZhTranslation.push(objTranslate);
                                } else if (translation.language_code === 'my') {
                                    let objTranslate = {};
                                    objTranslate["OrderId"] = order.id;
                                    objTranslate["ProductId"] = translation.productId;
                                    objTranslate["Title"] = translation.title;
                                    this.lstMyTranslation.push(objTranslate);
                                }
                            })
                        })
                    })

                    // set english language
                    this.translateService.getTranslation('en').subscribe(() => {
                        let obj = {
                            "CUSTOMER_ORDER_DYNAMIC": {}
                        }
                        this.lstEnTranslation.forEach(translate => {
                            let objProductTranslate = {};
                            objProductTranslate[translate["ProductId"]] = translate["Title"];
                            obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_ID"] = "Advisor ID";
                            obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_NAME"] = "Advisor Name";
                            obj["CUSTOMER_ORDER_DYNAMIC"][translate["OrderId"] + '_' + translate["ProductId"]] = objProductTranslate;
                        });
                        this.translateService.setTranslation('en', obj, true);

                        /** ------------------ */
                        // set chinese language
                        this.translateService.getTranslation('en').subscribe(() => {
                            let obj = {
                                "CUSTOMER_ORDER_DYNAMIC": {}
                            }
                            this.lstZhTranslation.forEach(translate => {
                                let objProductTranslate = {};
                                objProductTranslate[translate["ProductId"]] = translate["Title"];
                                obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_ID"] = "TR_Advisor ID";
                                obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_NAME"] = "TR_Advisor Name";
                                obj["CUSTOMER_ORDER_DYNAMIC"][translate["OrderId"] + '_' + translate["ProductId"]] = objProductTranslate;
                            });
                            this.translateService.setTranslation('en', obj, true);

                            /** ---------------- */
                            // set malay language
                            this.translateService.getTranslation('my').subscribe(() => {
                                let obj = {
                                    "CUSTOMER_ORDER_DYNAMIC": {}
                                }
                                this.lstMyTranslation.forEach(translate => {
                                    let objProductTranslate = {};
                                    objProductTranslate[translate["ProductId"]] = translate["Title"];
                                    obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_ID"] = "MY_Advisor ID";
                                    obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_NAME"] = "MY_Advisor Name";
                                    obj["CUSTOMER_ORDER_DYNAMIC"][translate["OrderId"] + '_' + translate["ProductId"]] = objProductTranslate;
                                });
                                this.translateService.setTranslation('my', obj, true);
                            })
                        })
                    })
                }
            })
    }

    renderDataScroll(status) {
        this.orderService.getOrderList(this.flagAdvisor, status, this.keySearch, this.page, 10)
            .subscribe(data => {
                if (!isNullOrUndefined(data) && data.length > 0) {
                    this.listOrders = this.listOrders.concat(data);
                    this.spinner.hide();

                    this.listOrders.forEach(order => {
                        order.listProduct.forEach(product => {
                            product.translations.forEach(translation => {
                                if (translation.language_code === 'en') {
                                    let objTranslate = {};
                                    objTranslate["OrderId"] = order.id;
                                    objTranslate["ProductId"] = translation.productId;
                                    objTranslate["Title"] = translation.title;
                                    this.lstEnTranslation.push(objTranslate);
                                } else if (translation.language_code === 'en') {
                                    let objTranslate = {};
                                    objTranslate["OrderId"] = order.id;
                                    objTranslate["ProductId"] = translation.productId;
                                    objTranslate["Title"] = translation.title;
                                    this.lstZhTranslation.push(objTranslate);
                                } else if (translation.language_code === 'my') {
                                    let objTranslate = {};
                                    objTranslate["OrderId"] = order.id;
                                    objTranslate["ProductId"] = translation.productId;
                                    objTranslate["Title"] = translation.title;
                                    this.lstMyTranslation.push(objTranslate);
                                }
                            })
                        })
                    })

                    // set english language
                    this.translateService.getTranslation('en').subscribe(() => {
                        let obj = {
                            "CUSTOMER_ORDER_DYNAMIC": {}
                        }
                        this.lstEnTranslation.forEach(translate => {
                            let objProductTranslate = {};
                            objProductTranslate[translate["ProductId"]] = translate["Title"];
                            obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_ID"] = "Advisor ID";
                            obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_NAME"] = "Advisor Name";
                            obj["CUSTOMER_ORDER_DYNAMIC"][translate["OrderId"] + '_' + translate["ProductId"]] = objProductTranslate;
                        });
                        this.translateService.setTranslation('en', obj, true);

                        /** ------------------ */
                        // set chinese language
                        this.translateService.getTranslation('en').subscribe(() => {
                            let obj = {
                                "CUSTOMER_ORDER_DYNAMIC": {}
                            }
                            this.lstZhTranslation.forEach(translate => {
                                let objProductTranslate = {};
                                objProductTranslate[translate["ProductId"]] = translate["Title"];
                                obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_ID"] = "TR_Advisor ID";
                                obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_NAME"] = "TR_Advisor Name";
                                obj["CUSTOMER_ORDER_DYNAMIC"][translate["OrderId"] + '_' + translate["ProductId"]] = objProductTranslate;
                            });
                            this.translateService.setTranslation('en', obj, true);

                            /** ---------------- */
                            // set malay language
                            this.translateService.getTranslation('my').subscribe(() => {
                                let obj = {
                                    "CUSTOMER_ORDER_DYNAMIC": {}
                                }
                                this.lstMyTranslation.forEach(translate => {
                                    let objProductTranslate = {};
                                    objProductTranslate[translate["ProductId"]] = translate["Title"];
                                    obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_ID"] = "MY_Advisor ID";
                                    obj["CUSTOMER_ORDER_DYNAMIC"]["ADVISOR_NAME"] = "MY_Advisor Name";
                                    obj["CUSTOMER_ORDER_DYNAMIC"][translate["OrderId"] + '_' + translate["ProductId"]] = objProductTranslate;
                                });
                                this.translateService.setTranslation('my', obj, true);
                            })
                        })
                    })
                }
            })
    }

    mapIndex(index, checkScroll) {
        this.count()
        let status: string
        switch (index) {
            case 0: status = 'ALL'; break;
            case 1: status = 'TO_PAY'; break;
            case 2: status = 'TO_VERIFY'; break;
            case 3: status = 'TO_SHIP'; break;
            case 4: status = 'TO_RECEIVE'; break;
            case 5: status = 'TO_UNBOX'; break;
            case 6: status = 'TO_HOST'; break;
            case 7: status = 'COMPLETED'; break;
            case 8: status = 'CANCELLED'; break;
            default: status = 'ALL'; break;
        }
        if (!checkScroll) {
            this.renderData(status);
        } else {
            this.renderDataScroll(status);
        }
    }

    onScroll() {
        console.log("scroll");
        this.spinner.show();
        if (this.page > 0) {
            this.page = this.page + 1
            this.mapIndex(this.selectedIndex, true)
        }
    }

    count() {
        this.orderService.countOrderOfAdvisor().subscribe(data => {
            this.toPayLength = data.to_pay;
            this.toVerifyLength = data.to_verify;
            this.toShipLength = data.to_ship;
            this.toReceiveLength = data.to_receive;
            this.toUnboxLength = data.to_unbox;
            this.toHostLength = data.to_host;
            this.completedLength = data.completed;
            this.cancelLength = data.cancel;
            this.ordersLength = Object.keys(data).reduce((sum, key) => sum + data[key], 0) - data.cancel;
        })
    }

    search(event) {
        let wordSearch: string = this.keySearch;
        setTimeout(() => {
            if (wordSearch === this.keySearch) {
                this.isSearch = true;
                setTimeout(() => {
                    if (this.keySearch !== '') {
                        this.renderData('ALL');
                    } else {
                        this.renderData('ALL');
                    }
                    this.isSearch = false;
                }, 500);
            }
        }, 1000);
    }
}