import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormService } from '../../core/services/form/form.service';
import { GlobalService } from '../../core/services/global.service';

declare var grecaptcha: any;

@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.css']
})
export class TelaInicialComponent {
  mostrarModal = false;
  //nome = '';
  cpf = '';
  carregando = false;
  mensagemErro = '';
  siteKey: string = '';

  constructor(private router: Router, private formService: FormService, private globalService: GlobalService,) {
    this.siteKey = this.globalService.siteKey;
  }

  get logoUrl(): string {
    return this.globalService.logoUrl;
  }

  async ngAfterViewInit() {
    // Aguardar que o EnvService carregue o config.json
    //await this.envService.waitForConfig();


    // Carregar reCAPTCHA e aguardar estar pronto antes de chamar teste()
    await this.loadRecaptcha();
  }

  irParaCadastroAluno() {
    this.router.navigate(['/form']);
  }

  irParaCadastroResponsavel() {
    this.mostrarModal = true;
    this.limparCampos();
  }

  limparCampos() {
   // this.nome = '';
    this.cpf = '';
    this.mensagemErro = '';
  }

  fecharModal() {
    this.mostrarModal = false;
    this.limparCampos();
  }

  formatarCPF(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    value = value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.cpf = value;
    input.value = value;
  }

  verificarPrincipal() {
    this.mensagemErro = '';

    // if (!this.nome || !this.cpf) {
    //   this.mensagemErro = 'Por favor, preencha todos os campos.';
    //   return;
    // }

    const cpfLimpo = this.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      this.mensagemErro = 'CPF inválido. Digite 11 dígitos.';
      return;
    }

    this.carregando = true;

    // Nota: recaptchaToken seria necessário em produção
    const params = {
      //nome: this.nome,
      cpf: cpfLimpo,
      recaptchaToken: '' // Adicionar integração com reCAPTCHA se necessário
    };
    grecaptcha.ready(() => {
      grecaptcha.execute(this.siteKey, { action: 'login' }).then((token: string) => {
        console.log(token)
        params.recaptchaToken = token;
        this.formService.checkPrincipal(params).subscribe({
          next: (response) => {
            this.carregando = false;
            console.log('Resposta checkPrincipal:', response);
            
            // Armazena a resposta no service
            this.formService.setCheckPrincipalData(response);
            
            // Sucesso: navega para a página de novo responsável
            this.router.navigate(['/novo-responsavel']);
          },
          error: (error) => {
            this.carregando = false;
            console.error('Erro ao verificar principal:', error);
            this.mensagemErro = error.error?.message || 'Erro ao verificar responsável principal.';
          }
        });
      });
    });
}

loadRecaptcha(): Promise < void> {
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
