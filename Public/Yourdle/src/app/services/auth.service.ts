import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, retry } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor() { }

  private tokenName = environment.tokenName;

  private isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();

  private hasToken():boolean{
    return !!localStorage.getItem(this.tokenName);
  }

  login(token:string){
    localStorage.setItem(environment.tokenName, token);
    this.isLoggedIn.next(true);
  }

  logout(){
    localStorage.removeItem(environment.tokenName);
    this.isLoggedIn.next(false);
  }

  loggedUser(){
    const token = localStorage.getItem(this.tokenName);
    if (token){
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const decodedUTF8Payload = new TextDecoder('utf-8').decode(
        new Uint8Array(decodedPayload.split('').map(char => char.charCodeAt(0)))
      );
      return JSON.parse(decodedUTF8Payload);
    }
    return null;
  }

  isLoggedUser():boolean{
    return this.isLoggedIn.value;
  }

  isAdmin():boolean{
    const user = this.loggedUser();
    return user.data.role == "admin";
  }

}
