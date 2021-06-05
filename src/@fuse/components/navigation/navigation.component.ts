import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { filter } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { isNullOrUndefined } from 'util';
import { NaepService } from 'app/core/service/naep.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service'
import { environment } from 'environments/environment';

@Component({
    selector       : 'fuse-navigation',
    templateUrl    : './navigation.component.html',
    styleUrls      : ['./navigation.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseNavigationComponent implements OnInit
{
    @Input()
    layout = 'vertical';

    @Input()
    navigation: any;

    navigations = [];

    is_anomynous_account : boolean =  false;

    decoded: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    checkRecruitment: boolean = true;
    entity = environment.entity;

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private naepService: NaepService,
        private _authService : AuthService
    )
    {
        // Set the private defaults
        let token = localStorage.getItem('token');
        this._unsubscribeAll = new Subject();
        let url: string
        let tokenParam: any
        let decrypt: any
        let isRegistered
        // get url check questionnaire
        // this.router.events.pipe(
        //     filter(event => event instanceof NavigationEnd)
        // ).subscribe(() => {
        //     url = this.activatedRoute.snapshot['_routerState'].url
        // });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        let token = localStorage.getItem('token');
        if (!isNullOrUndefined(token)){
            this.decoded = jwt_decode(token); 
            

            //Check is_anomynous_account
            this._authService.checkIsAnomynousAccount().subscribe(response=>{
                this.is_anomynous_account = response.data;
            })
            
        }
        // Load the navigation either from the input or from the service
        this.navigation = this.navigation || this._fuseNavigationService.getCurrentNavigation();

        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Load the navigation
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
                // this.naepService.checkRecruitment().subscribe( data => {
                //     this.checkRecruitment = data
                //     this.checkEnableByRole();
                // })
                this.checkEnableByRole();
                // // Mark for check
                // this._changeDetectorRef.markForCheck();
            });

        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
         .subscribe(() => {

             // Mark for check
             this._changeDetectorRef.markForCheck();
         });
    }

    checkEnableByRole(){
        // await this.naepService.checkRecruitment().subscribe( data => {
            let arrRemove = [];
            let isShow: boolean = true;
            let token = localStorage.getItem('token');
            if(!isNullOrUndefined(token) ){
                this.naepService.checkRecruitment().subscribe( data => {
                        this.checkRecruitment = data
                        this.checkMenu()
                })

            } else {
                this.checkRecruitment = false
                this.checkMenu()
            }
            
          
        // })
  
    }

    checkMenu(){
        let arrRemove = [];
        let isShow: boolean = true;
        
        this.navigation.forEach(item => {
            isShow = true;
            //check hide terms_and_conditions
            if (item.id === 'terms_and_conditions' && this.entity === 'SG') {
                item.children.forEach(element => {
                    if (element.id === 'privacy_policy' || element.id === 'refund_policy' || element.id === 'shipping_policy'
                    || element.id === 'term_and_condition_policy' || element.id === 'purchase_term_condition' 
                    || element.id === 'event_term_condition') {

                        arrRemove.push(element.id);
                    }
                });
            }

            if(isNullOrUndefined(this.decoded) || this.is_anomynous_account){
                if (item.id === 'store' || item.id === 'cookidoo_recipes'){
                    isShow = true;
                } else {
                    isShow = false;
                }
            } else {
                    if (this.decoded.role.length > 0){
                        if(item.id === 'advisor-recruitment' &&  this.checkRecruitment){
                            isShow = true;
                        }
                        if(item.id === 'advisor-recruitment' &&  !this.checkRecruitment){
                            isShow = false;
                        }
                        if (this.decoded.role.indexOf("ADVISOR") !== -1){
                            if (item.id === 'advisor' || item.id === 'commissions_awards' || item.id === 'cookidoo_recipes'){
                                isShow = true;
                            } else if (item.id ==='become_an_advisor'){
                                isShow = false;
                            }
                        }
                        if (this.decoded.role.indexOf("TEAM_LEADER") !== -1){
                            if(item.id === 'team_leader'){
                                isShow = true;
                            }
                            if(item.id === 'reports'){
                                isShow = true
                            }
                        } else {
                            if(item.id === 'team_leader'){
                                isShow = false;
                            }
                            if(item.id === 'reports'){
                                isShow = false;
                            }
                        }
                        if (this.decoded.role.indexOf("BRANCH_MANAGER") !== -1){
                            if(item.id === 'branch_manager'){
                                isShow = true
                            }
                            if(item.id === 'reports'){
                                isShow = true
                            }
                        } else {
                            if(item.id === 'branch_manager'){
                                isShow = false;
                            }
                            // if(item.id === 'reports'){
                            //     isShow = false;
                            // }
                        }
                    } else {
                        if(item.id === 'advisor' || item.id === 'team_leader' || item.id === 'branch_manager'){
                            isShow = false;
                        } else if (item.id === 'become_an_advisor'){
                            isShow = true;
                        } else if (item.id === 'reports'){
                            isShow = false;
                        } else if(item.id === 'advisor-recruitment' &&  this.checkRecruitment){
                            isShow = true;
                        } else if(item.id === 'advisor-recruitment' &&  !this.checkRecruitment){
                            isShow = false;
                        } else if(item.id === 'commissions_awards'){
                            isShow = false;
                        } 
                        else {
                            isShow = true;
                        }
                    }
                // })
            }
            if (!isShow){
                arrRemove.push(item.id);
            }
        });  

        let listTerm;
        let arr;
        if (this.entity === 'SG') {
            arr = this.navigation.filter(function(item){
                if (item.id === 'terms_and_conditions') {
                    listTerm = item.children.filter(e => arrRemove.indexOf(e.id) === -1);
                    item.children = [] = listTerm;
                }
                return arrRemove.indexOf(item.id) === -1;
            });
                
            if (environment.production === true) {
                // remove host gift
                arr = arr.filter((item) => {
                    if (item.id === "advisor") {
                        let temp;
                        temp = item.children.filter(e => e.id !== "host_gift");
                        item.children = temp;
                    }   
                    return arrRemove.indexOf(item.id) === -1;
                })
            }
        } else {
            arr = this.navigation.filter(function(item){
                return arrRemove.indexOf(item.id) === -1;
            });
        }

        this.navigations = arr;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }


}
