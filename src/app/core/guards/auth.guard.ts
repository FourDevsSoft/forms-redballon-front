import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
//import { functionUser } from '../../utils/functionUser';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    // const userRole = await functionUser();
    // const isAuthenticated = localStorage.getItem('isAuthentication');
    // const loginTimeStr = localStorage.getItem('loginTime');
    // const maxSessionTime = 12 * 60 * 60 * 1000; // 12h em ms

    // // Se não autenticado ou sem horário salvo, redireciona
    // if (!isAuthenticated || !loginTimeStr) {
    //   this.router.navigate(['/login']);
    //   return false;
    // }

    // const loginTime = parseInt(loginTimeStr, 10);
    // const now = new Date().getTime();

    // // Sessão expirada
    // if (now - loginTime > maxSessionTime) {
    //   localStorage.clear(); // limpa tudo
    //   this.router.navigate(['/login']);
    //   return false;
    // }

    // // Secretaria e Diretoria acessam tudo
    // if (userRole === 'secretaria' || userRole === 'diretoria') {
    //   return true;
    // }

    // const path = route.routeConfig?.path;

    // // Mapa de acesso por função
    // const roleAccessMap: { [key: string]: string[] } = {
    //   'auxiliar': ['auxiliar', 'coordenacao'], // auxiliar acessa também coordenador
    //   'coordenador': ['coordenacao', 'professor'], // coordenador acessa também professor
    //   'professor': ['professor'],
    // };

    // // Se for alguma das funções restritas, verifica se pode acessar essa rota
    // if (userRole && roleAccessMap[userRole]) {
    //   const allowedRoutes = roleAccessMap[userRole];
    //   if (!allowedRoutes.includes(path!)) {
    //     this.router.navigate(['/erro', '403']); // ou crie uma página /unauthorized
    //     return false;
    //   }
    // }

    return true;
  }
}
