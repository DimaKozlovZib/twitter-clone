FROM node:14.18
WORKDIR /serverApp
COPY . /serverApp

VOLUME static-volume
COPY ./static-images /static-images

RUN npm ci && npm install pm2 -g

CMD ["pm2-runtime", "index.js"]

