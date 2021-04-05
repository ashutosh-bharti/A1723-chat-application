import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable()
export class ChatService {

  private baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  createChat(data: any): any {
    return this.http.post(this.baseURL + '/chats/new', data);
  }

  updateChatStatus(id: number, data: any): any {
    return this.http.put(this.baseURL + '/chats/' + id, data);
  }

  deleteChat(id: number): any {
    return this.http.delete(this.baseURL + '/chats/' + id);
  }

  createMessage(data: any): any {
    return this.http.post(this.baseURL + '/chats/messages/new', data);
  }

  getMessageDetails(id: number): any {
    return this.http.get(this.baseURL + '/chats/messages/' + id );
  }

  updateMessage(id: number, data: any): any {
    return this.http.put(this.baseURL + '/chats/messages/' + id, data);
  }

  getChats(id: number): any {
    return this.http.get(this.baseURL + '/chats/' + id);
  }

  createChatList(data: any): any {
    return this.http.post(this.baseURL + '/chats/list/new', data);
  }

  getChatList(userId: number): any {
    return this.http.get(this.baseURL + '/chats/list/' + userId);
  }

  deleteChatList(id: any): any {
    return this.http.delete(this.baseURL + '/chats/list/' + id);
  }
}
