import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private loginService: loginService, private router: Router) {}

  login(): void {
    if (this.loginService.authenticate(this.username, this.password)) {

      this.router.navigate(['/projetos']);
    } else {

      this.errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
    }
  }
}
