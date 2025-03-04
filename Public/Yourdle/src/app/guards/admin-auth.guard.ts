import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class AdminAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router){}

  canActivate(): boolean {
    const isAdmin = this.auth.isAdmin();
    if (!isAdmin){
      this.router.navigate(['/']);
    }
    return true;
  }

}
