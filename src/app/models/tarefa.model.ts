import { AtividadeComponent } from "../atividade/atividade.component";
import { Atividade} from "./atividade.modelo";

export interface Tarefa {
  id: number;
  nome: string;
  descricao: string;
  projetoId: number;
  concluida: boolean;
  peso: number;
  atividades: Atividade[]; // Lista de atividades
  }
  