import { Aluno } from './aluno.model';

export interface Responsavel {
  id?: number;
  cpf?: string;
  nome: string;
  vinculo?: string;        
  numero?: string;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
  foto?: string;
  is_temporario?: boolean;
  data_inicio?: string | null;
  data_fim?: string | null;
  alunos?: Aluno[];
  id_responsavel?: number;
  nome_responsavel?: string;
  tipo_vinculo?: string;
  verificado?: boolean;
}

export interface NovoResponsavel {
  nome: string;
  cpf: string;
  numero: string;
  tipoVinculo: string;
  foto?: File | null;
}

export interface CheckPrincipalResponse {
  success: boolean;
  message: string;
  data: {
    responsavel: {
      id: number;
      nome: string;
      cpf: string;
    };
    alunos: {
      id: number;
      nome: string;
      foto: string;
      id_turma: number;
      turma_nome: string;
    }[];
  };
}


export interface ApiResponsavelResponse {
  conteudoJson: {
    responsibles: Responsavel[];
    pagination: any;
  };
  success: boolean;
}
