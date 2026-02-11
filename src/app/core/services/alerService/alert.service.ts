import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private tipoSubject = new BehaviorSubject<'success' | 'error' | 'info' | 'warning'>('success');
  private mensagemSubject = new BehaviorSubject<string>('');
  private visivelSubject = new BehaviorSubject<boolean>(false);
  private duracao: number | null = null;

  tipo$ = this.tipoSubject.asObservable();
  mensagem$ = this.mensagemSubject.asObservable();
  visivel$ = this.visivelSubject.asObservable();

  exibir(tipo: 'success' | 'error' | 'info' | 'warning', mensagem: string, duration: number | null = 3000) {
    this.tipoSubject.next(tipo);
    this.mensagemSubject.next(mensagem);
    this.visivelSubject.next(true);
    this.duracao = duration;

    if (this.duracao) {
      setTimeout(() => this.fechar(), this.duracao);
    }
  }

  fechar() {
    this.visivelSubject.next(false);
  }
}
