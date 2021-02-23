import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';



@Injectable()
export class AuthenticService {

  users: any = [{username:'abs@xyz.com',password:'Abcd@123',firstName:'Abc',lastName:'Xyz',id:1}];
  constructor(private http: HttpClient) { }

  //login(loginForm:LoginForm){
  //return this.http.post<any>('/api/user', user).pipe
    // this.users[0].username
  //}
  register(user: any): any {
    //return this.http.post('/api/user/new', user);
  }
  getUser(id: number): any {
  //return this.http.get('/api/user/' + id);  
  }
  updateDetails(id: number): any {
    //return this.http.get('/api/user/' + id);
  }
  deleteDetails(id: number):any{
 //return this.http.delete('./api/users/' + id);
}  



}


