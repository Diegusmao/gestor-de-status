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

  constructor(private projetoTarefaService: ProjetoTarefaService) {
    this.projetoTarefaService.projetosObservable.subscribe(projetos => {
      this.listaProjetos = projetos;
    });
  }

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
        dataInicio: new Date(),
        horaInicio: this.formatarHora(new Date()), 
        tarefas: [],
        mostrarTarefas: false,
        percentualConclusao: 0,
      };

      await this.projetoTarefaService.adicionarProjeto(novoProjeto);
      this.nomeProjeto = '';
      this.setFocusNoInput();
    } catch (error: any) {
      console.error('Erro ao adicionar projeto:', error.message);
    }
  }

  async adicionarTarefa(projeto: Projeto): Promise<void> {
    if (projeto.nomeTarefa.trim()) {
      

      try {
        await this.projetoTarefaService.adicionarTarefa(projeto, projeto.nomeTarefa);
        projeto.nomeTarefa = '';
      } catch (error: any) {
        console.error('Erro ao adicionar tarefa:', error.message);
      }
    }
  }

  toggleTarefas(projeto: Projeto): void {
    projeto.mostrarTarefas = !projeto.mostrarTarefas;
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

  private formatarHora(data: Date): string {
    const horas = ('0' + data.getHours()).slice(-2);
    const minutos = ('0' + data.getMinutes()).slice(-2);
    return `${horas}:${minutos}`;
  }

  async marcarTarefaConcluida(projeto: Projeto, tarefa: Tarefa): Promise<void> {
    tarefa.concluida = !tarefa.concluida;
    await this.projetoTarefaService.atualizarTarefa(projeto, tarefa);
  }

  async marcarDesmarcarTarefa(projeto: Projeto, tarefa: Tarefa): Promise<void> {
    if (tarefa.concluida) {
      await this.projetoTarefaService.desmarcarTarefaComoConcluida(projeto, tarefa);
    } else {
      await this.projetoTarefaService.marcarTarefaComoConcluida(projeto, tarefa);
    }
  }

  
}