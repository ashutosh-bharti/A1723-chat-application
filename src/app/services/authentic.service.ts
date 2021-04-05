import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthenticService {

  private baseURL = 'http://localhost:3000/api';
  user: any;

  constructor(private http: HttpClient) {
    // this.user = { id: 2, email: 'ashu@bot.com', firstName: 'Ashutosh', lastName: 'Bharti' };
  }

  login(data: any): any {
    return this.http.post(this.baseURL + '/users', data);
  }

  register(user: any): any {
    return this.http.post(this.baseURL + '/users/new', user);
  }

  getUser(id: number): any {
    return this.http.get(this.baseURL + '/users/' + id);
  }

  updateDetails(id: number, data: any): any {
    return this.http.put(this.baseURL + '/users/' + id, data);
  }

  deleteDetails(id: number): any {
    return this.http.delete(this.baseURL + '/users/' + id);
  }

}


