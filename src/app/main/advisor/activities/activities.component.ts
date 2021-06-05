import { Component , ViewEncapsulation } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { Router } from '@angular/router';
import { Title } from 'app/core/enum/title'
import { ActivitiesService } from 'app/core/service/activities.service'
@Component({
    selector: 'activities',
    templateUrl: './activities.component.html',
    styleUrls  : ['./activities.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class ActivitiesComponent
{
    title = Title.DOT
    upcoming: number = 0;
    completed: number = 0;
    pending : number = 0;
    rejected: number = 0;
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private router:Router,
        private _activitiesService: ActivitiesService,
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._activitiesService.getNumberActivitiesOfAdvisor().subscribe(data=>{
            this.upcoming = data.data.active > 0 ? data.data.active : 0 ;
            this.completed = data.data.completed> 0 ? data.data.completed : 0 ;
            this.pending = data.data.pending> 0 ? data.data.pending : 0 ;
            this.rejected = data.data.rejected> 0 ? data.data.rejected : 0 ;
        })
    }

    navigateToUpcoming(){
        this.router.navigate(['advisor/activities/upcoming-activities'],{queryParams: {page: "upcoming"}})
    }

    navigateToCompleted(){
        this.router.navigate(['advisor/activities/upcoming-activities'], {queryParams: {page: "completed"}})
    }

    navigateToPending(){
        this.router.navigate(['advisor/activities/upcoming-activities'], {queryParams: {page: "pending"}})
    }
    
    navigateToCreateActivity(){
        this.router.navigate(['advisor/activities/create-activity'])
    }
    
    navigateToReject(){
        this.router.navigate(['advisor/activities/upcoming-activities'], {queryParams: {page: "rejected"}})
    }
}

