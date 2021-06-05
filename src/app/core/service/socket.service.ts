import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Event } from './../enum/event';
import { environment } from './../../../environments/environment';


import * as socketIo from 'socket.io-client';

// const SERVER_URL = 'http://192.168.0.102:8808';
// const SERVER_URL = 'https://stag2a-thermomix.doxa-holdings.com';
const SERVER_URL = environment.baseUrl;

@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public send(message: any): void {
        this.socket.emit('msgToServer', message);
    }

    public onMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('msgToClient', (data: any) => {
                observer.next(data);
            });

        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}
