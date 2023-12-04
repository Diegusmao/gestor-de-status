import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';  

  constructor(private httpClient: HttpClient) {}

  async get(endpoint: string): Promise<any> {
    try {
      return this.httpClient.get(`${this.apiUrl}/${endpoint}`).toPromise();
    } catch (error: any) {
      throw new Error(`Erro na requisição GET: ${error.message}`);
    }
  }

  async post(endpoint: string, data: any): Promise<any> {
    try {
      return this.httpClient.post(`${this.apiUrl}/${endpoint}`, data).toPromise();
    } catch (error: any) {
      throw new Error(`Erro na requisição POST: ${error.message}`);
    }
  }

  async put(endpoint: string, data: any): Promise<any> {
    try {
      return this.httpClient.put(`${this.apiUrl}/${endpoint}`, data).toPromise();
    } catch (error: any) {
      throw new Error(`Erro na requisição PUT: ${error.message}`);
    }
  }

  async delete(endpoint: string): Promise<any> {
    try {
      return this.httpClient.delete(`${this.apiUrl}/${endpoint}`).toPromise();
    } catch (error: any) {
      throw new Error(`Erro na requisição DELETE: ${error.message}`);
    }
  }
}
