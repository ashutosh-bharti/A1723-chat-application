import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable()
export class ChatService {

  private baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }
  create(chat: any): any
   { 
     //return this.http.post('/api/chat/new', chat);
  }
  editChat(id:number){
    //return this.http.put('/api/chat' + id);
  }
  deleteChat(id:number){
    //return this.http.delete('/api/chat' + id );
  }
  getChatDetails(id:number){
    //return this.http.get('/api/chat' + id );
  }
  getChatPerson(chat:any){
    //return this.http.get('/api/chat', chat );
  }
  getChatGroup(chat:any){
    //return this.http.get('/api/chat/', chat );
  }
  getChatList(userId: number){
    return this.http.get(this.baseURL + '/chats/list/' + userId);
  }
}
