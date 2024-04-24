FROM node:alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY ../../etc/letsencrypt/live/kozlovproject.ru/fullchain.pem /etc/nginx/ssl/nginx.crt
COPY ../../etc/letsencrypt/live/kozlovproject.ru/privkey.pem /etc/nginx/ssl/nginx.key

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]