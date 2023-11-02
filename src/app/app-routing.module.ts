import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjetoComponent } from './projeto/projeto.component';
import { LoginComponent } from './login/login.component';
import { TarefaComponent } from './projeto/tarefa/tarefa.component';
import { AtividadeComponent } from './atividade/atividade.component';
import { ListaTarefasComponent } from './projeto/tarefa/lista-tarefas/lista-tarefas.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path:"", redirectTo: "login", pathMatch: "full" },
  { path: 'projetos', component: ProjetoComponent},
  { path: 'projeto/:idProjeto/tarefa/:idTarefa', component: TarefaComponent},
  { path: 'atividade', component: AtividadeComponent},
  { path: 'projeto/:id/tarefas', component: ListaTarefasComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
