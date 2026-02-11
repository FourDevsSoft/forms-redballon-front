import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlertComponent } from '../../shared/components/alert/alert.component';
import { ConfirmPopUpComponent } from '../../shared/components/confirm-pop-up/confirm-pop-up.component';

import { AlertService } from '../../core/services/alerService/alert.service';
import { AlunoService } from '../../core/services/ApiAluno/ApiAluno.service';
import { TurmaService } from '../../core/services/ApiTurma/ApiTurmas.service';
import { GlobalService } from '../../core/services/global.service';

declare var grecaptcha: any;

interface Responsavel {
  nome: string;
  cpf: string;
  telefone: string;
  relacao: string;
  expandido: boolean;
  foto?: File | null;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AlertComponent,
    ConfirmPopUpComponent
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements AfterViewInit {

  siteKey = '';
  endForm = false;
  turmas: any[] = [];

  constructor(
    private alertService: AlertService,
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private globalService: GlobalService
  ) {
    this.siteKey = this.globalService.siteKey;
  }

  /* ==============================
      CICLO DE VIDA
  ============================== */

  ngAfterViewInit(): void {
    this.loadRecaptcha();
  }

  loadRecaptcha(): void {
    const scriptId = 'recaptcha-v3-script';

    if (document.getElementById(scriptId)) {
      this.carregarTurmas();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => this.carregarTurmas();
    document.body.appendChild(script);
  }

  /* ==============================
      DADOS DO ALUNO
  ============================== */

  nomeAluno = '';
  idTurma: number | null = null;
  observacoes = '';
  isFreePass = false;
  isTemporario = false;

  fotoAluno: File | null = null;
  fotoAlunoUrl: string | null = null;

  alunoSelecionado: any = null;
  alunosEncontrados: any[] = [];

  popupIrmaoVisivel = false;

  /* ==============================
      AUTOCOMPLETE ALUNO
  ============================== */

  onNomeAlunoChange(valor: string): void {
    this.nomeAluno = valor;
    this.alunoSelecionado = null;
    this.fotoAlunoUrl = null;

    if (valor.length < 3) {
      this.alunosEncontrados = [];
      return;
    }

    this.alunoService.buscarPorNome(valor).subscribe({
      next: resp => {
        this.alunosEncontrados = resp?.conteudoJson?.studentsComFoto || [];
      },
      error: () => this.alunosEncontrados = []
    });
  }

  selecionarAluno(aluno: any): void {
    this.alunoService.getAlunoForm(aluno.id).subscribe({
      next: resp => {
        const a = resp.conteudoJson;
        this.alunoSelecionado = a;
        this.nomeAluno = a.nome;
        this.idTurma = a.turma_id;
        this.fotoAlunoUrl = a.foto;
        this.alunosEncontrados = [];
      }
    });
  }
  cancelarRemocao(): void {
    this.fecharPopup();
  }
  
  /* ==============================
      RESPONSÁVEIS
  ============================== */

  responsaveis: Responsavel[] = [
    { nome: '', cpf: '', telefone: '', relacao: '', expandido: true, foto: null }
  ];

  popupVisivel = false;
  popupMensagem = '';
  indiceParaRemover: number | null = null;

  adicionarResponsavel(): void {
    const ultimo = this.responsaveis[this.responsaveis.length - 1];

    if (!ultimo.nome || !ultimo.cpf || !ultimo.relacao || !ultimo.foto) {
      this.alertService.exibir(
        'error',
        'Preencha todos os campos do responsável antes de adicionar outro.',
        7000
      );
      return;
    }

    this.responsaveis.forEach(r => r.expandido = false);

    this.responsaveis.push({
      nome: '',
      cpf: '',
      telefone: '',
      relacao: '',
      expandido: true,
      foto: null
    });
  }

  removerResponsavel(index: number): void {
    this.popupMensagem = `Deseja remover o responsável #${index + 1}?`;
    this.indiceParaRemover = index;
    this.popupVisivel = true;
  }

  confirmarRemocao(): void {
    if (this.indiceParaRemover === null) return;

    if (this.responsaveis.length === 1) {
      this.alertService.exibir('error', 'É obrigatório ao menos um responsável.');
    } else {
      this.responsaveis.splice(this.indiceParaRemover, 1);
      this.alertService.exibir('success', 'Responsável removido.');
    }

    this.fecharPopup();
  }

  fecharPopup(): void {
    this.popupVisivel = false;
    this.indiceParaRemover = null;
  }

  toggleResponsavel(index: number): void {
    this.responsaveis[index].expandido = !this.responsaveis[index].expandido;
  }

  /* ==============================
      FORMATAÇÕES
  ============================== */

  formatarCPF(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    value = value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.responsaveis[index].cpf = value;
    input.value = value;
  }

  formatarTelefone(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    value = value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);

    this.responsaveis[index].telefone = value;
    input.value = value;
  }

  /* ==============================
      UPLOADS
  ============================== */

  onFotoAlunoSelecionada(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.fotoAluno = file;
      this.fotoAlunoUrl = null;
    }
  }

  onFotoResponsavelSelecionada(event: any, index: number): void {
    const file = event.target.files?.[0];
    if (file) this.responsaveis[index].foto = file;
  }

  getPreviewUrl(file: File | null): string | null {
    return file ? URL.createObjectURL(file) : null;
  }

  /* ==============================
      ENVIO
  ============================== */

  enviarFormulario(): void {
    if (!this.nomeAluno || !this.idTurma || (!this.fotoAluno && !this.fotoAlunoUrl)) {
      this.alertService.exibir(
        'error',
        'Preencha nome, turma e foto do aluno.',
        7000
      );
      return;
    }

    if (this.responsaveis.some(r => !r.foto)) {
      this.alertService.exibir('error', 'Todos os responsáveis precisam de foto.', 7000);
      return;
    }

    const aluno = {
      id: this.alunoSelecionado?.id ?? null,
      nome: this.nomeAluno,
      id_turma: this.idTurma,
      observacoes: this.observacoes || null,
      is_freepass: this.isFreePass,
      is_temporario: this.isTemporario,
      responsaveis: this.responsaveis.map(r => ({
        nome: r.nome,
        tipoVinculo: r.relacao,
        numero: r.telefone?.replace(/\D/g, '') || null,
        cpf: r.cpf.replace(/\D/g, '') || null
      }))
    };

    grecaptcha.ready(() => {
      grecaptcha.execute(this.siteKey, { action: 'cadastrar_aluno' }).then((token: string) => {
        const formData = new FormData();
        formData.append('aluno', JSON.stringify(aluno));
        formData.append('recaptchaToken', token);

        if (this.fotoAluno) {
          formData.append('aluno_foto', this.fotoAluno);
        }

        this.responsaveis.forEach((r, i) => {
          if (r.foto) {
            formData.append(`responsavel_${i}_foto`, r.foto);
          }
        });

        this.alunoService.enviarFormularioAluno(formData).subscribe({
          next: () => {
            this.alertService.exibir('success', 'Aluno cadastrado com sucesso!');
            this.popupIrmaoVisivel = true;
          },
          error: err => {
            this.alertService.exibir(
              'error',
              err?.error?.message || 'Erro ao cadastrar aluno.'
            );
          }
        });
      });
    });
  }

  carregarTurmas(): void {
    grecaptcha.ready(() => {
      grecaptcha.execute(this.siteKey, { action: 'listar_turmas' }).then((token: string) => {
        this.turmaService.listagemPublica(1, 150, token).subscribe({
          next: resp => this.turmas = resp.data,
          error: () =>
            this.alertService.exibir('error', 'Erro ao carregar turmas.', 7000)
        });
      });
    });
  }

  confirmarCadastroIrmao(): void {
    this.nomeAluno = '';
    this.fotoAluno = null;
    this.fotoAlunoUrl = null;
    this.observacoes = '';
    this.isFreePass = false;
    this.isTemporario = false;
    this.popupIrmaoVisivel = false;
  }

  cancelarCadastroIrmao(): void {
    this.popupIrmaoVisivel = false;
    this.endForm = true;
  }
}
