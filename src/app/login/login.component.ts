import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loginService } from '../login.service'; // Ajuste o caminho conforme a estrutura do seu projeto

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
      // Autenticação bem-sucedida, redirecionar para a rota protegida (por exemplo, /projetos)
      this.router.navigate(['/projetos']);
    } else {
      // Exibir mensagem de erro se a autenticação falhar
      this.errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
    }
  }
}
