
import { Component, OnInit } from '@angular/core';
import { FormService } from '../../core/services/form/form.service';
import { EnvService } from '../../core/services/env.service';
import { GlobalService } from '../../core/services/global.service';
declare var grecaptcha: any;

@Component({
  selector: 'app-form',
  imports: [],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {

  siteKey: string = '';
  recaptchaToken: string = '';

  constructor(
    private globalService: GlobalService,
    private formService: FormService,
    private envService: EnvService,
  ) {
    this.siteKey = this.globalService.siteKey;
  }

  ngOnInit(): void {
    // Não chamar teste() aqui - aguardar reCAPTCHA carregar
  }

  async ngAfterViewInit() {
    // Aguardar que o EnvService carregue o config.json
    await this.envService.waitForConfig();
    
    // Após carregar, atualizar o siteKey se ainda estiver vazio
    if (!this.siteKey) {
      this.siteKey = this.envService.siteKey;
      console.log('[LOGIN] SiteKey atualizado após config:', this.siteKey ? '✓ OK' : '✗ VAZIO');
    }
    
    // Carregar reCAPTCHA e aguardar estar pronto antes de chamar teste()
    await this.loadRecaptcha();
    this.teste();
  }

  teste() {
    console.log(this.siteKey + "ss");
    // Mock dos dados
    const params = {
      nome: 'João da Silva',
      cpf: '121.169.834-36',
      recaptchaToken: this.siteKey
    };
    
    // Verificar se grecaptcha está disponível
    if (typeof grecaptcha === 'undefined') {
      console.error('[RECAPTCHA] grecaptcha ainda não está disponível');
      return;
    }
    
    grecaptcha.ready(() => {
      grecaptcha.execute(this.siteKey, { action: 'login' }).then((token: string) => {
        console.log(token)
        params.recaptchaToken = token;
        this.formService.checkPrincipal(params).subscribe({
          next: (res) => {
            console.log('Resposta checkPrincipal:', res);
          },
          error: (err) => {
            console.error('Erro checkPrincipal:', err);
          }
        });
      });
    });
  }

   loadRecaptcha(): Promise<void> {
    return new Promise((resolve) => {
      const scriptId = 'recaptcha-v3-script';

      // Se já existe o script e grecaptcha está disponível
      if (document.getElementById(scriptId) && typeof grecaptcha !== 'undefined') {
        console.log('[RECAPTCHA] Script já carregado');
        resolve();
        return;
      }

      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('[RECAPTCHA] Script carregado com siteKey:', this.siteKey);
          // Aguardar grecaptcha estar pronto
          const checkRecaptcha = setInterval(() => {
            if (typeof grecaptcha !== 'undefined') {
              clearInterval(checkRecaptcha);
              resolve();
            }
          }, 100);
        };
        
        document.body.appendChild(script);
      } else {
        // Script existe mas grecaptcha ainda não está disponível
        const checkRecaptcha = setInterval(() => {
          if (typeof grecaptcha !== 'undefined') {
            clearInterval(checkRecaptcha);
            resolve();
          }
        }, 100);
      }
    });
  }
}


