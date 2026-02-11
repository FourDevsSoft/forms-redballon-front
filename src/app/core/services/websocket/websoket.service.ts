import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GlobalService } from '../../services/global.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    private socket?: Socket;

    constructor(private globalService: GlobalService, private http: HttpClient) {}

    connect(url: string): void {
        this.socket = io(url);
    }

    listen(eventName: string): Observable<any> {
        return new Observable(observer => {
            this.socket?.on(eventName, (data: any) => {
                observer.next(data);
            });

            return () => this.socket?.off(eventName);
        });
    }
}
