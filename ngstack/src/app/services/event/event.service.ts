import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  	providedIn: 'root'
})
export class EventService {
  	public blockUI: EventEmitter<boolean> = new EventEmitter();
}
