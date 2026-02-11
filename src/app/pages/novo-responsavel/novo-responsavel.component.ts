import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlunoService } from '../../core/services/ApiAluno/ApiAluno.service';

@Component({
  selector: 'app-novo-responsavel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './novo-responsavel.component.html',
  styleUrl: './novo-responsavel.component.css',
})
export class NovoResponsavelComponent {

  constructor(private alunoService: AlunoService) {}

  previewFotoResponsavel: string | null = null;

  nomeAluno: string = '';
  alunosEncontrados: any[] = [];
  alunoSelecionado: any = null;

  onNomeAlunoChange(valor: string) {
    this.nomeAluno = valor;
  
    if (valor.length < 3) {
      this.alunosEncontrados = [];
      return;
    }
  
    this.alunoService.buscarPorNome(valor).subscribe({
      next: (resp) => {
        this.alunosEncontrados = resp?.conteudoJson?.studentsComFoto || [];
      },
      error: () => {
        this.alunosEncontrados = [];
      }
    });
  }
  

  selecionarAluno(aluno: any) {
    this.alunoSelecionado = aluno;
    this.nomeAluno = aluno.nome;
    this.alunosEncontrados = [];
  }

  /* =========================
     RESPONSÁVEL
  ========================= */

  responsavel = {
    nome: '',
    cpf: '',
    telefone: '',
    relacao: '',
    principal: false,
    foto: null as File | null
  };

  /* =========================
     FORMATAÇÕES
  ========================= */

  formatarCPF(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    value = value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.responsavel.cpf = value;
    input.value = value;
  }

  formatarTelefone(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    value = value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');

    this.responsavel.telefone = value.substring(0, 15);
    input.value = this.responsavel.telefone;
  }

  /* =========================
     UPLOAD
  ========================= */

  onFotoResponsavelSelecionada(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.responsavel.foto = file;
  
      // gera UMA vez
      this.previewFotoResponsavel = URL.createObjectURL(file);
    }
  }
  

  getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /* =========================
     SALVAR
  ========================= */

  salvarResponsavel() {
    if (!this.alunoSelecionado) {
      alert('Selecione um aluno');
      return;
    }

    if (!this.responsavel.nome || !this.responsavel.cpf || !this.responsavel.relacao) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    console.log('Aluno selecionado:', this.alunoSelecionado);
    console.log('Responsável:', this.responsavel);

    // 👉 próximo passo: montar FormData e enviar
  }
}
