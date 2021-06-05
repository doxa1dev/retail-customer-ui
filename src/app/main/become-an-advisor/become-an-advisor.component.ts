import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { environment } from 'environments/environment';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { AuthService } from 'app/core/service/auth.service';
import { isNullOrUndefined } from 'util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector   : 'become-an-advisor',
    templateUrl: './become-an-advisor.component.html',
    styleUrls  : ['./become-an-advisor.component.scss']
})
export class BecomeAnAdvisorComponent implements OnInit
{
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    storageUrl = environment.storageUrl;
    advisorImg: string;
    advisorName: string;
    advisorId: string;
    advisorIdNumber: string;
    advisorCheck: boolean = true;
    advisorRadio: boolean = true;
    checkSearch: boolean = false;
    notAdvisor: boolean = false;
    isClear: boolean;
    form: FormGroup;

    active: boolean = false;
    buttonName: string = 'Search';
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private authService: AuthService, 
        private formBuilder: FormBuilder,
        private router : Router,
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }
    /**
     * ngOnInit
     */
    ngOnInit(){
        this.form = this.formBuilder.group({
            advisorId: ['',[Validators.required, Validators.pattern("^[0-9]*$")]]
        });
        this.isClear = true;
    }

    /**
     * click button Search
     */
    serach(){
        this.active = true;
        this.buttonName = "Processing...";
        this.isClear = false;
        this.authService.getAdvisor(this.advisorId).subscribe(
            response =>{
              if (response.code === 200){
                //   console.log(response);
                this.active = false;
                this.buttonName = "Search"
                this.notAdvisor = false;
                this.advisorIdNumber = response.advisor_display.advisor_id;
                this.advisorImg = this.storageUrl + response.advisor_display.profile_photo_key;
                this.advisorName = !response.advisor_display.preferred_name ? response.advisor_display.firt_name : response.advisor_display.preferred_name;
              } else {
                this.notAdvisor = true;
                this.active = false;
                this.buttonName = "Search"
              }
            });
    }

    /**
     * Click button submit
     */
    submit(){
        this.authService.updateAdvisor(this.advisorId).subscribe(
            response =>{
            if (response.code == 200){
                this.router.navigate(['/become-an-advisor-done']);
            }
        });
    }

    /**
     * change Advisor
     */
    changeAdvisor(){
        this.advisorRadio = false;
    }

    /**
     * change Id
     */
    changeId(){
        this.checkSearch = !isNullOrUndefined(this.advisorId);
    }
    
    /**
     * click button cancel
     */
    cancel(){
        this.isClear = true;
        this.advisorId = '';
        this.checkSearch = false;
    }
}
class Product{
    product: string;
    category : string;
    available: number;
    price : string;
    active: boolean;
    constructor(Pd: string, C: string, A: number, Pr: string,Ac:boolean){
        this.product = Pd;
        this.category = C;
        this.available = A;
        this.price = Pr;
        this.active = Ac
    }
}
