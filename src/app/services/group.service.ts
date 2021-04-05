import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GroupService {
  private baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  createGroup(data: any): any {
    return this.http.post(this.baseURL + '/groups/new', data);
  }

  updateGroupDetails(id: number, data: any): any {
    return this.http.put(this.baseURL + '/groups/' + id, data);
  }

  deleteGroup(id: number): any {
    return this.http.delete(this.baseURL + '/groups/'  + id);
  }

  getGroupDetails(id: number): any {
    return this.http.get(this.baseURL + '/groups/' + id);
  }

  getGroupList(data: any): any {
    return this.http.get(this.baseURL + `/groups/list?user_1=${data.user_1}&user_2=${data.user_2}`);
  }

  leaveGroup(id: any, userId: any): any {
    return this.http.delete(this.baseURL + `/groups/${id}/members?userId=${userId}`);
  }

  addMember(data: any): any {
    return this.http.post(this.baseURL + '/groups/members/new', data);
  }

  getMembers(id: number): any {
    return this.http.get(this.baseURL + `/groups/${id}/members`);
  }

  updateMembers(id: number, data: any): void {
    this.http.put(this.baseURL + `/groups/${id}/members`, data);
  }
}
