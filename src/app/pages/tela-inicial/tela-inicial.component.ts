import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.css']
})
export class TelaInicialComponent {

  constructor(private router: Router) {}
  irParaCadastroAluno() {
    this.router.navigate(['/form']);
  }

  irParaCadastroResponsavel() {
    this.router.navigate(['/novo-responsavel']);
    // futuramente: this.router.navigate(['/responsavel']);
  }
}
