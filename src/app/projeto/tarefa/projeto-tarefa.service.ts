
import { Injectable } from '@angular/core';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetoTarefaService {
  private projetos: Projeto[] = [];
  private readonly PROJETOS_KEY = 'projetos';

  constructor() {
    this.projetos = this.obterProjetosLocalStorage();
  }

  adicionarProjeto(projeto: Projeto): void {
    this.projetos.push(projeto);
    this.atualizarLocalStorage();
  }

  adicionarTarefa(projeto: Projeto, nomeTarefa: string): void {
    const novaTarefa = {
      id: projeto.tarefas.length + 1,
      nome: nomeTarefa,
      descricao: 'Descrição da Tarefa',
      projetoId: projeto.id,
      concluida: false,
      peso: 1,
      atividades: []
    };

    projeto.tarefas.push(novaTarefa);
    this.atualizarProjeto(projeto);
  }

  obterProjetos(): Projeto[] {
    return this.projetos;
  }

  obterProjetoPorId(projetoId: number): Projeto | undefined {
    return this.projetos.find(projeto => projeto.id === projetoId);
  }

  atualizarProjeto(projeto: Projeto): void {
    const index = this.projetos.findIndex(p => p.id === projeto.id);
    if (index !== -1) {
      this.projetos[index] = projeto;
      this.atualizarLocalStorage();
    }
  }

  removerProjeto(projeto: Projeto): void {
    const index = this.projetos.indexOf(projeto);
    if (index !== -1) {
      this.projetos.splice(index, 1);
      this.atualizarLocalStorage();
    }
  }

  obterTarefaPorId(projetoId: number, tarefaId: number): Tarefa | undefined {
    const projeto = this.obterProjetoPorId(projetoId);
    if (projeto) {
      return projeto.tarefas.find(tarefa => tarefa.id === tarefaId);
    }
    return undefined;
  }

  removerTarefa(projeto: Projeto, tarefa: Tarefa): void {
    const index = projeto.tarefas.indexOf(tarefa);
    if (index !== -1) {
      projeto.tarefas.splice(index, 1);
      this.atualizarProjeto(projeto);
    }
  }

  private obterProjetosLocalStorage(): Projeto[] {
    const projetos = localStorage.getItem(this.PROJETOS_KEY);
    return projetos ? JSON.parse(projetos) : [];
  }

  private atualizarLocalStorage(): void {
    localStorage.setItem(this.PROJETOS_KEY, JSON.stringify(this.projetos));
  }
}
