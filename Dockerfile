FROM node:9.0.0
RUN useradd --user-group --create-home --shell /bin/false app && npm install --global npm@4.5.0
ENV HOME=/home/app
COPY package.json package-lock.json $HOME/user-auth/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/user-auth
RUN npm install

CMD ["node", "index.js"]