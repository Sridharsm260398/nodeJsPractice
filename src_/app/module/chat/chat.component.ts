
import { Component, OnInit, Input, Injectable, importProvidersFrom, Inject } from '@angular/core';
import { ChatService } from '../../shared/chat.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgFor, NgIf,CommonModule, FormsModule, SharedModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers:[MatSnackBar],
})
export class ChatComponent implements OnInit {
 messages: { senderId: string, message: string }[] = [];
 message: string = '';
 userId: string;
 receiverId: string;
 userIconUrl: string;
 receiverIconUrl: string;

 constructor(@Inject(MAT_DIALOG_DATA) public data: any, private snackBar:MatSnackBar,
 private chatService:ChatService
 ) {
   this.userId = data.userId;
   this.receiverId = data.receiverId;
   this.userIconUrl = data.userIconUrl;
   this.receiverIconUrl = data.receiverIconUrl;
   this.chatService.joinChat(this.userId);
   this.chatService.getMessages().subscribe((msg) => {
     this.messages.push(msg);
     if (msg.senderId !== this.userId) {
       this.snackBar.open(`${msg.senderId}: ${msg.message}`, 'Close', {
         duration: 3000,
       });
     }
   });
 }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
 sendMessage(): void {
   if (this.message.trim()) {
     this.chatService.sendMessage(this.userId, this.receiverId, this.message);
     this.message = '';
   }
 }
}