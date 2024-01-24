import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('popup', {static: false}) popup: any;

  public roomId: string = "";
  public messageText: string = "";
  public messageArray: { user: string, room:any, message: string, receiver: string, rId: number }[] = [];
  public onlineUsers: {user: string, online : boolean}[] = [];

  private storageArray : any = [];

  public showScreen = false;
  public phone: string = "";
  public currentUser : any = [];
  public selectedUser : any = [];
  showChat = false;

  public userList: any = [
    {
      id: 1,
      name: 'Gurnain',
      phone: "7417151673",
      roomId: {
        2: 'room-1',
        3: 'room-2',
      },
      online: false 
    },
    {
      id: 2,
      name: 'Putin',
      phone: "7217574710",
      roomId: {
        1: 'room-1',
        3: 'room-4',
      },
      online: false 
    },
    {
      id: 3,
      name: 'Trump',
      phone: "9837361767",
      roomId: {
        1: 'room-2',
        2: 'room-4',
      },
      online: false 
    },
  ];

  constructor(
    private modalService: NgbModal,
    private chatService: ChatService
  ) {
  }

  ngOnInit(): void {
    console.log("hi", this.messageArray);
      this.chatService.getLoginUsers().subscribe((data: any) => {
        console.log("ggg", data);
        this.userList.forEach((element: any) => {
          const userData = data.find((user: any) => user.userId === element.id);
          element.online = userData ? userData.online : false;
        });
        this.chatService.getMessage()
        .subscribe((data: any) => {
          this.messageArray = data;
          console.log("gg", this.messageArray);
          
        });
        console.log("usersss", this.userList);
        
      });


  }

  ngAfterViewInit(): void {
    this.openPopup(this.popup);
  }

  openPopup(content: any): void {
    this.modalService.open(content, {backdrop: 'static', centered: true});
  }

  login(dismiss: any): void {
    this.currentUser = this.userList.find((user : any) => user.phone === this.phone.toString());
    this.chatService.login(this.currentUser.id);
    this.chatService.sendMessage(true);
    this.userList = this.userList.filter((user: any) => user.phone !== this.phone.toString());
    console.log("mm", this.messageArray);
    
    if (this.currentUser) {
      this.showScreen = true;
      dismiss();
    }
  }

  logout(): void{
    this.chatService.logout(this.currentUser.id);
    this.showScreen = false;
    this.showChat = false;
    this.userList.push(this.currentUser);
    this.currentUser = []; 
    this.openPopup(this.popup);
  }

  selectUserHandler(phone: string): void {
    this.showChat =true;
    this.selectedUser = this.userList.find((user: any) => user?.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    // this.messageArray = [];
    // this.chatService.getMessage()
    // .subscribe((data: { user: string, room: string, message: string }) => {
    //   this.messageArray.push(data);
    // });
    this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({user: username, room: roomId});
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText,
      receiver: this.selectedUser.name,
      rId: this.selectedUser.id
    });
    this.messageText = '';
  }

}