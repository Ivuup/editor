FROM node:lts-alpine

RUN npm install -g @vue/cli-service-global

WORKDIR /editor

# Script para inciar o ambiente
COPY ./start.sh /start.sh

# Permissão para execução
RUN chmod +x /start.sh
