// projeto.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProjetoTarefaService } from 'src/app/projeto/tarefa/projeto-tarefa.service';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from '../models/tarefa.model';

@Component({
  selector: 'app-projeto',
  templateUrl: './projeto.component.html',
  styleUrls: ['./projeto.component.css']
})
export class ProjetoComponent implements OnInit {
  PROJETO_KEY = 'projeto_key';
  listaProjetos: Projeto[] = [];
  nomeProjeto: string = '';

  @ViewChild('projetoInput', { static: false }) projetoInput!: ElementRef<HTMLInputElement>;

  constructor(private projetoTarefaService: ProjetoTarefaService) {}

  ngOnInit(): void {
    this.carregarProjetos();
  }

  async carregarProjetos(): Promise<void> {
    try {
      this.listaProjetos = await this.projetoTarefaService.obterProjetos();
    } catch (error: any) {
      console.error('Erro ao carregar projetos:', error.message);
    }
  }

  async adicionarProjeto(): Promise<void> {
    if (!this.nomeProjeto.trim()) {
      return;
    }

    try {
      const novoProjeto: Projeto = {
        id: this.listaProjetos.length + 1,
        nome: this.nomeProjeto,
        nomeTarefa: '',
        tarefas: []
      };

      await this.projetoTarefaService.adicionarProjeto(novoProjeto);
      this.nomeProjeto = '';
      this.setFocusNoInput();
    } catch (error: any) {
      console.error('Erro ao adicionar projeto:', error.message);
    }
  }

  async adicionarTarefa(projeto: Projeto): Promise<void> {
    if (!projeto.nomeTarefa.trim()) {
      return;
    }

    try {
      await this.projetoTarefaService.adicionarTarefa(projeto, projeto.nomeTarefa);
      projeto.nomeTarefa = '';
    } catch (error: any) {
      console.error('Erro ao adicionar tarefa:', error.message);
    }
  }

  async removerProjeto(projeto: Projeto): Promise<void> {
    try {
      await this.projetoTarefaService.removerProjeto(projeto);
    } catch (error: any) {
      console.error('Erro ao remover projeto:', error.message);
    }
  }

  async removerTarefa(projeto: Projeto, tarefa: Tarefa): Promise<void> {
    try {
      await this.projetoTarefaService.removerTarefa(projeto, tarefa);
    } catch (error: any) {
      console.error('Erro ao remover tarefa:', error.message);
    }
  }

  setFocusNoInput(): void {
    this.projetoInput.nativeElement.focus();
  }
}