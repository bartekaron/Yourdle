import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


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

  sendMail(data:object){
    return this.http.post(this.server + '/send', data);
  }

  updatePasswd(id:string,data:object){
    return this.http.patch(this.server + '/public/users/id/eq',+id, data);
  }

  uploadFile(file:File){
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.server + '/upload', formData, this.tokenHeader());
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

}
