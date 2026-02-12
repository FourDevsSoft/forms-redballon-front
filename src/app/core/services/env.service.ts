import { Injectable } from '@angular/core';

export interface EnvConfig {
  apiUrl: string;
  apiUrlForms: string;
  siteKey: string;
  secretKey: string;
  logoUrl: string;
  environment?: string;
  [key: string]: any; // Para cores adicionais cor1-cor48
}

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  private config: EnvConfig = {
    apiUrl: 'http://localhost:4500',
    apiUrlForms: '',
    siteKey: '6LdLG4grAAAAAAoH5jvawTvnd4sVSNK3ZSOIsBaL',
    secretKey: '',
    logoUrl: ''
  };

  private configLoaded = false;

  constructor() {
    this.loadConfig();
  }

  private async loadConfig(): Promise<void> {
    try {
      console.log('🔄 EnvService: Iniciando carregamento de configurações...');
      
      // Primeiro: usar config pré-carregado em window.__config (carregado em main.ts)
      let configData: EnvConfig | undefined = (window as any).__config as EnvConfig | undefined;
      if (!configData) {
        console.log('⚠️ EnvService: window.__config não encontrado, buscando /config.json...');
        // Fallback: buscar via fetch
        const resp = await fetch('/config.json', { cache: 'no-cache' });
        if (!resp.ok) {
          throw new Error(`Falha ao buscar config.json: ${resp.status}`);
        }
        configData = await resp.json() as EnvConfig;
        console.log('✅ EnvService: config.json carregado via fetch');
      } else {
        console.log('✅ EnvService: Usando window.__config');
      }

      console.log('📋 EnvService: Dados recebidos:', {
        apiUrl: configData.apiUrl,
        apiUrlForms: configData.apiUrlForms,
        environment: configData.environment
      });

      // Merge com valores padrão, sem sobrescrever
      this.config = {
        apiUrl: configData.apiUrl || this.config.apiUrl,
        apiUrlForms: configData.apiUrlForms || this.config.apiUrlForms,
        siteKey: configData.siteKey || this.config.siteKey,
        secretKey: configData.secretKey || this.config.secretKey,
        logoUrl: configData.logoUrl || 'Logo - RedBalloon.webp',
        environment: configData.environment || 'production'
      };

      console.log('✅ EnvService: Configuração final carregada:', {
        apiUrl: this.config.apiUrl,
        apiUrlForms: this.config.apiUrlForms,
        environment: this.config.environment
      });

      // Adicionar todas as cores adicionais (cor1-cor48)
      for (let i = 1; i <= 48; i++) {
        const key = `cor${i}`;
        if (configData[key]) {
          this.config[key] = configData[key];
        }
      }

      this.configLoaded = true;
    } catch (error) {
      this.configLoaded = true;
      console.warn('⚠️ Erro ao carregar config.json', error);
    }
  }

  // Aguardar até que a config seja carregada
  async waitForConfig(): Promise<void> {
    let attempts = 0;
    while (!this.configLoaded && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get apiUrlForms(): string {
    return this.config.apiUrlForms;
  }

  get siteKey(): string {
    return this.config.siteKey;
  }

  get secretKey(): string {
    return this.config.secretKey;
  }

  get logoUrl(): string {
    return this.config.logoUrl;
  }

  get environment(): string {
    return this.config.environment || 'production';
  }

  // Acessar cor por número (cor1-cor48)
  getColor(colorNumber: number): string {
    const key = `cor${colorNumber}`;
    return this.config[key] || '#000000';
  }

  getConfig(): EnvConfig {
    return { ...this.config };
  }
}
