import { Tarefa } from "./tarefa.model";

export interface Projeto {
    id: number;
    nome: string;
    nomeTarefa: string;
    tarefas: Tarefa[];
  }