import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GroupChatService {
  private baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }
  createGroup(group: any): any {
    // return this.http.post('groups/', group);
  }

  updateGroupDetails(id: number): any {
    // return this.http.put('/groups/' + id,{});
  }

  deleteGroup(id: number): any {
  // return this.http.delete('/groups/'  + id);

  }

  getGroupDetails(id: number): any {
  // return this.http.get('/api/groups/' + id);
  }

  leaveGroup(id: number): any {
    // return this.http.post('/groups/' + id,{});
  }

  addMember(data: any): any {
    // return this.http.post('/groups/' + id,{});
  }

  getMembers(id: number): any {
    return this.http.get(this.baseURL + '/groups/' + id + '/members');
  }

  updateMembers(data: any): void {
    this.http.put(this.baseURL + '/groups/' + data.groupId + '/members', { userId: data.userId, isAdmin: data.isAdmin});
  }
}
