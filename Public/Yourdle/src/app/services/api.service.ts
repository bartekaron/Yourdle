  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';


  @Injectable({
    providedIn: 'root'
  })

  export class ApiService {

    constructor(private http: HttpClient) { }

    private tokenName = environment.tokenName;
    private server = environment.serverUrl;

    getToken():String | null{
      return localStorage.getItem(this.tokenName);
    }

    tokenHeader(): { headers: HttpHeaders } {
      const token = this.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return { headers };
  }


    registration(data:object){
      return this.http.post(this.server + '/users/register', data);
    }

    login(data:object){
      return this.http.post(this.server + '/users/login', data);
    }

    read(table: string, field:string, op: string, value: string){
      return this.http.get(this.server + '/public/'+table+'/'+field+'/'+op+'/'+value);
    }

    // token-el védett metódusok:

    select(table: string, field:string){
      return this.http.get(this.server + '/'+table+'/'+field, this.tokenHeader());
    }

    selectAll(table: string){
      return this.http.get(this.server + '/' + table, this.tokenHeader());
    }

    insert(table: string, data:object){
      return this.http.post(this.server + '/'+table, data, this.tokenHeader());
    }

    update(table:string, id:string, data:object){
      return this.http.patch(this.server + '/'+table + '/' +id, data, this.tokenHeader());
    }

    delete(table:string, id:string){
      return this.http.delete(this.server + '/'+table+ '/' +id, this.tokenHeader());
    }

    delete2(table:string, name:string){
      return this.http.delete('http://localhost:3000/' +table +'/' + name, this.tokenHeader());
    }

    deleteByEmail(email:string){
      return this.http.delete(this.server + '/users/delete/' + email, this.tokenHeader());
    }

    editUser(id: string){
      return this.http.patch(this.server + '/users/edit/' + id, this.tokenHeader());
    }

    forgottPassword(data:object){
      return this.http.post(this.server + '/forgott-password', data);
    }

    updatePasswd(id:string,data:object){
      return this.http.patch(this.server + '/public/users/id/eq',+id, data);
    }

    getAllUsers(){
      return this.http.get(this.server + '/users/allUsers', this.tokenHeader());
    }

    uploadFile(profilePicture:File, id:string){
      const formData = new FormData();
      formData.append('profilePicture', profilePicture);
      formData.append('id', id);
      console.log(formData);
      return this.http.post('http://localhost:3000/'+ 'uploadProfilePicture', formData, this.tokenHeader());
    }

    deleteFile(file:File){
      return this.http.delete(this.server + '/delete'+file, this.tokenHeader());
    }

    post(name:string, data:object){
      return this.http.post('http://localhost:3000/' + name, data, this.tokenHeader());
    }

    profileSave(data: object) {
      return this.http.patch(this.server + '/users/profile', data, this.tokenHeader());
    }

    deleteProfilePicture(id: string) {
      return this.http.delete(this.server + '/users/deleteProfilePicture/' + id, this.tokenHeader());
    }
    
    MatchHistory(id: string) {
      return this.http.get(this.server + '/users/history/' + id, this.tokenHeader());
    }
    
    ChangePassword(id: string, data: object) {
      return this.http.patch(this.server + '/users/change-password/' + id, data, this.tokenHeader());
   }
   
   getUserById(userID: string): Observable<any> {
    return this.http.get<any>(this.server + '/users/' + userID, this.tokenHeader());
  }
  
    
   //Kategóriákhoz tartozó metódusok

   getPublicCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.server + '/categories/allPublicCategories');
 }

    getUser(id: string) {
      return this.http.get(this.server + '/users/' + id, this.tokenHeader());
    }

    createCategory(data: object) {
      return this.http.post(this.server + '/categories/category', data, this.tokenHeader());
    }

}
