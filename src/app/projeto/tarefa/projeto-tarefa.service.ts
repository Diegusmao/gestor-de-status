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

  async adicionarProjeto(projeto: Projeto): Promise<void> {
    try {
      const adicaoProjetoPromise = Promise.resolve().then(() => {
        this.projetos.push(projeto);
      });

      await Promise.race([adicaoProjetoPromise]);
      
      if (this.projetos.indexOf(projeto) === -1) {
        throw new Error('Estamos com problemas, mas em breve seu projeto será criado.');
      }

      await this.atualizarLocalStorage();
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      throw error;
    }
  }

  async adicionarTarefa(projeto: Projeto, nomeTarefa: string): Promise<void> {
    try {
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
      await this.atualizarProjeto(projeto);
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
  }

  obterProjetos(): Projeto[] {
    return this.projetos;
  }

  async obterProjetoPorId(projetoId: number): Promise<Projeto | undefined> {
    try {
      return this.projetos.find(projeto => projeto.id === projetoId);
    } catch (error) {
      console.error('Erro ao obter projeto por ID:', error);
      throw error;
    }
  }

  async atualizarProjeto(projeto: Projeto): Promise<void> {
    try {
      const index = this.projetos.findIndex(p => p.id === projeto.id);
      if (index !== -1) {
        this.projetos[index] = projeto;
        await this.atualizarLocalStorage();
      }
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  }

  async removerProjeto(projeto: Projeto): Promise<void> {
    try {
      const index = this.projetos.indexOf(projeto);
      if (index !== -1) {
        this.projetos.splice(index, 1);
        await this.atualizarLocalStorage();
      }
    } catch (error) {
      console.error('Erro ao remover projeto:', error);
      throw error;
    }
  }

  async obterTarefaPorId(projetoId: number, tarefaId: number): Promise<Tarefa | undefined> {
    try {
      const projeto = await this.obterProjetoPorId(projetoId);
      if (projeto) {
        return projeto.tarefas.find(tarefa => tarefa.id === tarefaId);
      }
      return undefined;
    } catch (error) {
      console.error('Erro ao obter tarefa por ID:', error);
      throw error;
    }
  }

  async removerTarefa(projeto: Projeto, tarefa: Tarefa): Promise<void> {
    try {
      const index = projeto.tarefas.indexOf(tarefa);
      if (index !== -1) {
        projeto.tarefas.splice(index, 1);
        await this.atualizarProjeto(projeto);
      }
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      throw error;
    }
  }

  private obterProjetosLocalStorage(): Projeto[] {
    try {
      const projetos = localStorage.getItem(this.PROJETOS_KEY);
      return projetos ? JSON.parse(projetos) : [];
    } catch (error) {
      console.error('Erro ao obter projetos do armazenamento local:', error);
      throw error;
    }
  }

  private async atualizarLocalStorage(): Promise<void> {
    try {
      localStorage.setItem(this.PROJETOS_KEY, JSON.stringify(this.projetos));
    } catch (error) {
      console.error('Erro ao atualizar armazenamento local:', error);
      throw error;
    }
  }
}
