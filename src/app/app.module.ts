import { DialogLoginNewModule } from './main/common-component/dialog-login-new/dialog-login-new.module';
import { DialogLoginNewComponent } from './main/common-component/dialog-login-new/dialog-login-new.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from './main/angular-material/material.module';
import 'hammerjs';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

//service-worker
import { ServiceWorkerModule } from '@angular/service-worker';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { StoresModule } from 'app/main/store/store.module';
import { PayMPOSModule } from 'app/main/payment/pay-m-pos/pay-m-pos.module';
import { PayMPOSComponent } from 'app/main/payment/pay-m-pos/pay-m-pos.component';
import { AggridModule } from 'app/main/aggrid/aggrid.module';
import { OrderHistoryModule } from 'app/main/order-history/order-history.module';
import { ActivitiesOverviewModule } from 'app/main/activities-overview/activities-overview.module';
import { CookingExperienceModule } from 'app/main/cooking-experience/cooking-experience.module';
import { BecomeAnAdvisorModule } from 'app/main/become-an-advisor/become-an-advisor.module';
import { AdvisorModule } from 'app/main/advisor/advisor.module';
// import { TeamLeaderModule } from 'app/main/team-leader/team-leader.module';
import { PaymentOptionsComponent } from 'app/main/payment/payment-options/payment-options.component';
import { PaymentOptionsModule } from 'app/main/payment/payment-options/payment-options.module';
import { ProductDetailModule } from './main/product-detail/product-detail.module';
import { ProductDetailComponent } from './main/product-detail/product-detail.component';
import { ShoppingBagModule } from './main/shopping-bag/shopping-bag.module';
import { ShoppingBagComponent } from './main/shopping-bag/shopping-bag.component';
import { OrderSummaryComponent } from './main/order-summary/order-summary.component';
import { OrderSummaryModule } from './main/order-summary/order-summary.module';
import { PagesModule } from 'app/main/account/pages.module';
import { EditAddressModule } from 'app/main/edit-address/edit-address.module';
import { DeliveryAddressModule } from 'app/main/delivery-address/delivery-address.module';
import { LoginComponent } from './main/account/authentication/login/login.component';
import { RegisterComponent } from './main/account/authentication/register/register.component';
import { VerifyCodeComponent } from './main/account/authentication/verify-code/verify-code.component';
import { ForgotPasswordComponent } from './main/account/authentication/forgot-password/forgot-password.component';
import { ResentEmailComponent} from './main/account/authentication/resent-email/resent-email.component';
import { CheckoutModule } from 'app/main/check-out/check-out.module';
import { ListProductsComponent } from './main/list-products/list-products.component';
import { ListProductsModule } from './main/list-products/list-products.module';
import { MyProfileComponent } from './main/account/profile/my-profile/my-profile.component';
import { MyProfileModule } from './main/account/profile/my-profile/my-profile.module';
import { QuestionnaireModule } from './main/account/profile/questionnaire.module';
import { VerifyEmailComponent } from './main/account/authentication/verify-email/verify-email.component';
//Pay at Office
import { PayAtOfficeComponent } from './main/payment/pay-at-office/pay-at-office.component';
import { PayAtOfficeModule } from './main/payment/pay-at-office/pay-at-office.module';



//Payment Done
import { PaymentDoneComponent } from './main/payment/payment-done/payment-done.component';
import { PaymentDoneModule } from './main/payment/payment-done/payment-done.module';

//Pay by Cheque
import { PayByChequeComponent } from './main/payment/pay-by-cheque/pay-by-cheque.component';
import { PayByChequeModule } from './main/payment/pay-by-cheque/pay-by-cheque.module';

//Payment continue
import { PaymentContinueComponent } from './main/payment/payment-continue/payment-continue.component';
import { PaymentContinueModule } from './main/payment/payment-continue/payment-continue.module';

//Select Payment
import { SelectPaymentComponent } from './main/payment/select-payment/select-payment.component';
import { SelectPaymentModule } from './main/payment/select-payment/select-payment.module';
//Unbox-Host
import { QRCodeModule } from 'angularx-qrcode';
import { CustomerUnboxModule } from './main/order-history/unbox/customer-unbox/customer-unbox.module';

import { AdvisorUnboxModule } from './main/advisor/customerorders/unbox/advisor-unbox/advisor-unbox.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { RegisterModule } from './main/account/authentication/register/register.module';
import { VerifyCodeModule } from './main/account/authentication/verify-code/verifyCode.module';
import { VerifyEmailModule } from './main/account/authentication/verify-email/verify-email.module';

import { SharedService } from './core/service/commom/shared.service';
//Payment-Options-Full
import { PaymentOptionsFullComponent } from './main/payment/payment-options-full/payment-options-full.component';
import { PaymentOptionsFullModule } from './main/payment/payment-options-full/payment-options-full.module';
import { DatePipe } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BranchManagerModule } from './main/branch-manager/branch-manager.module';
import { environment } from 'environments/environment';

import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { ButtonLoadingComponent } from './main/common-component/button-loading/button-loading.component';
import { ButtonLoadingModule } from './main/common-component/button-loading/button-loading.module';

import { OnlinePaymentStatusComponent } from './main/payment/online-payment-status/online-payment-status.component';
import { OnlinePaymentStatusModule } from './main/payment/online-payment-status/online-payment-status.module';

import { ToastModule } from 'primeng/toast';

import { CountdownModule } from 'ngx-countdown';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//Warrantied Products
import { WarrantiedProductsComponent } from './main/warrantied-products/warrantied-products.component';
import { WarrantiedProductsModule } from './main/warrantied-products/warrantied-products.module';
import { WarrantiedProductsDetailModule } from './main/warrantied-products/warrantied-products-detail/warrantied-products-detail.module';
import { WarrantiedProductsDetailComponent } from './main/warrantied-products/warrantied-products-detail/warrantied-products-detail.component';

import { TitleComponent } from './main/common-component/title/title.component';
import { RecurringPaymentComponent } from './main/payment/recurring-payment/recurring-payment.component';
import { RecurringPaymentModule } from './main/payment/recurring-payment/recurring-payment.module';

import { TitleModule } from './main/common-component/title/title.module';
import { AdvisorRecruitmentModule } from './main/advisor/advisor-recruitment/advisor-recruitment.module';
import { AdvisorRecruitmentComponent } from './main/advisor/advisor-recruitment/advisor-recruitment.component';
import { TeamLeaderModule } from './main/team-leader/team-leader.module';

import { OfflineEppComponent } from './main/payment/offline-epp/offline-epp.component';
import { OfflineEPPModule } from './main/payment/offline-epp/offline-epp.module';


// import { AdvisorNewEarningProgramComponent } from './main/advisor-new-earning-program/advisor-new-earning-program.component';
import { AdvisorNewEarningProgramModule } from 'app/main/advisor-new-earning-program/advisor-new-earning-program.module';

import { DepositPaymentMethodComponent } from './main/payment/deposit-payment-method/deposit-payment-method.component';
import { DepositPaymentMethodModule } from './main/payment/deposit-payment-method/deposit-payment-method.module';
import { RecurringSubscriptionStatusComponent } from './main/payment/recurring-subscription-status/recurring-subscription-status.component';
import { RecurringSubscriptionStatusModule } from './main/payment/recurring-subscription-status/recurring-subscription-status.module';

import { DialogConfirmComponent } from './main/common-component/dialog-confirm/dialog-confirm.component';
import { ReportComponent } from './main/report/report.component';
import { ReportModule } from './main/report/report.module';
import { InstallmentConfirmComponent } from './main/payment/installment-confirm/installment-confirm.component';
import { InstallmentConfirmModule } from './main/payment/installment-confirm/installment-confirm.module';
import { ExtraGiftComponent } from './main/payment/extra-gift/extra-gift.component';
import { ExtraGiftModule } from './main/payment/extra-gift/extra-gift.module';
import { PlaceholderLoadingModule } from './main/common-component/placeholder-loading/placeholder-loading.module';
import { Observable, from } from 'rxjs';
import { NoCacheHeadersInterceptor } from './core/service/no-cache-service';

//My Customers
import { MyCustomersComponent } from './main/advisor/my-customers/my-customers.component';
import { MyCustomersModule } from './main/advisor/my-customers/my-customers.module';

//Payment Error 
import {PaymentErrorModule} from './main/payment/payment-error/payment-error.module';

//My Contact
import { ContactListComponent } from './main/contact-list/contact-list.component';
import { ContactListModule } from './main/contact-list/contact-list.module';
import { PayEppComponent } from './main/payment/pay-epp/pay-epp.component';
import { PayEppModule } from './main/payment/pay-epp/pay-epp.module';
import { DialogLoginModule } from './main/common-component/dialog-login/dialog-login.component.module';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateFormat } from './main/advisor-new-earning-program/apply-new-advisor-earning-program/apply-new-advisor-earning-program.component';
import { CheckOutImproveModule } from './main/check-out-improve/check-out-improve.module';
// import { CheckOutImproveComponent } from './main/check-out-improve/check-out-improve.component';
import { StoreImproveModule } from './main/store-improve/store-improve.module';
import { StoreImproveComponent } from './main/store-improve/store-improve.component';
import { OrderSummaryDetailModule } from './main/common-component/order-summary-detail/order-summary-detail.component.module';
import { ProductModule } from './main/common-component/product/product.module';
import { DeliveryAddressComponentCommonModule } from './main/common-component/delivery-address/delivery-address.module';
import { CustomerInfoCommonModule } from './main/common-component/customer-info/customer-info.module';
import { DialogConfirmNaepComponent } from './main/common-component/dialog-confirm-naep/dialog-confirm-naep.component';
import { DialogCommonNaepComponent } from './main/common-component/dialog-common-naep/dialog-common-naep.component';
import { DialogCommonButtonComponent } from './main/common-component/dialog-common-button/dialog-common-button.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
    // return new TranslateHttpLoader(httpClient);
    return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

// export class WebpackTranslateLoader implements TranslateLoader {
//     getTranslation(lang: string): Observable<any> {
//         return from(import(`../assets/i18n/${lang}.json`));
//     }
// }

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'register/:advisorId',
        component: RegisterComponent
    },
    {
        path: 'register/code/verify',
        component: VerifyCodeComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'forgot-password/:token',
        component: ForgotPasswordComponent
    },
    {
        path: 'resent-email',
        component: ResentEmailComponent
    },
    {
        path: 'my-profile',
        component: MyProfileComponent
    },
    {
        path: 'verify/email',
        component: VerifyEmailComponent
    },
    {
        path: 'grid',
        redirectTo: 'grid'
    },
    {
        path: 'product-detail',
        component: ProductDetailComponent
    },
    {
        path: 'list-products',
        component: ListProductsComponent
    },
    {
        path: 'store',
        redirectTo: 'store'
    },
    {
        path: 'order-history',
        redirectTo: 'order-history'
    },
    {
        path: 'activities-overview',
        redirectTo: 'activities-overview'
    },
    {
        path: 'cooking-experience',
        redirectTo: 'cooking-experience'
    },
    {
        path: 'become-an-advisor',
        redirectTo: 'become-an-advisor'
    },
    {
        path: 'advisor',
        loadChildren: './main/advisor/advisor.module#AdvisorModule'
    },
    {
        path: 'teamleader',
        loadChildren: './main/team-leader/team-leader.module#TeamLeaderModule'
    },
    {
        path: 'paym-pos',
        component: PayMPOSComponent
    },
    {
        path: 'payment-options',
        component: PaymentOptionsComponent
    },
    {
        path: 'shopping-bag',
        component: ShoppingBagComponent
    },
    {
        path: 'editaddress',
        redirectTo: 'editaddress'
    },
    {
        path: 'order-summary',
        component: OrderSummaryComponent
    },
    {
        path: 'shopping-bag',
        component: ShoppingBagComponent
    },
    {
        path: 'questionnaire',
        loadChildren: './main/account/profile/questionnaire.module#QuestionnaireModule'
    },
    {
        path: 'pay-at-office',
        component: PayAtOfficeComponent
    },
    {
        path: 'payment-done',
        component: PaymentDoneComponent
    },
    {
        path: 'pay-by-cheque',
        component: PayByChequeComponent
    },
    {
        path: 'payment-continue',
        component: PaymentContinueComponent
    },
    {
        path: 'select-payment',
        component: SelectPaymentComponent
    },
    {
        path: 'payment-options-full',
        component: PaymentOptionsFullComponent
    },
    {

        path: 'online-payment-status',
        component: OnlinePaymentStatusComponent
    },
    {
        path: '**',
        redirectTo: 'store'
    },
    {
        path: 'warrantied-products',
        component: WarrantiedProductsComponent
    },
    {
        path: 'warrantied-products/detail',
        component: WarrantiedProductsDetailComponent
    }, 
    {
        path: 'recurring-payment',
        component: RecurringPaymentComponent
    },
    
    {
        path: 'advisor/recruitment',
        component: AdvisorRecruitmentComponent
    },
    {
        path: 'offline-epp',
        component: OfflineEppComponent
    }, 
    {
        path: 'deposit-payment-method',
        component: DepositPaymentMethodComponent
    }, 
    {
        path: 'recurring-subscription-status', 
        component: RecurringSubscriptionStatusComponent
    }, 
    {
        path     : 'reports',
        component: ReportComponent
    },
    {
        path: 'installment-confirm', 
        component: InstallmentConfirmComponent
    }, 
    {
        path: 'extra-gift', 
        component: ExtraGiftComponent
    }, 
    {
        path: 'advisor/my-customers', 
        component: MyCustomersComponent  
    },
    {
        path: 'contact-list', 
        component: ContactListComponent  
    },
    {
        path: 'pay-epp',
        component: PayEppComponent
    },
    {
        path: 'store',
        component: StoreImproveComponent
    }
];

@NgModule({
    declarations: [
        AppComponent,
        DialogConfirmComponent,
        DialogConfirmNaepComponent,
        DialogCommonNaepComponent,
        DialogCommonButtonComponent
    ],

    imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        BrowserAnimationsModule,

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),

        // Material moment date module
        MaterialModule,
        PagesModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AggridModule,
        StoresModule,
        PayMPOSModule,
        OrderHistoryModule,
        ActivitiesOverviewModule,
        CookingExperienceModule,
        BecomeAnAdvisorModule,
        AdvisorModule,
        RegisterModule,
        VerifyCodeModule,
        // VerifyEmailModule,

        TeamLeaderModule,
        PaymentOptionsModule,
        ProductDetailModule,
        ShoppingBagModule,
        OrderSummaryModule,
        DropdownModule,
        MultiSelectModule,
        ListProductsModule,
        QuestionnaireModule,

        // NgxGalleryModule
        EditAddressModule,
        DeliveryAddressModule,
        ShoppingBagModule,
        MyProfileModule,
        //Form Module
        FormsModule,
        ReactiveFormsModule,
        CheckoutModule,
        CheckOutImproveModule,
        //Payment Module
        OnlinePaymentStatusModule,
        PayAtOfficeModule,
        PaymentDoneModule,
        PayByChequeModule,
        PayEppModule,
        PaymentContinueModule,
        SelectPaymentModule,
        PaymentOptionsFullModule,
        QRCodeModule,
        CustomerUnboxModule,
        AdvisorUnboxModule,
        ZXingScannerModule,
        NgxMaterialTimepickerModule,
        BranchManagerModule,
        MatProgressButtonsModule,
        ToastModule,
        ButtonLoadingModule,
        CountdownModule,
        WarrantiedProductsModule,
        WarrantiedProductsDetailModule,

        RecurringPaymentModule,

        AdvisorRecruitmentModule,

        OfflineEPPModule,

        DepositPaymentMethodModule, 
        RecurringSubscriptionStatusModule,
        InstallmentConfirmModule,
        ExtraGiftModule,

        TitleModule,
        AdvisorNewEarningProgramModule,

        //Report module
        ReportModule,

        //service-worker
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        AgGridModule.withComponents([]),
        PlaceholderLoadingModule,
        MyCustomersModule,
        PaymentErrorModule,
        // Contact list
        ContactListModule,
        DialogLoginModule,
        
        //improve
        StoreImproveModule,
        OrderSummaryDetailModule,
        ProductModule,
        DeliveryAddressComponentCommonModule,
        CustomerInfoCommonModule,
        DialogLoginNewModule
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        SharedService,
        BnNgIdleService,
        DatePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NoCacheHeadersInterceptor,
            multi: true
        },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: DateFormat }

    ]
})
export class AppModule {
}
