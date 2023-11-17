// api-service.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; 

  async get(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Erro na requisição GET: ${response.statusText}`);
      }
      return response.json();
    } catch (error: any) {
      throw new Error(`Erro na requisição GET: ${error.message}`);
    }
  }

  async post(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Erro na requisição POST: ${response.statusText}`);
      }
      return response.json();
    } catch (error: any) {
      throw new Error(`Erro na requisição POST: ${error.message}`);
    }
  }

  async put(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Erro na requisição PUT: ${response.statusText}`);
      }
      return response.json();
    } catch (error: any) {
      throw new Error(`Erro na requisição PUT: ${error.message}`);
    }
  }

  async delete(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Erro na requisição DELETE: ${response.statusText}`);
      }
      return response.json();
    } catch (error: any) {
      throw new Error(`Erro na requisição DELETE: ${error.message}`);
    }
  }
}