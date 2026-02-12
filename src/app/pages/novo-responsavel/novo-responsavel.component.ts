import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlunoService } from '../../core/services/ApiAluno/ApiAluno.service';
import { TurmaService } from '../../core/services/ApiTurma/ApiTurmas.service';
import { FormService } from '../../core/services/form/form.service';
import { GlobalService } from '../../core/services/global.service';
import { NovoResponsavel, CheckPrincipalResponse } from '../../shared/models/responsavel.model';
import { AlunoParaEnvio } from '../../shared/models/aluno.model';
import { AlertService } from '../../core/services/alerService/alert.service';

declare var grecaptcha: any;

interface AlunoComNovosResponsaveis {
  id: number;
  nome: string;
  foto: string;
  id_turma: number;
  turma_nome: string;
  novosResponsaveis: NovoResponsavel[];
  editando: boolean;
}

@Component({
  selector: 'app-novo-responsavel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './novo-responsavel.component.html',
  styleUrl: './novo-responsavel.component.css',
})
export class NovoResponsavelComponent implements OnInit, AfterViewInit {

  constructor(
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private formService: FormService,
    private router: Router,
    private alertService: AlertService,
    private globalService: GlobalService
  ) {}

  checkPrincipalData: CheckPrincipalResponse | null = null;
  alunos: AlunoComNovosResponsaveis[] = [];
  turmas: any[] = [];
  
  carregando = false;
  carregandoTurmas = false;
  mensagemErro = '';
  siteKey: string = '';
  endForm = false;

  ngOnInit(): void {
    this.siteKey = this.globalService.siteKey;
    
    // Obtém os dados do check-principal
    this.checkPrincipalData = this.formService.getCheckPrincipalData();
    
    if (!this.checkPrincipalData) {
      // Se não há dados, redireciona para a tela inicial
      this.router.navigate(['/']);
      return;
    }

    // Inicializa os alunos com um array vazio de novos responsáveis
    this.alunos = this.checkPrincipalData.data.alunos.map(aluno => ({
      ...aluno,
      novosResponsaveis: [],
      editando: false
    }));
  }

  async ngAfterViewInit() {
    await this.loadRecaptcha();
    this.carregarTurmas();
  }

  loadRecaptcha(): Promise<void> {
    return new Promise((resolve) => {
      const scriptId = 'recaptcha-v3-script';

      if (document.getElementById(scriptId) && typeof grecaptcha !== 'undefined') {
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
          const checkRecaptcha = setInterval(() => {
            if (typeof grecaptcha !== 'undefined') {
              clearInterval(checkRecaptcha);
              resolve();
            }
          }, 100);
        };

        document.body.appendChild(script);
      } else {
        const checkRecaptcha = setInterval(() => {
          if (typeof grecaptcha !== 'undefined') {
            clearInterval(checkRecaptcha);
            resolve();
          }
        }, 100);
      }
    });
  }

  carregarTurmas(): void {
    this.carregandoTurmas = true;

    grecaptcha.ready(() => {
      grecaptcha.execute(this.siteKey, { action: 'load_turmas' }).then((token: string) => {
        this.turmaService.listagemPublica(1, 1000, token).subscribe({
          next: (response) => {
            this.carregandoTurmas = false;
            this.turmas = response.data || [];
          },
          error: (error) => {
            this.carregandoTurmas = false;
            console.error('Erro ao carregar turmas:', error);
          }
        });
      });
    });
  }

  toggleEditarAluno(alunoIndex: number): void {
    this.alunos[alunoIndex].editando = !this.alunos[alunoIndex].editando;
  }

  atualizarTurmaAluno(alunoIndex: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const turmaId = parseInt(select.value);
    const turma = this.turmas.find(t => t.id === turmaId);
    
    if (turma) {
      this.alunos[alunoIndex].id_turma = turmaId;
      this.alunos[alunoIndex].turma_nome = turma.nome;
    }
  }

  // Formata string de CPF
  formatarCPFString(cpf: string): string {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
      return cpf; // Retorna original se inválido
    }

    return cpfLimpo
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  // Adiciona um responsável para um aluno específico
  adicionarResponsavel(alunoIndex: number): void {
    const aluno = this.alunos[alunoIndex];
    
    aluno.novosResponsaveis.push({
      nome: '',
      cpf: '',
      numero: '',
      tipoVinculo: '',
      foto: null
    });
  }

  // Remove um responsável de um aluno
  removerResponsavel(alunoIndex: number, responsavelIndex: number): void {
    this.alunos[alunoIndex].novosResponsaveis.splice(responsavelIndex, 1);
  }

  // Formata CPF
  formatarCPF(event: Event, alunoIndex: number, responsavelIndex: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    value = value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.alunos[alunoIndex].novosResponsaveis[responsavelIndex].cpf = value;
    input.value = value;
  }

  // Formata Telefone
  formatarTelefone(event: Event, alunoIndex: number, responsavelIndex: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    value = value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');

    const numeroFormatado = value.substring(0, 15);
    this.alunos[alunoIndex].novosResponsaveis[responsavelIndex].numero = numeroFormatado;
    input.value = numeroFormatado;
  }

  // Upload de foto do responsável
  onFotoResponsavelSelecionada(event: Event, alunoIndex: number, responsavelIndex: number): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.alunos[alunoIndex].novosResponsaveis[responsavelIndex].foto = file;
    }
  }

  // Remove foto do responsável
  removerFoto(alunoIndex: number, responsavelIndex: number): void {
    this.alunos[alunoIndex].novosResponsaveis[responsavelIndex].foto = null;
  }

  // Gera URL de preview para foto
  getPreviewUrl(file: File | null): string {
    if (!file) return '';
    return URL.createObjectURL(file);
  }

  // Valida se todos os campos obrigatórios estão preenchidos
  validarFormulario(): boolean {
    this.mensagemErro = '';

    // Valida cada responsável (se houver)
    for (const aluno of this.alunos) {
      for (const resp of aluno.novosResponsaveis) {
        if (!resp.nome || !resp.cpf || !resp.numero || !resp.tipoVinculo) {
          this.mensagemErro = `Preencha todos os campos obrigatórios para ${aluno.nome}.`;
          this.alertService.exibir(
            'error',
            `Preencha todos os campos obrigatórios para ${aluno.nome}.`,
            7000
          );
          return false;
        }

        const cpfLimpo = resp.cpf.replace(/\D/g, '');
        if (cpfLimpo.length !== 11) {
          this.mensagemErro = `CPF inválido para um responsável de ${aluno.nome}.`;
            this.alertService.exibir(
        'error',
        `CPF inválido para um responsável de ${aluno.nome}.`,
        7000
      );
          return false;
        }
      }
    }

    return true;
  }

  // Envia o formulário
  enviarFormulario(): void {
    if (!this.validarFormulario()) {
      return;
    }

    if (!this.checkPrincipalData) {
      this.mensagemErro = 'Dados do responsável principal não encontrados.';
      this.alertService.exibir(
        'error',
        'Dados do responsável principal não encontrados.',
        7000
      );
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    grecaptcha.ready(() => {
      grecaptcha.execute(this.siteKey, { action: 'submit' }).then((token: string) => {
        // Monta o FormData
        const formData = new FormData();

        // Formata o CPF do responsável principal
        const cpfPrincipal = this.formatarCPFString(this.checkPrincipalData!.data.responsavel.cpf);
        
        // Adiciona dados básicos
        formData.append('cpf', cpfPrincipal);
        formData.append('recaptchaToken', token);

        // Monta array de TODOS os alunos (com ou sem responsáveis)
        // O usuário pode ter editado apenas o nome ou turma do aluno
        const alunosParaEnvio = this.alunos.map((aluno, alunoIndex) => {
          // Adiciona fotos dos responsáveis ao FormData (se existirem)
          const novosResponsaveis = aluno.novosResponsaveis.map((resp, respIndex) => {
            if (resp.foto) {
              formData.append(`aluno_${alunoIndex}_responsavel_${respIndex}_foto`, resp.foto);
            }

            return {
              nome: resp.nome,
              cpf: resp.cpf,
              numero: resp.numero,
              tipoVinculo: resp.tipoVinculo
            };
          });

          return {
            id: aluno.id,
            nome: aluno.nome,
            id_turma: aluno.id_turma,
            novosResponsaveis
          };
        });

        // Adiciona array de alunos como JSON string
        formData.append('alunos', JSON.stringify(alunosParaEnvio));

        console.log('FormData montado:');
        console.log('cpf:', cpfPrincipal);
        console.log('recaptchaToken:', token);
        console.log('alunos:', alunosParaEnvio);

        this.formService.enviarNovosResponsaveis(formData).subscribe({
          next: (response) => {
            this.carregando = false;
            console.log('Resposta do servidor:', response);
            
            // Limpa os dados armazenados
            this.formService.clearCheckPrincipalData();
            
            // Exibe tela de sucesso
            this.endForm = true;
            
            // Rola a página para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Após 3 segundos, redireciona para a tela inicial
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 3000);
          },
          error: (error) => {
            this.carregando = false;
            console.error('Erro ao enviar:', error);
            this.mensagemErro = error.error?.message || 'Erro ao cadastrar responsáveis.';
            this.alertService.exibir(
              'error',
              this.mensagemErro,
              7000
            );
          }
        });
      });
    });
  }

  voltar(): void {
    this.formService.clearCheckPrincipalData();
    this.router.navigate(['/']);
  }
}
