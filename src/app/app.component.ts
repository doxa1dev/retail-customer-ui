import { browser } from 'protractor';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SwUpdate , SwPush} from "@angular/service-worker";
import { ActivatedRoute , NavigationEnd , Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component
import { environment } from 'environments/environment';
import { LoadingPaymentService } from '@fuse/services/loading-payment.service';
declare const gtag: Function;
@Component({
    selector   : 'app',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy
{
    fuseConfig: any;
    navigation: any;
    private formData: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private loadingPaymentService: LoadingPaymentService,
        public _translateService: TranslateService,
        private _platform: Platform,

        private _matIconRegistry :MatIconRegistry,
        private _domSanitizer:DomSanitizer,

        //service worker
        private _snackBar: MatSnackBar,
        private _swUpdate: SwUpdate,
        private _swPush : SwPush,
        
        //get post data from ipay88
        private activatedRoute: ActivatedRoute,
        private bnIdle: BnNgIdleService,
        private router: Router
    )
    {
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'en']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        // this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

        // Use a language
        const browserLang =  _translateService.getBrowserLang()
        this._translateService.use(browserLang.match(/en|zh/) ?browserLang : 'en');

        // this.bnIdle.startWatching(60).subscribe((res) => {
        //     if(res) {
        //         // console.log("session expired");
        //         localStorage.removeItem('token');
        //         location.reload();
        //     }
        // })

        //Add Google analytics
        this.addGAScript();
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            /** START : Code to Track Page View  */
            gtag('event', 'page_view', {
                page_path: event.urlAfterRedirects
            })
            /** END */
        })
        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('en');
         });
        

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if ( this._platform.ANDROID || this._platform.IOS )
        {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this._matIconRegistry.addSvgIcon(
            "store",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Store.svg")
        );

        this._matIconRegistry.addSvgIcon(
            "history",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/History.svg")
        );

        this._matIconRegistry.addSvgIcon(
            "order",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Order.svg")
        );

        this._matIconRegistry.addSvgIcon(
            "book",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Book.svg")
        );

        this._matIconRegistry.addSvgIcon(
            "adviserplus",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Adviser plus.svg")
        );

        this._matIconRegistry.addSvgIcon(
            "adviser",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Adviser.svg")
        );

        this._matIconRegistry.addSvgIcon(
            "supervisoraccount",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Supervisor Account.svg")
        );

        this._matIconRegistry.addSvgIcon(
            "credic-card",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Credit Card.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "messages-order",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Messages-order.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "phone-order",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Phone-order-summary.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "phone",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Phone.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "branch-manager",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/ic_business_24px.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "widgets",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/ic_widgets_24px.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "report",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/report.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "shipping_policy",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/truck.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "pivacy",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/privacy-policy.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "customers",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/Account box.svg")
        );

        //icon bank EPP MY
        this._matIconRegistry.addSvgIcon(
            "public-bank-card",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/public-bank-logo-png-transparent.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "maybank-card",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/maybank.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "cimb-bank-card",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/CIMB_Bank1.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "hong-leong-bank-card",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/hong-leong-bank-hlb-logo-vector.svg")
        );
        //icon bank EPP SG
        this._matIconRegistry.addSvgIcon(
            "DBS-bank-card",
            // this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/DBS_Bank_logo_logotype.svg")
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/dbs-posb.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "UOB-bank-card",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/UOB_United_Overseas_Bank_logo_logotype_symbol.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "OCBC-bank-card",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/OCBC_Bank_logo_logotype_Singapore.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "icon-paynow",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/paynow-logo-2-01.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "visa",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/visa.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "mc-symbol",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/mc_symbol.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "news",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/news_infomation.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "conmisson",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/conmisson.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "cookido",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/cookido.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "term_and_coditions",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/term_and_coditions.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "delete",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/ICON/deleted.svg")
        );
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // checking SW update Status
        this._swUpdate.available.subscribe(update=>{
            if(update.type === "UPDATE_AVAILABLE"){
                const sb = this._snackBar.open("There is an update available","Install Now",{
                    duration:4000
                });
                sb.onAction().subscribe( ()=>{
                    this._swUpdate.activateUpdate().then(event=>{
                        console.log("The App was updated");
                        location.reload();
                    })
                })
                
            }
        }) ; 
        // this._swUpdate.checkForUpdate();

        //Checking Status network
        this.updateNetworkStatusUI();
        window.addEventListener("online", this.updateNetworkStatusUI);
        window.addEventListener("offline", this.updateNetworkStatusUI);
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if ( this.fuseConfig.layout.width === 'boxed' )
                {
                    this.document.body.classList.add('boxed');
                }
                else
                {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for ( let i = 0; i < this.document.body.classList.length; i++ )
                {
                    const className = this.document.body.classList[i];

                    if ( className.startsWith('theme-') )
                    {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });

            if((navigator as any).standalone === false){
                //this is an iOS device and we in the browser
                this._snackBar.open("Do you want to install Thermomix ?", "Install",{
                    duration:3000
                });
            }

            if((navigator as any).standalone === undefined){
                //It's an iOS device
                if(window.matchMedia("(display-mode: browser) and (max-width: 1100px)").matches){
                    //Window in browser
                    window.addEventListener("beforeinstallprompt", event=>{
                        event.preventDefault();
                        const sb = this._snackBar.open("Do you want to install Thermomix ?", "Install",{duration: 5000});
                        sb.onAction().subscribe( ()=>{
                            (event as any).prompt();
                            (event as any).userChoice.then( result =>{
                                if(result.outcome=== "dismissed"){
                                    //no istallation
                                    console.log("Have some error when install Thermomix")
                                }else{
                                    //installed
                                }
                            })
                        })
                        return false;  
                    });
                }
            }
            

            
    // //get post data from ipay88

    // this.activatedRoute.queryParamMap.subscribe(resp=>{
    //     console.log(resp);
    //     this.formData = resp.get('form');
    //     console.log('get form data');
    //     console.log(this.formData);
    // })



    }

    /**
     * Update in PWA
     */
    updateNetworkStatusUI(){
        if(navigator.onLine){
            (document.querySelector("body") as any).style = "";
        }else{
            (document.querySelector("body") as any).style = "filter: grayscale(1)";
            this._snackBar.open("You are offline, please check your internet connection.","",{
                duration:5000
            });
        }
        
    }

    /** Add Google Analytics Script Dynamically */
    addGAScript() {
        let gtagScript: HTMLScriptElement = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.GA_TRACKING_ID;
        document.head.prepend(gtagScript);
        /** Disable automatic page view hit to fix duplicate page view count  **/
        gtag('config', environment.GA_TRACKING_ID, { send_page_view: false });
    }
    

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
