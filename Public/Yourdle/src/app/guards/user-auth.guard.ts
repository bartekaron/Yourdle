import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class UserAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router){}

  canActivate(): boolean {
    const isLoggedIn = this.auth.isLoggedUser();
    if (!isLoggedIn){
      this.router.navigate(['/']);
    }
    return true;
  }

}
