
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

  constructor(private projetoTarefaService: ProjetoTarefaService) {}

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.listaProjetos = this.projetoTarefaService.obterProjetos();
  }

  adicionarProjeto(): void {
    if (!this.nomeProjeto.trim()) {
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
    this.setFocusNoInput();
  }

  adicionarTarefa(projeto: Projeto): void {
    if (!projeto.nomeTarefa.trim()) {
      return;
    }

    this.projetoTarefaService.adicionarTarefa(projeto, projeto.nomeTarefa);
    projeto.nomeTarefa = '';
  }

  removerProjeto(projeto: Projeto): void {
    this.projetoTarefaService.removerProjeto(projeto);
  }

  removerTarefa(projeto: Projeto, tarefa: Tarefa): void {
    this.projetoTarefaService.removerTarefa(projeto, tarefa);
  }

  setFocusNoInput(): void {
    this.projetoInput.nativeElement.focus();
  }
}
