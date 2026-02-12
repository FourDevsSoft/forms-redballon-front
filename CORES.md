# 🎨 Sistema de Cores Configuráveis

Este projeto suporta **cores totalmente configuráveis via arquivo `.env`**, permitindo personalizar toda a interface sem modificar o código CSS.

## 📋 Como Funciona

1. **Arquivo `.env`**: Define todas as cores do sistema usando variáveis `COR_X`
2. **Script `generate-env.js`**: Lê o `.env` e gera automaticamente o arquivo `config.css`
3. **Arquivo `config.css`**: Sobrescreve as variáveis CSS do sistema com as cores do `.env`
4. **Build & Deploy**: O processo de build aplica as cores personalizadas

## 🚀 Como Usar

### 1. Configurar o arquivo .env

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e ajuste as cores
nano .env  # ou use seu editor preferido
```

### 2. Definir suas cores

No arquivo `.env`, edite as cores no formato hexadecimal:

```bash
# Exemplo: Alterar a cor primária
COR_4=#4f4adc    # Cor primária (botões, links)
COR_5=#2b2876    # Cor primária escura (hover)

# Exemplo: Alterar cores de status
COR_6=#058a00    # Sucesso (verde)
COR_7=#d80505    # Erro (vermelho)
COR_8=#F47922    # Aviso (laranja)
```

### 3. Buildar e iniciar o servidor

```bash
# Build do projeto (gera os arquivos config.json e config.css)
npm run build

# Iniciar o servidor
npm start
```

## 🎨 Cores Disponíveis

O sistema suporta até **50 cores personalizáveis** via `.env`. Consulte o arquivo `.env.example` para ver todas as cores disponíveis e suas descrições.

### Cores Principais

| Variável | Padrão | Uso |
|----------|--------|-----|
| `COR_1` | `#fff` | Fundo principal, textos em backgrounds escuros |
| `COR_4` | `#4f4adc` | Cor primária da marca, botões principais |
| `COR_5` | `#2b2876` | Cor primária escura, hover em botões |
| `COR_6` | `#058a00` | Status de sucesso, confirmações |
| `COR_7` | `#d80505` | Erros, alertas, status críticos |

### Como descobrir qual cor usar?

1. **Inspecione o elemento** no navegador (F12)
2. Procure por variáveis CSS como `var(--cor-4)`
3. Edite a variável correspondente no `.env` (ex: `COR_4`)

## 🔧 Desenvolvimento

### Modo de Desenvolvimento Local

Para desenvolvimento local com hot reload:

```bash
# 1. Configure o .env
cp .env.example .env

# 2. Inicie o servidor de desenvolvimento
npm run start

# As cores serão carregadas do public/config.json
# Edite public/config.json diretamente para testes rápidos
```

### Modo de Produção

Para produção (Docker, deploy):

```bash
# 1. Configure as variáveis de ambiente
export COR_4="#ff0000"
export COR_5="#00ff00"
# ... outras variáveis

# 2. Build e start
npm run build
npm start
```

## 📁 Estrutura de Arquivos

```
projeto/
├── .env                      # Suas configurações (não versionar!)
├── .env.example             # Exemplo de configuração
├── scripts/
│   └── generate-env.js      # Gera config.json e config.css
├── src/
│   ├── index.html           # Carrega config.css
│   └── styles.css           # Cores fallback
└── public/
    └── config.json          # Config de desenvolvimento
```

## 🎯 Fluxo de Cores

```
.env (variáveis)
    ↓
generate-env.js (build time)
    ↓
config.css (gerado automaticamente)
    ↓
:root { --cor-X: #valor; }
    ↓
Aplicação Angular usa var(--cor-X)
```

## ⚠️ Importante

- **Não commite o arquivo `.env`** (já está no `.gitignore`)
- Use `.env.example` como referência para novos ambientes
- Após alterar o `.env`, sempre execute `npm run build`
- As cores do `.env` sobrescrevem o `styles.css`
- Cores não definidas no `.env` usarão valores padrão (fallback)

## 🐛 Troubleshooting

### As cores não mudaram após alterar o .env

1. Certifique-se de executar `npm run build` novamente
2. Limpe o cache do navegador (Ctrl + Shift + R)
3. Verifique se o `config.css` foi gerado em `dist/frontend-red-balloon/browser/config.css`
4. Inspecione no navegador se `var(--cor-X)` está com o valor correto

### Cores aparecem erradas

1. Verifique o formato hexadecimal no `.env` (deve ter `#` no início)
2. Certifique-se de não ter espaços extras nas variáveis
3. Use `console.log` no `generate-env.js` para debugar

### Config.css não está sendo carregado

1. Verifique se o link está no `<head>` do `index.html`:
   ```html
   <link rel="stylesheet" href="/config.css">
   ```
2. Verifique se o arquivo foi gerado no build
3. Inspecione a Network tab do DevTools para ver se o arquivo foi baixado

## 📚 Exemplos de Uso

### Tema Escuro

```bash
COR_1=#1a1a1a    # Fundo principal escuro
COR_2=#2a2a2a    # Fundo secundário
COR_9=#ffffff    # Texto principal (branco)
COR_19=#ffffff   # Texto de contraste
```

### Tema Corporativo

```bash
COR_4=#003d7a    # Azul corporativo
COR_5=#002447    # Azul escuro
COR_6=#00a651    # Verde sucesso
COR_7=#e31b23    # Vermelho erro
```

### Modo High Contrast

```bash
COR_1=#ffffff    # Branco puro
COR_19=#000000   # Preto puro
COR_4=#0000ff    # Azul puro
COR_7=#ff0000    # Vermelho puro
```

## 🤝 Contribuindo

Ao adicionar novas cores ao sistema:

1. Adicione a variável no `.env.example` com descrição
2. Use a variável no CSS: `color: var(--cor-X);`
3. Documente o uso da cor neste README

## 📞 Suporte

Para dúvidas sobre cores específicas, consulte:
- `.env.example` → Todas as cores disponíveis com descrições
- `styles.css` → Como as cores são usadas no CSS
- `generate-env.js` → Como as cores são processadas
