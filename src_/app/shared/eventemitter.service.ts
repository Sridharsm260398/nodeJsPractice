import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  private eventSubject = new Subject<any>();

  emit(event: any) {
    this.eventSubject.next(event);
  }

  on(eventName: string) {
    //return this.eventSubject.asObservable().filter(event => event.name === eventName);
  }
}
