import { PercentPipe } from "@angular/common";
import { Tarefa } from "./tarefa.model";

export interface Projeto {
    id: number;
    nome: string;
    nomeTarefa: string;
    dataInicio: Date;
    horaInicio: string;
    tarefas: Tarefa[];
    mostrarTarefas?: boolean;
    percentualConclusao: number;
  }