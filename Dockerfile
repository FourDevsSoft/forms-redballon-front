# Stage 1: Build da aplicação Angular
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação Angular
RUN npm run build

# Stage 2: Produção com Express
FROM node:20-alpine AS production

WORKDIR /app

# Copiar package.json para instalar apenas deps de produção
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --omit=dev && \
    npm install express dotenv && \
    npm cache clean --force

# Copiar script do servidor
COPY scripts/generate-env.js ./scripts/

# Copiar arquivos buildados do stage anterior
COPY --from=builder /app/dist ./dist

# Expor porta (configurável via ENV)
EXPOSE 8080

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=8080

# Comando para iniciar o servidor
CMD ["node", "scripts/generate-env.js"]
