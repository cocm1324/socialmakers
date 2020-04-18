import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from '@services/event/event.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	  
	blockUI: boolean = false;
    private subscriptions: Subscription[] = [];

    constructor(private eventService: EventService) { }

    ngOnInit(): void {
        const blockUIService$ = this.eventService.blockUI.subscribe((state: boolean) => {
           this.blockUI = state;
        });
        this.subscriptions.push(blockUIService$);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
