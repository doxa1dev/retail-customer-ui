import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ActivitiesService } from 'app/core/service/activities.service'
import { Title } from 'app/core/enum/title';


@Component({
    selector: 'activities-overview',
    templateUrl: './activities-overview.component.html',
    styleUrls  : ['./activities-overview.component.scss']
})
export class ActivitiesOverviewComponent
{
    constructor(
        private router: Router,
        private _activitiesService:ActivitiesService
    ) { 
        
    }
    title = Title.DOT
    upcoming: number = 0;
    completed: number = 0;
    ngOnInit(): void
    {
        this._activitiesService.getNumberActivityofCustomer().subscribe(data=>{
            this.upcoming = data.upcoming; 
            this.completed = data.completed;
        })

    }

    navigateToUpcoming()
    {
        this.router.navigate(['activity-overview/view-class'], { queryParams: { page: "upcoming" } })
    }

    navigateToCompleted()
    {
        this.router.navigate(['activity-overview/view-class'], { queryParams: { page: "completed" } })
    }

    navigateToClass()
    {
        this.router.navigate(['activity-overview/find-classes'])
    }
}

