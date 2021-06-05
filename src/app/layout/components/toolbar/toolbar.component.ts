import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";

import { FuseConfigService } from "@fuse/services/config.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { AuthService } from "../../../core/service/auth.service";
import { navigation } from "app/navigation/navigation";

import { CartService } from "app/core/service/cart.service";
import { isNullOrUndefined } from "util";
import { environment } from "environments/environment";
import * as jwtDecode from "jwt-decode";
import { DOCUMENT } from "@angular/common";
import { MyProfileService } from "../../../core/service/my-profile.service";
import { MyProfile } from "app/core/models/my-profile.model";
import { SharedService } from "app/core/service/commom/shared.service";
import { ToolbarService } from "./toolbar.service";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { NewsService } from "app/core/service/news.service";
import { SocketService } from "app/core/service/socket.service";
import { Event } from "./../../../core/enum/event";
import { CommonDialogComponent } from "app/main/common-dialog/common-dialog.component";

@Component({
  selector: "toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  languages: any;
  navigation: any;
  selectedLanguage: any;
  userStatusOptions: any[];
  storageUrl = environment.storageUrl;
  userMenuImgUrl = "";
  my_advisor_id = "";
  new_photo_key = "";
  my_reference_uuid = "";

  //Ngrx-store
  numberProducts: Observable<number>;
  total_product: number = 0;
  arrCart: any;
  token: string;

  //news
  quantityNotifi: number;

  //language
  language: string;
  isShowMenu: boolean;
  isShowInvite: boolean;
  is_anomynous_account : boolean = false;
  // Private
  private _unsubscribeAll: Subject<any>;

  ioConnection: any;

  messages: any[] = []; 
  entity: string = environment.entity;
  //check language
  checkLanguage = environment.checkLanguage;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {TranslateService} _translateService
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _fuseSidebarService: FuseSidebarService,
    private _translateService: TranslateService,
    private authService: AuthService,
    private _cartService: CartService,
    private sharedService: SharedService,
    @Inject(DOCUMENT) private document: Document,
    private myProfileService: MyProfileService,
    private toolBarService: ToolbarService,
    public dialog: MatDialog,
    private router: Router,
    private newsService: NewsService,
    private socketService: SocketService
  ) {
    // Set the defaults
    this.userStatusOptions = [
      {
        title: "Online",
        icon: "icon-checkbox-marked-circle",
        color: "#4CAF50",
      },
      {
        title: "Away",
        icon: "icon-clock",
        color: "#FFC107",
      },
      {
        title: "Do not Disturb",
        icon: "icon-minus-circle",
        color: "#F44336",
      },
      {
        title: "Invisible",
        icon: "icon-checkbox-blank-circle-outline",
        color: "#BDBDBD",
      },
      {
        title: "Offline",
        icon: "icon-checkbox-blank-circle-outline",
        color: "#616161",
      },
    ];

    this.languages = [
      {
        id: "en",
        title: "English",
        flag: "us",
      },
      // {
      //   id: "zh",
      //   title: "Chinese",
      //   flag: "zh",
      // },
    ];

    this.navigation = navigation;

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the config changes
    this._fuseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings) => {
        this.horizontalNavbar = settings.layout.navbar.position === "top";
        this.rightNavbar = settings.layout.navbar.position === "right";
        this.hiddenNavbar = settings.layout.navbar.hidden === true;
      });

    this.token = localStorage.getItem("token");
    if (!isNullOrUndefined(this.token)) {

      this.isShowMenu = true;
      this.isShowInvite = true;
      
      this._cartService.getCartByCustomerId().subscribe((data) => {
        
        if (!isNullOrUndefined(data) && data.cartItems.length > 0 && data.is_naep_cart == false) {
          data.cartItems.forEach((cart) => {
            this.total_product = this.total_product + cart.quantity;
          });
        }else if(!isNullOrUndefined(data) && data.cartItems.length > 0 && data.is_naep_cart == true)
        {
          this.total_product = 1;
        }else {
          this.total_product = 0;
        }
        this.sharedService.nextCart(this.total_product);
        this.sharedService.sharedMessage.subscribe(
          (message) => (this.total_product = message)
        );

        this.getNewsNotification();
      });

      // Set the selected language from default languages
      //this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
      // this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
      // Set the selected language from default languages
      // this.selectedLanguage = _.find(this.languages, {
      //   id: this._translateService.currentLang,
      // });

      //Decode token
      const decoded = jwtDecode(this.token);

      const role = decoded.role.indexOf("ADVISOR")
      //check advisor
      if (role === -1) {
        this.isShowInvite = false
      }
      const profile_photo_key = decoded.profile_photo_key;
      this.userMenuImgUrl =
        CheckNullOrUndefinedOrEmpty(profile_photo_key)
          ? "assets/icons/ICON/UserMenu.svg"
          : this.storageUrl + profile_photo_key;

      //change UserMenu profile photo, get new photo key
      this.toolBarService.change.subscribe((newPhotoKey) => {
        this.new_photo_key = newPhotoKey;
        this.userMenuImgUrl = 
          this.new_photo_key == null
            ? "assets/icons/ICON/UserMenu.svg"
            : this.storageUrl + this.new_photo_key;
      });

      //get user info
      this.myProfileService.getProfile().subscribe((response) => {
        if (response.code === 200) {
          const myProfile: MyProfile = response.userProfileData;
          this.my_advisor_id = myProfile.my_advisor_id == "null" ? "" : myProfile.my_advisor_id;
          this.my_reference_uuid = myProfile.uuid == "null" ? "" : myProfile.uuid;
          this.is_anomynous_account = myProfile.is_anomynous_account
        }
        else if(response = '0') {
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: "Your email is changed by admin.",
              title: "NOTIFICATION",
              colorButton: false,
            },
          }); 
          dialogRef.afterClosed().subscribe((data) => {
            this.router.navigate(["/login"]);
          });
        }
        let legu = response.userProfileData.language_code;
        this._translateService.setDefaultLang(legu);
        const browserLang = this._translateService.getBrowserLang();
        this._translateService.use(legu);
        this.language = response.userProfileData.language_code;
        
      }, err => {
      }
      );


    } else {
      this.language = 'en'
      this.userMenuImgUrl = "assets/icons/ICON/UserMenu.svg";
      this.isShowMenu = false;
      this.isShowInvite = false;
      this.sharedService.nextCart(0);
        this.sharedService.sharedMessage.subscribe(
          (message) => (this.total_product = message)
        );

    }

    this.initIoConnection();
  }

  getNewsNotification(): Promise<any> {
    return new Promise(resolve => {
      if(!isNullOrUndefined(this.newsService.getNewsNotification())){
        this.newsService.getNewsNotification().subscribe( data =>{
          if(!isNullOrUndefined(data)){
            this.quantityNotifi = data
            this.sharedService.nextNewsNotification(this.quantityNotifi)
            this.sharedService.sharedNews.subscribe(news => this.quantityNotifi = news)
          }
        })
      }
    })
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.sendMessage("trung dep trai");

    this.ioConnection = this.socketService
      .onMessage()
      .subscribe((message: any) => {
        if (message == true) {
          this.getNewsNotification();
        }
      });

    this.socketService.onEvent(Event.CONNECT).subscribe(() => {
      console.log("connected");
    });

    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log("disconnected");
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }
    this.socketService.send(message);
  }

  changeLanguages(id) {
    // Use a language
    // this._translateService.use('tr');
    this._translateService.setDefaultLang(id);

    const browserLang = this._translateService.getBrowserLang();
    this._translateService.use(id);

    //update language
    if (!isNullOrUndefined(this.token)) {
      this.authService.changeLanguage(id).subscribe();
    }
    
    this.language = id;
  }

  moveToNewSList() {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/news"]));
  }

  moveToContactUs() {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/contact-us"]));
  }

  moveToRefundPolicy() {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/refund-policy"]));
  }

  moveToPrivacyPolicy() {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/privacy-policy"]));
  }

  moveToShippingPolicy() {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/shipping-policy"]));
  }

  moveToTermsAndCondition() {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/term-and-condition-policy"]));
  }

  moveToEventPrivacyPolicy() {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/event-term-condition"]));
  }

  moveToPurchasePrivacyPolicy() {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/purchase-term-condition"]));
  }

  moveNAEPTermsConditions() {
    if (this.entity === 'SG') {
      this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/naep-terms-conditions-sg"]));
      
    } else if (this.entity = 'MY') {
      this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/naep-terms-conditions-my"]));
    }
  }

  goToShoppingBag() {
    this.token = localStorage.getItem('token')
    if (isNullOrUndefined(this.token)) {
      const dialogRefLogin = this.dialog.open(FuseConfirmDialogComponent, {
        width: "550px",
        data: {
          message: "Please register or login to continue.",
        },
      });
      dialogRefLogin.afterClosed().subscribe((data) => {
        if (data === true) {
          this.router.navigate(["/login"], {
            queryParams: { redirect: "/check-out-improve" },
          });
        }
      });
    } else {
      this.router.navigate(["/check-out-improve"]);
    }
  }

  invite() {
    const port = this.document.location.port
      ? `:${this.document.location.port}`
      : "";
    const registerURL = `${this.document.location.protocol}//${this.document.location.hostname}${port}/register?contact_uuid=${this.my_reference_uuid}&language=${this.language}`;

    // console.log(registerURL);

    // if('share' in navigator){
    //     (navigator as any).share({
    //         title: 'title',
    //         text: 'description',
    //         url: 'https://soch.in//'
    //     }).then(()=>console.log('Shared')).catch(()=>console.log('error sharing'));

    //     console.log('hahah');
    //    // window.open("https://web.whatsapp.com/send?l=en&text=I%20would%20like%20to%20invite%20you%20to%20join%20me%20at%20 "+encodeURIComponent(url), "_blank")
    // }

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
    // const messageText = `I%20would%20like%20to%20invite%20you%20to%20join%20me%20at%20`;
    const messageText = `Welcome%20to%20Club%20Thermomix®.%20Sign%20up%20to%20discover%20more%20about%20Thermomix®%20at%20`;

    if (isMobile.any()) {
      const shareUrl = `whatsapp://send?text=${messageText}${registerURL}`;
      location.href = shareUrl;
    } else {
      window.open(
        `https://web.whatsapp.com/send?l=en&text=${messageText}${encodeURIComponent(
          registerURL
        )}`,
        "_blank"
      );
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'],
    {queryParams: {language: this.language}});
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
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
  toggleSidebarOpen(key): void {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
  }

  /**
   * Search
   *
   * @param value
   */
  search(value): void {
    // Do your search here...
    console.log(value);
  }

  /**
   * Set the language
   *
   * @param lang
   */
  setLanguage(lang): void {
    // Set the selected language for the toolbar
    this.selectedLanguage = lang;

    // Use the selected language for translations
    this._translateService.use(lang.id);
  }
}
