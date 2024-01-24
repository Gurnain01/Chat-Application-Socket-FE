import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  
  constructor() {
    this.socket = io('http://localhost:3000', {transports: ['websocket', 'polling', 'flashsocket']});
  }

  joinRoom(data: any): void {
    this.socket.emit('join', data);
  }

  sendMessage(data: any): void {
    this.socket.emit('message', data);
  }

  getMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('new message', (data) => {
        console.log("sdfsfsfsf", data);
        
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }

  login(data: number):void{
    this.socket.emit('new-user-add', data);
  }

  logout(data: number): void{
    this.socket.emit('offline', data);
  }

  getLoginUsers(): Observable<number>{
    return new Observable<number>(observer =>{
      this.socket.on('get-users', (data: any)=>{
        console.log("fff", data);
        observer.next(data)
      });
      return () => {
        this.socket.disconnect();
      }
    })
  }

  userStatus(): Observable<{ user: string, status: 'online' | 'offline' }> {
    return new Observable<{ user: string, status: 'online' | 'offline' }>(observer => {
      this.socket.on('user joined', (data: any) => {
        console.log('User joined:', data);
        // Handle the event data here
      });
    });
  }
}