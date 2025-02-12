import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [Dialog, ButtonModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  static instance: LoginComponent;

  
  visible: boolean = false;

  constructor() {
    LoginComponent.instance = this;
  }
  
  showDialog() {
      this.visible = true;
  }

  closeDialog() {
      this.visible = false;
  }

}
