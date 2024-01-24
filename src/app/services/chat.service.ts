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

   /**
   * @author: Gurnain
   * Sends object which contains message and other information of the sender and receiver
   **/
  sendMessage(data: any): void {
    this.socket.emit('message', data);
  }
 /**
   * @author: Gurnain
   * Gets message array which contains previous messages when app opens
   **/
  getMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('new message', (data) => {        
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }

 /**
   * @author: Gurnain
   * Sends id of the user when logged in
   **/
  login(data: number):void{
    this.socket.emit('new-user-add', data);
  }

 /**
   * @author: Gurnain
   * Sends id of the user when logged out in
   **/
  logout(data: number): void{
    this.socket.emit('offline', data);
  }

   /**
   * @author: Gurnain
   * Gets all the users logged in
   **/
  getLoginUsers(): Observable<number>{
    return new Observable<number>(observer =>{
      this.socket.on('get-users', (data: any)=>{
        observer.next(data)
      });
      return () => {
        this.socket.disconnect();
      }
    })
  }
}