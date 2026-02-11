export interface Notificacao {
    id_usuario?: number;
    id_solicitacao?: number;
    id_aluno?:number;
    mensagem?: string;
    created_at?:string
  }
  
  export interface ApiResponse {
    conteudoJson: Notificacao[]
    success: boolean;
  }