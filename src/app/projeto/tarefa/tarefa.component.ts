import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Projeto } from 'src/app/models/projeto.model';
import { Tarefa } from 'src/app/models/tarefa.model';
import { ProjetoTarefaService } from './projeto-tarefa.service';

@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.component.html',
  styleUrls: ['./tarefa.component.css']
})
export class TarefaComponent {
  @ViewChild('tarefaNome') tarefaNome: any;
  projeto: Projeto = {} as Projeto;
  tarefa: Tarefa = {} as Tarefa;
  projetoId: number = 0;
  tarefaId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private projetoTarefaService: ProjetoTarefaService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projetoId = +params['idProjeto'];
      this.tarefaId = +params['idTarefa'];

      this.projeto = this.projetoTarefaService.obterProjetoPorId(this.projetoId) || {} as Projeto;

      if (this.projeto.id) {
        this.tarefa = this.projetoTarefaService.obterTarefaPorId(this.projetoId, this.tarefaId) || {} as Tarefa;
      }
    });
  }

  voltar(): void {
    this.location.back();
  }
}
