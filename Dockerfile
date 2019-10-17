FROM node:8.9

RUN mkdir /var/app

WORKDIR /var/app

ADD . .

RUN npm install && \
    sed -i -e 's/https:\/\/development-api.effortlesslegal.com/localhost:8080/g' ./config/dev.env.js

EXPOSE 8080

CMD ["npm","run","start"]
