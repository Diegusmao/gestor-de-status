import { Injectable } from '@angular/core';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjetoTarefaService {
  private readonly PROJETOS_KEY = 'projetos';
  private projetosSubject: BehaviorSubject<Projeto[]> = new BehaviorSubject<Projeto[]>([]);
  projetosObservable: Observable<Projeto[]> = this.projetosSubject.asObservable();
  private percentualConclusaoSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  percentualConclusaoObservable: Observable<number> = this.percentualConclusaoSubject.asObservable();

  constructor() {
    this.projetos = this.obterProjetosLocalStorage();
    this.atualizarPercentualConclusao();
  }

  private inicializarTarefas(projeto: Projeto): void {
    projeto.tarefas.forEach(tarefa => {
      if (tarefa.concluida === undefined) {
        tarefa.concluida = false;
      }
    });
  }

  private set projetos(value: Projeto[]) {
    this.projetosSubject.next(value);
    this.atualizarPercentualConclusao();
    this.salvarProjetosNoLocalStorage();
  }

  get projetos(): Projeto[] {
    return this.projetosSubject.getValue();
  }

  private atualizarPercentualConclusao() {
    const projetos = this.projetos;
    const totalTarefas = projetos.reduce((acc, projeto) => acc + projeto.tarefas.length, 0);
    const tarefasConcluidas = projetos.reduce(
      (acc, projeto) =>
        acc + projeto.tarefas.filter((tarefa) => tarefa.concluida).length,
      0
    );
    const percentualConclusao = totalTarefas > 0 ? (tarefasConcluidas / totalTarefas) * 100 : 0;
    this.percentualConclusaoSubject.next(percentualConclusao);
    this.salvarProjetosNoLocalStorage();
  }

  private calcularPercentualConclusaoProjeto(projeto: Projeto): void {
    const totalTarefas = projeto.tarefas.length;
    const tarefasConcluidas = projeto.tarefas.filter(tarefa => tarefa.concluida).length;
    const percentualConclusao = totalTarefas > 0 ? (tarefasConcluidas / totalTarefas) * 100 : 0;
    projeto.percentualConclusao = percentualConclusao;
    this.atualizarPercentualConclusao(); 
  }

  
  async adicionarProjeto(projeto: Projeto): Promise<void> {
    try {
      projeto.dataInicio = new Date();
      projeto.horaInicio = this.formatarHora(projeto.dataInicio);
      projeto.mostrarTarefas = false;
      projeto.percentualConclusao = 0;
      this.inicializarTarefas(projeto);
      this.projetos.push(projeto);
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      throw error;
    } finally {
      this.atualizarPercentualConclusao();
    }
  }

  private formatarHora(data: Date): string {
    const horas = ('0' + data.getHours()).slice(-2);
    const minutos = ('0' + data.getMinutes()).slice(-2);
    return `${horas}:${minutos}`;
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
      this.calcularPercentualConclusaoProjeto(projeto);
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
  }

  obterProjetos(): Promise<Projeto[]> {
    return Promise.resolve(this.projetos);
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
        this.salvarProjetosNoLocalStorage();
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
        this.salvarProjetosNoLocalStorage();
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

  private salvarProjetosNoLocalStorage(): void {
    localStorage.setItem(this.PROJETOS_KEY, JSON.stringify(this.projetos));
  }

  async marcarTarefaComoConcluida(projeto: Projeto, tarefa: Tarefa): Promise<void> {
    try {
      tarefa.concluida = true;
      await this.atualizarTarefa(projeto, tarefa);
      this.calcularPercentualConclusaoProjeto(projeto);
    } catch (error) {
      console.error('Erro ao marcar tarefa como concluída:', error);
      throw error;
    }
  }
  
  async desmarcarTarefaComoConcluida(projeto: Projeto, tarefa: Tarefa): Promise<void> {
    try {
      tarefa.concluida = false;
      await this.atualizarTarefa(projeto, tarefa);
      this.calcularPercentualConclusaoProjeto(projeto);
    } catch (error) {
      console.error('Erro ao desmarcar tarefa como concluída:', error);
      throw error;
    }
  }

  

  async atualizarTarefa(projeto: Projeto, tarefa: Tarefa): Promise<void> {
    try {
      const projetoIndex = this.projetos.findIndex(p => p.id === projeto.id);
      if (projetoIndex !== -1) {
        const tarefaIndex = this.projetos[projetoIndex].tarefas.findIndex(t => t.id === tarefa.id);
        if (tarefaIndex !== -1) {
          this.projetos[projetoIndex].tarefas[tarefaIndex] = tarefa;
          await this.atualizarLocalStorage();
          this.atualizarPercentualConclusao();
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    } finally {
      this.atualizarPercentualConclusao();
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
