FROM node:lts as build

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@10.6.0 & npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/ssl/fullchain.pem /etc/nginx/ssl/nginx.crt
COPY nginx/ssl/privkey.pem /etc/nginx/ssl/nginx.key

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]