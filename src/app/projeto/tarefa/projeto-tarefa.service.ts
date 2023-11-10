import { Injectable } from '@angular/core';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model'; // Importe as interfaces necessárias

@Injectable({
    providedIn: 'root'
  })

  export class ProjetoTarefaService {
    private projetos: Projeto[] = [];
  
    constructor() {
      // Inicialize projetos se necessário
    }
  
    adicionarProjeto(projeto: Projeto): void {
      this.projetos.push(projeto);
    }
  
    adicionarTarefa(projetoId: number, tarefa: Tarefa): void {
      const projeto = this.projetos.find(p => p.id === projetoId);
      if (projeto) {
        projeto.tarefas.push(tarefa);
      }
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
        }
      }

      obterTarefaPorId(projetoId: number, tarefaId: number): Tarefa | undefined {
        const projeto = this.obterProjetoPorId(projetoId);
        if (projeto) {
          return projeto.tarefas.find(tarefa => tarefa.id === tarefaId);
        }
        return undefined;
      }
      
  }