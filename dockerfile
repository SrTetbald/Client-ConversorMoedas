# --- ETAPA 1: BUILD (Compilação) ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copia e instala dependências
COPY package*.json package-lock.json ./
RUN npm install

# Copia o código e faz o build de produção
COPY . .
# ⚠️ O comando de build do Angular
RUN npm run build

# --- ETAPA 2: NGINX (Servidor de Produção) ---
FROM nginx:alpine

# Copia a configuração personalizada do Nginx que acabamos de criar
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados para o Nginx
# 🚨🚨🚨 ATENÇÃO AQUI: AJUSTE O CAMINHO DE SAÍDA DO BUILD
# O Angular frequentemente usa uma subpasta dentro de /app/dist.
# VERIFIQUE a sua pasta dist e substitua o caminho abaixo se for diferente!
# Exemplo: /app/dist/NOME_DO_SEU_PROJETO
COPY --from=builder /app/dist/client-conversor/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]