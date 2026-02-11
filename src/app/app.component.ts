import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreloaderComponent } from '../app/shared/components/preloader/preloader.component';
import { ApiNotificacaoService } from './core/services/ApiNotificacao/ApiNotificacao.service';
import { WebsocketService } from './core/services/websocket/websoket.service';
import { GlobalService } from './core/services/global.service';
import { Subscription } from 'rxjs';
import { Notificacao } from './shared/models/notificacao.model';
import { AlertService } from './core/services/alerService/alert.service';
import { AlertComponent } from './shared/components/alert/alert.component';
import { environment } from '../environments/environments';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PreloaderComponent, AlertComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-red-balloon';


  //ambiente dev ou prod
  showDevBanner = !environment.production;
  environmentLabel: string | null = null;

  private subscription?: Subscription;

  constructor(
    private alertService: AlertService,
    private notificacaoService: ApiNotificacaoService,
    private websocketService: WebsocketService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    const hostname = window.location.hostname;

    if (hostname === 'gracashomologacao.outredballoon.com.br' || hostname === 'bvhomologacao.outredballoon.com.br') {
      this.environmentLabel = 'HOMOLOGAÇÃO 🚨';
    } else if (!environment.production) {
      this.environmentLabel = 'DESENVOLVIMENTO';
    } else {
      this.environmentLabel = null; 
    }
  }
}
