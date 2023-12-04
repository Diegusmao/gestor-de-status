import { Injectable } from '@angular/core';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';
import { BehaviorSubject, Observable } from 'rxjs';

import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ProjetoTarefaService {
  private ultimoIdTarefa: number = 0;
  private readonly PROJETOS_KEY = 'projetos';

  private projetosSubject: BehaviorSubject<Projeto[]> = new BehaviorSubject<
    Projeto[]
  >([]);

  projetosObservable: Observable<Projeto[]> =
    this.projetosSubject.asObservable();

  private percentualConclusaoSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  percentualConclusaoObservable: Observable<number> =
    this.percentualConclusaoSubject.asObservable();

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const projetosDB = await this.obterProjetosDB();
      this.projetos = projetosDB || [];
    } catch (error) {
      console.error('Erro ao inicializar:', error);
    }
  }

  private inicializarTarefas(projeto: Projeto): void {
    projeto.tarefas.forEach((tarefa) => {
      if (tarefa.concluida === undefined) {
        tarefa.concluida = false;
      }
    });
  }

  private set projetos(value: Projeto[]) {
    this.projetosSubject.next(value ? value : []);
    this.salvarProjetosNoLocalStorage();
  }

  get projetos(): Projeto[] {
    return this.projetosSubject.getValue();
  }

  private async refreshProjetos(id: number | null = null): Promise<void> {
    if (id) {
      const projetoById = await this.obterProjetoByIdDB(id);
      const projetoExistente = this.projetos.find(
        (projeto) => projeto.id === id
      );

      if (projetoExistente) {
        this.projetos = this.projetos.map((projeto) =>
          projeto.id === id ? projetoById : projeto
        );
      } else {
        this.projetos = [...this.projetos, projetoById];
      }
    } else {
      this.projetos = await this.obterProjetosDB();
    }
  }

  private async calcularPercentualConclusaoProjeto(
    projetoId: number
  ): Promise<void> {
    const projeto = await this.obterProjetoByIdDB(projetoId);

    const totalTarefas = projeto.tarefas.length;

    const tarefasConcluidas = projeto.tarefas.filter(
      (tarefa) => tarefa.concluida
    ).length;

    const percentualConclusao =
      totalTarefas > 0 ? (tarefasConcluidas / totalTarefas) * 100 : 0;

    projeto.percentualConclusao = percentualConclusao;

    await this.atualizarProjetoDB(projeto);
  }

  private async adicionarProjetoDB(projeto: Projeto): Promise<Projeto> {
    const apiUrl = 'http://localhost:3000/projetos';

    const headers = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(apiUrl, projeto, headers);

      return response.data;
    } catch (error) {
      console.error('Erro na requisição POST:', error);
      throw error;
    }
  }

  async adicionarProjeto(projeto: Projeto): Promise<void> {
    try {
      this.inicializarTarefas(projeto);

      const response: Projeto = await this.adicionarProjetoDB(projeto);

      await this.refreshProjetos(response.id);
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      throw error;
    }
  }

  private formatarHora(data: Date): string {
    const horas = ('0' + data.getHours()).slice(-2);
    const minutos = ('0' + data.getMinutes()).slice(-2);
    return `${horas}:${minutos}`;
  }

  private async adicionarTarefaDB(tarefa: Tarefa): Promise<Tarefa> {
    const apiUrl = `http://localhost:3000/tarefas`;

    const headers = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(apiUrl, tarefa, headers);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição POST:', error);
      throw error;
    }
  }

  async adicionarTarefa(projeto: Projeto, nomeTarefa: string): Promise<void> {
    if (projeto === null || projeto.id === null) {
      throw new Error('adicionarTarefa recebeu o código do projeto null');
    }

    try {
      const novaTarefa = {
        id: null,
        nome: nomeTarefa,
        descricao: 'Descrição da Tarefa',
        projetoId: projeto.id,
        concluida: false,
        peso: 1,
        atividades: [],
      };

      // DB
      const result = await this.adicionarTarefaDB(novaTarefa);

      await this.calcularPercentualConclusaoProjeto(projeto.id);

      await this.refreshProjetos(result.projetoId);
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
      return this.projetos.find((projeto) => projeto.id === projetoId);
    } catch (error) {
      console.error('Erro ao obter projeto por ID:', error);
      throw error;
    }
  }

  async atualizarProjeto(projeto: Projeto): Promise<void> {
    try {
      const index = this.projetos.findIndex((p) => p.id === projeto.id);
      if (index !== -1) {
        this.projetos[index] = projeto;
        this.salvarProjetosNoLocalStorage();
      }
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  }

  private async removerProjetoDB(idProjeto: number | null): Promise<void> {
    const apiUrl = `http://localhost:3000/projetos/${idProjeto}`;

    const headers = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      await axios.delete(apiUrl, headers);
      this.refreshProjetos();
    } catch (error) {
      console.error('Erro na requisição DELETE:', error);
      throw error;
    }
  }

  async removerProjeto(projeto: Projeto): Promise<void> {
    try {
      const index = this.projetos.indexOf(projeto);
      if (index !== -1) {
        // Local Storage
        this.projetos.splice(index, 1);
        await this.atualizarLocalStorage();

        // DB
        await this.removerProjetoDB(projeto.id);

        await this.refreshProjetos();
      }
    } catch (error) {
      console.error('Erro ao remover projeto:', error);
      throw error;
    }
  }

  async obterTarefaPorId(
    projetoId: number,
    tarefaId: number
  ): Promise<Tarefa | undefined> {
    try {
      const projeto = await this.obterProjetoPorId(projetoId);
      if (projeto) {
        return projeto.tarefas.find((tarefa) => tarefa.id === tarefaId);
      }
      return undefined;
    } catch (error) {
      console.error('Erro ao obter tarefa por ID:', error);
      throw error;
    }
  }

  async removerTarefa(
    projetoId: number | null,
    tarefaId: number | null
  ): Promise<void> {
    try {
      if (tarefaId === null) {
        throw new Error('Remover Tarefa recebeu tarefaId = null');
      }

      if (projetoId === null) {
        throw new Error('Remover Tarefa recebeu projetoId = null');
      }

      //DB
      await this.removerTarefaDB(tarefaId);

      await this.calcularPercentualConclusaoProjeto(projetoId);

      this.refreshProjetos(projetoId);
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      throw error;
    }
  }

  private async removerTarefaDB(idTarefa: number): Promise<void> {
    const apiUrl = `http://localhost:3000/tarefas/${idTarefa}`;

    const headers = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      await axios.delete(apiUrl, headers);
      this.refreshProjetos();
    } catch (error) {
      console.error('Erro na requisição DELETE:', error);
      throw error;
    }
  }

  private async obterProjetosDB(): Promise<Projeto[]> {
    const apiUrl = 'http://localhost:3000/projetos?_embed=tarefas';

    try {
      const response = await axios.get(apiUrl);
      return response.data || [];
    } catch (error) {
      console.error('Erro na requisição GET:', error);
      throw error;
    }
  }

  private async obterProjetoByIdDB(id: number | null): Promise<Projeto> {
    if (!id) {
      throw new Error('Id enviado para obterProjetoByIdDB está null');
    }

    const apiUrl = `http://localhost:3000/projetos/${id}?_embed=tarefas`;

    try {
      const response = await axios.get(apiUrl);
      return response.data || [];
    } catch (error) {
      console.error('Erro na requisição GET:', error);
      throw error;
    }
  }

  private salvarProjetosNoLocalStorage(): void {
    localStorage.setItem(this.PROJETOS_KEY, JSON.stringify(this.projetos));
  }

  async marcarTarefaComoConcluida(
    projeto: Projeto,
    tarefa: Tarefa
  ): Promise<void> {
    if (projeto == null || projeto.id == null) {
      throw new Error(
        'marcarTarefaComoConcluida reccebeu projeto ou projeto.id null'
      );
    }

    try {
      tarefa.concluida = true;

      await this.atualizarTarefaDB(tarefa);
      await this.calcularPercentualConclusaoProjeto(projeto.id);

      this.refreshProjetos(projeto.id);
    } catch (error) {
      console.error('Erro ao marcar tarefa como concluída:', error);
      throw error;
    }
  }

  async desmarcarTarefaComoConcluida(
    projeto: Projeto,
    tarefa: Tarefa
  ): Promise<void> {
    if (projeto == null || projeto.id == null) {
      throw new Error(
        'marcarTarefaComoConcluida reccebeu projeto ou projeto.id null'
      );
    }

    try {
      tarefa.concluida = false;

      await this.atualizarTarefaDB(tarefa);
      await this.calcularPercentualConclusaoProjeto(projeto.id);

      this.refreshProjetos(projeto.id);
    } catch (error) {
      console.error('Erro ao marcar tarefa como concluída:', error);
      throw error;
    }
  }

  async atualizarTarefaDB(tarefa: Tarefa): Promise<Tarefa> {
    try {
      const apiUrl = `http://localhost:3000/tarefas/${tarefa.id}`;

      const headers = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.put(apiUrl, tarefa, headers);
      return response.data || [];
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    } finally {
      // this.atualizarPercentualConclusao();
    }
  }

  async atualizarProjetoDB(projeto: Projeto): Promise<Projeto> {
    try {
      const apiUrl = `http://localhost:3000/projetos/${projeto.id}`;

      const headers = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.put(apiUrl, projeto, headers);
      return response.data || [];
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
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
