import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
 providedIn: 'root',
})
export class ChatService {
 private socket: Socket;
 constructor() {
   this.socket = io('http://localhost:8000');
 }
 joinChat(userId: string) {
   this.socket.emit('join', userId);
 }
 sendMessage(senderId: string, receiverId: string, message: string) {
   this.socket.emit('private message', { senderId, receiverId, message });
 }
 getMessages(): Observable<{ senderId: string, message: string }> {
   return new Observable((observer) => {
     this.socket.on('private message', (msg) => {
       observer.next(msg);
     });
   });
 }
}