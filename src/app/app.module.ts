import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProjetoComponent } from './projeto/projeto.component';
import { TarefaComponent } from './projeto/tarefa/tarefa.component';
import { AtividadeComponent } from './atividade/atividade.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BarraPesquisaComponent } from './barra-pesquisa/barra-pesquisa.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjetoComponent,
    TarefaComponent,
    AtividadeComponent,
    HeaderComponent,
    FooterComponent,
    BarraPesquisaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
