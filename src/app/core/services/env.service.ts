import { Injectable } from '@angular/core';

export interface EnvConfig {
  apiUrl: string;
  apiUrlForms: string;
  siteKey: string;
  secretKey: string;
  logoUrl: string;
  faviconUrl?: string;
  backgroundImageUrl?: string;
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
    logoUrl: '',
    faviconUrl: '',
    backgroundImageUrl: 'https://img1.picmix.com/output/stamp/normal/5/9/6/8/648695_03eca.gif'
  };

  private configLoaded = false;

  constructor() {
    this.loadConfig();
  }

  private async loadConfig(): Promise<void> {
    try {
      // Primeiro: usar config pré-carregado em window.__config (carregado em main.ts)
      let configData: EnvConfig | undefined = (window as any).__config as EnvConfig | undefined;
      if (!configData) {
        // Fallback: buscar via fetch
        const resp = await fetch('/config.json', { cache: 'no-cache' });
        if (!resp.ok) {
          throw new Error(`Falha ao buscar config.json: ${resp.status}`);
        }
        configData = await resp.json() as EnvConfig;
      }

      // Merge com valores padrão, sem sobrescrever
      this.config = {
        apiUrl: configData.apiUrl || this.config.apiUrl,
        apiUrlForms: configData.apiUrlForms || this.config.apiUrlForms,
        siteKey: configData.siteKey || this.config.siteKey,
        secretKey: configData.secretKey || this.config.secretKey,
        logoUrl: configData.logoUrl || 'Logo - RedBalloon.webp',
        faviconUrl: configData.faviconUrl || configData.logoUrl || 'Logo - RedBalloon.webp',
        backgroundImageUrl: configData.backgroundImageUrl || this.config.backgroundImageUrl,
        environment: configData.environment || 'production'
      };

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
      // Erro ao carregar config.json - usa valores padrão
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

  get faviconUrl(): string {
    return this.config.faviconUrl || this.config.logoUrl;
  }

  get backgroundImageUrl(): string {
    return this.config.backgroundImageUrl || 'https://img1.picmix.com/output/stamp/normal/5/9/6/8/648695_03eca.gif';
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
