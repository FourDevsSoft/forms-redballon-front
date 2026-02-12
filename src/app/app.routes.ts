import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard'; 
import { FormComponent } from './pages/form/form.component';
import { TelaInicialComponent } from './pages/tela-inicial/tela-inicial.component';
import { NovoResponsavelComponent } from './pages/novo-responsavel/novo-responsavel.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  //{ path: 'login', component: LoginComponent },
  
  //DIRETOR ACESSA TUDO
  // Rotas protegidas pelo AuthGuard
  //{ path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },
   { path: 'edicao', component: NovoResponsavelComponent},
   { path: 'cadastro', component: FormComponent},
   {path: 'form', component: TelaInicialComponent},

  // Rota coringa para redirecionar caso o usuário tente acessar uma página inexistente
  { path: '**', redirectTo: 'form' }
];
