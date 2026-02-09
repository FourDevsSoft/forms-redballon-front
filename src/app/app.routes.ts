import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard'; 
import { FormComponent } from './pages/form/form.component';
import { TelaInicialComponent } from './pages/tela-inicial/tela-inicial.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  //{ path: 'login', component: LoginComponent },
  
  //DIRETOR ACESSA TUDO
  // Rotas protegidas pelo AuthGuard
  //{ path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },

   { path: 'form', component: FormComponent},
   {path: 'tela-inicial', component: TelaInicialComponent},

  // Rota coringa para redirecionar caso o usuário tente acessar uma página inexistente
  { path: '**', redirectTo: 'tela-inicial' }
];
