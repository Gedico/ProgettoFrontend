# =========================
# STAGE 1: BUILD ANGULAR
# =========================
FROM node:22-alpine AS build

WORKDIR /app

# Copia package.json
COPY package*.json ./

# Installazione dipendenze
RUN npm install

# Copia sorgenti
COPY . .

# Build produzione (senza SSR)
RUN npm run build -- --configuration production --prerender false --ssr false


# =========================
# STAGE 2: NGINX SERVER
# =========================
FROM nginx:stable-alpine

# Rimuove configurazione di default
RUN rm /etc/nginx/conf.d/default.conf

# Nuova configurazione con proxy backend
RUN printf "server { \n\
    listen 80; \n\
    \n\
    # Proxy verso backend Docker \n\
    location /api/ { \n\
        proxy_pass http://backend:8080/; \n\
        proxy_set_header Host \$host; \n\
        proxy_set_header X-Real-IP \$remote_addr; \n\
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; \n\
        proxy_set_header X-Forwarded-Proto \$scheme; \n\
    } \n\
    \n\
    # Angular routing \n\
    location / { \n\
        root /usr/share/nginx/html; \n\
        index index.html; \n\
        try_files \$uri \$uri/ /index.html; \n\
    } \n\
}" > /etc/nginx/conf.d/default.conf

# Copia build Angular
COPY --from=build /app/dist/progetto-frontend/browser /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
