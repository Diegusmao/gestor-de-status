import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjetoTarefaService } from 'src/app/projeto/tarefa/projeto-tarefa.service';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';

@Component({
  selector: 'app-projeto',
  templateUrl: './projeto.component.html',
  styleUrls: ['./projeto.component.css']
})
export class ProjetoComponent implements OnInit {
  listaProjetos: Projeto[] = [];
  nomeProjeto: string = '';
  @ViewChild('projetoInput') projetoInput: any;

  constructor(private projetoTarefaService: ProjetoTarefaService) {}

  ngOnInit(): void {
    this.listaProjetos = this.projetoTarefaService.obterProjetos();
  }

  adicionarProjeto(): void {
    if (this.nomeProjeto.trim().length === 0) {
      return;
    }

    const novoProjeto: Projeto = {
      id: this.listaProjetos.length + 1,
      nome: this.nomeProjeto,
      nomeTarefa: '',
      tarefas: []
    };

    this.projetoTarefaService.adicionarProjeto(novoProjeto);
    this.nomeProjeto = '';
    this.projetoInput.nativeElement.focus(); 
  }

  adicionarTarefa(projeto: Projeto): void {
    if (projeto.nomeTarefa.trim().length === 0) {
      return;
    }

    const novaTarefa: Tarefa = {
      id: projeto.tarefas.length + 1,
      nome: projeto.nomeTarefa,
      descricao: 'Descrição da Tarefa',
      projetoId: projeto.id,
      concluida: false,
      peso: 1,
      atividades: []
    };

    projeto.tarefas.push(novaTarefa);
    projeto.nomeTarefa = '';
  }
}
