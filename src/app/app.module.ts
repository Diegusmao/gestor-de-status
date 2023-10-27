import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProjetoComponent } from './projeto/projeto.component';
import { TarefaComponent } from './tarefa/tarefa.component';
import { AtividadeComponent } from './atividade/atividade.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjetoComponent,
    TarefaComponent,
    AtividadeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
