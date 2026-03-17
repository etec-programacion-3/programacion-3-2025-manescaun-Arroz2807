# ---- Etapa 1: construir el proyecto React ----
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json primero (cache de dependencias)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la app para producción (genera la carpeta /app/dist)
RUN npm run build

# ---- Etapa 2: servir el build con Nginx ----
FROM nginx:alpine

# Copiar el build de Vite al directorio que sirve Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80