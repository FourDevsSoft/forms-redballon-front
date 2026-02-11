// O que vem da API
export interface Horario {
    id: number;
    dia_semana_id: number;
    hora_abertura: string;
    hora_fechamento: string;
    professor_id: number;
    sala_id: number;
  }
  
  export interface Turma {
    id: number;
    nome: string;
    nome_turma?:string;
    created_at: string;
    updated_at: string;
    horarios: Horario[];
    total_solicitado:number;
  }
  
  export interface ApiResponseTurma {
    conteudoJson: {
      turmas: Turma[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: string;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    };
    success: boolean;
  }
  
  // DTOs para criação/edição (não têm `id`)
  export interface HorarioDTO {
    dia_semana_id: number;
    hora_abertura: string;
    hora_fechamento: string;
    professor_id: number;
    sala_id: number;
  }
  
  export interface TurmaDTO {
    nome: string;
    horarios: HorarioDTO[];
  }
  
  export interface TurmaPublica {
    id: number;
    nome: string;
  }
  
  export interface ApiResponseTurmaPublica {
    success: boolean;
    data: TurmaPublica[];
  }
  
  
  
  