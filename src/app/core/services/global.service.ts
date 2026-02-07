import { Injectable } from '@angular/core';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor(private envService: EnvService) {}

  get apiUrl(): string {
    return this.envService.apiUrl;
  }

  set apiUrl(value: string) {
    // O apiUrl vem do EnvService (dinâmico)
    console.warn('GlobalService.apiUrl é somente leitura, vem de EnvService');
  }

  get apiUrlForms(): string {
    return this.envService.apiUrlForms;
  }

  get siteKey(): string {
    return this.envService.siteKey;
  }

  set siteKey(value: string) {
    // O siteKey vem do EnvService (dinâmico)
    console.warn('GlobalService.siteKey é somente leitura, vem de EnvService');
  }
}
