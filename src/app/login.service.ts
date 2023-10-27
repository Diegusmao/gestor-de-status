import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class loginService {
  private loggedInUser: any; // Usuário autenticado

  authenticate(username: string, password: string): boolean {
    // Lógica de autenticação (substitua isso com sua lógica de autenticação real)
    // Por exemplo, você pode verificar as credenciais em um servidor ou banco de dados

    if (username === 'gestor' && password === 'senha123') {
      this.loggedInUser = { username: username, role: 'gestor' };
      return true; // Credenciais válidas
    } else if (username === 'dev1' && password === 'devsenha') {
      this.loggedInUser = { username: username, role: 'desenvolvedor' };
      return true; // Credenciais válidas
    }

    return false; // Credenciais inválidas
  }

  getLoggedInUser(): any {
    return this.loggedInUser;
  }

  isLoggedIn(): boolean {
    return this.loggedInUser !== undefined;
  }

  logout(): void {
    this.loggedInUser = undefined;
  }
}
