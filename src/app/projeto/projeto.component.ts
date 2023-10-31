import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projeto',
  templateUrl: './projeto.component.html',
  styleUrls: ['./projeto.component.css']
})
export class ProjetoComponent implements OnInit {

  listaProjetos : any[] = []

  constructor() {}

  ngOnInit(): void {
    this.listaProjetos = [
      {id:0, nome: 'projeto bvs', concluida: false},
      {id:1, nome: 'projeto serasa', concluida: false},
      {id:2, nome: 'projeto spc', concluida: false}
      
    ]
  }

}
