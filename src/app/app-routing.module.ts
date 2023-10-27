import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjetoComponent } from './projeto/projeto.component';
import { LoginComponent } from './login/login.component';
import { TarefaComponent } from './tarefa/tarefa.component';
import { AtividadeComponent } from './atividade/atividade.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'projetos', component: ProjetoComponent},
  { path: 'tarefas', component: TarefaComponent},
  { path: 'atividade', component: AtividadeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
