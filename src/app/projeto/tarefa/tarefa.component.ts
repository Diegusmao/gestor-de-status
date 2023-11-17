import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export class TarefaComponent implements OnInit {
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

  async ngOnInit(): Promise<void> {
    try {
      const params = await new Promise<{ idProjeto: string, idTarefa: string } | any>(resolve => {
        this.route.params.subscribe(params => resolve(params));
      });

      this.projetoId = +params.idProjeto;
      this.tarefaId = +params.idTarefa;

      this.projeto = await this.projetoTarefaService.obterProjetoPorId(this.projetoId) || {} as Projeto;

      if (this.projeto.id) {
        this.tarefa = await this.projetoTarefaService.obterTarefaPorId(this.projetoId, this.tarefaId) || {} as Tarefa;
      }
    } catch (error: any) {
      console.error('Erro ao inicializar tarefa:', error.message);
    }
  }

  voltar(): void {
    this.location.back();
  }
}
