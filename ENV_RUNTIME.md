# Como Usar Variáveis de Ambiente em Runtime

## 📋 Resumo do Problema

Anteriormente, as variáveis de ambiente do Angular eram carregadas apenas em **build time**, o que significava que alterar o `.env` e fazer deploy **não tinha efeito** sem recompilar o projeto.

## ✅ Solução Implementada

Agora o projeto carrega variáveis de ambiente **dinamicamente em runtime** através de:

1. **Script Node.js** (`scripts/generate-env.js`) que funciona como um servidor Express
2. **Rota dinâmica `/env.js`** que lê o `.env` e retorna as variáveis
3. **Serviço Angular** (`EnvService`) para consumir essas variáveis

## 🚀 Como Usar

### 1. Configurar o `.env` (na VPS com EasyPanel)

Adicione ou modifique as variáveis no arquivo `.env` na raiz do projeto:

```env
# URLs e APIs
API_URL=https://sua-api.com

# Cores (em formato hex ou rgb)
PRIMARY_COLOR=#FF6B6B
SECONDARY_COLOR=#4ECDC4
ACCENT_COLOR=#FFE66D

# Ambiente
ENVIRONMENT=production
PORT=8080
```

### 2. Build da Aplicação

```bash
npm run build
# ou para produção
npm run build:prod
```

### 3. Iniciar o Servidor

```bash
npm start
```

O servidor vai rodar na porta `8080` (ou a definida em `PORT` no `.env`)

### 4. Usar as Variáveis no Componente

#### Opção A: Injetar o `EnvService`

```typescript
import { Component, OnInit } from '@angular/core';
import { EnvService } from './core/services/env.service';

@Component({
  selector: 'app-example',
  template: `<div [style.color]="envService.primaryColor">Olá</div>`
})
export class ExampleComponent implements OnInit {
  constructor(public envService: EnvService) {}

  ngOnInit() {
    console.log('API URL:', this.envService.apiUrl);
    console.log('Cor Primária:', this.envService.primaryColor);
  }
}
```

#### Opção B: Acessar via CSS Variables

No seu `styles.css`:

```css
:root {
  --primary-color: #FF6B6B;
  --secondary-color: #4ECDC4;
  --accent-color: #FFE66D;
}

.button {
  background-color: var(--primary-color);
}

.header {
  border-color: var(--secondary-color);
}
```

As cores são aplicadas automaticamente no `app.component.ts` via `envService.applyThemeColors()`.

### 5. No EasyPanel

**Após fazer deploy:**
1. ✅ Editar o arquivo `.env` via painel
2. ✅ **NÃO precisa recompilar** (não precisa fazer commit)
3. ✅ **NÃO precisa fazer redeploy do código** (basta reiniciar o serviço ou o container)
4. ✅ As mudanças aparecem imediatamente

## 🔄 Fluxo Completo

```
[Cliente pede mudança de cor]
        ↓
[SSH na VPS → Editar .env]
        ↓
[Reiniciar o serviço Node]
        ↓
[✅ Cores atualizadas no app]
```

**Nenhum build, nenhum commit, nenhum deploy de código!**

## 📦 Instalação de Dependências

Se ainda não instalou o `express`:

```bash
npm install
```

## 🐛 Troubleshooting

### "env.js não está carregando"
- Verifique se o servidor está rodando: `npm start`
- Verifique se o `.env` existe na raiz do projeto
- Verifique o console (F12) do navegador para erros

### "Variáveis aparecem vazias"
- Verifique se as variáveis estão no `.env`
- Verifique se o arquivo é `env.js` (com ponto)
- Reinicie o servidor: `npm start`

### "Cores não estão sendo aplicadas"
- Verifique se `EnvService` está sendo injetado
- Verifique se `applyThemeColors()` foi chamado
- Verifique se os valores hex/rgb estão corretos

## 📝 Variáveis Disponíveis

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `API_URL` | URL da API backend | `''` |
| `LOGO_URL` | Logo exibida no site (PNG, WEBP, SVG) | `Logo - RedBalloon.webp` |
| `FAVICON_URL` | Ícone da aba (opcional, 32x32px) | Usa `LOGO_URL` |
| `SITE_KEY` | Chave do reCAPTCHA | `''` |
| `ENVIRONMENT` | production/development | `production` |
| `PORT` | Porta do servidor | `8080` |
| `COR_1` até `COR_50` | Cores do sistema (hex) | Veja `.env.example` |

### 🖼️ Logo e Favicon

**LOGO_URL**: Imagem grande para o cabeçalho do site
- Pode ser qualquer tamanho e formato (PNG, WEBP, SVG, etc.)
- Exemplo: `Logo - RedBalloon - letra branca.png`

**FAVICON_URL** (opcional): Ícone pequeno para a aba do navegador
- Recomendado: 32x32px ou 16x16px em .ico, .png ou .svg
- Se não definido, usa a `LOGO_URL` (pode não ficar ideal)
- Exemplo: `favicon.ico` ou `logo-icon-32x32.png`

**Importante**: Coloque os arquivos na pasta `public/` antes do build.

Sinta-se livre para adicionar mais variáveis conforme necessário!
