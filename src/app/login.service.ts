import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class loginService {
  private loggedInUser: any;

  constructor(private router: Router) {}

  authenticate(username: string, password: string): boolean {

    if (username === 'gestor' && password === 'senha123') {
      this.loggedInUser = { username: username, role: 'gestor' };
      this.router.navigate(['/projetos']); 
      return true; 
    } else if (username === 'dev1' && password === 'devsenha') {
      this.loggedInUser = { username: username, role: 'desenvolvedor' };
      this.router.navigate(['/projetos']);
      return true; 
    }

    return false; 
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