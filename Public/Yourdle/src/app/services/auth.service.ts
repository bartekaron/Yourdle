import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, retry } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private api: ApiService) {
    this.initialize();
  }

  private tokenName = environment.tokenName;
  private logoutTimer: any = null;
  private isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();

  private userSubject = new BehaviorSubject<any>(this.loggedUser());
  loggedUser$ = this.userSubject.asObservable();

  private hasToken():boolean{
    return !!localStorage.getItem(this.tokenName);
  }




  private setLogoutTimer(exp: number) {
    const now = Date.now();
    const expirationTime = exp * 1000;
    const timeUntilLogout = expirationTime - now;
  
    if (timeUntilLogout > 0) {
      this.logoutTimer = setTimeout(() => {
        this.logout();
      }, timeUntilLogout);
    } else {
      this.logout(); 
    }
  }
  

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch {
      return null;
    }
  }
  
  login(token:string){
    localStorage.setItem(environment.tokenName, token);
    this.isLoggedIn.next(true);
    this.userSubject.next(this.loggedUser());
    const decoded = this.decodeToken(token);
    if (decoded?.exp) {
      this.setLogoutTimer(decoded.exp);
    }
  }

  logout(){
    localStorage.removeItem(environment.tokenName);
    this.isLoggedIn.next(false);
    this.userSubject.next(null);
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
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

  updateUserData(newUserData: any) {
    this.userSubject.next(newUserData); 
  }


  initialize() {
    const token = localStorage.getItem(this.tokenName);
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded?.exp) {
        this.setLogoutTimer(decoded.exp);
      }
      this.loadUserFromToken(token);
    }
  }
  

loadUserFromToken(token: string) {
  const payload = this.decodeToken(token); 
  const userId = payload?.id;

  if (userId) {
    this.api.select('users/user', userId).subscribe((res: any) => {
      if (res && res.user) {
        const fullUser = {
          ...payload,
          image: res.user.profilePic
        };
        this.userSubject.next({ data: fullUser });
        this.isLoggedIn.next(true);
      }
    });
  }
}

}