FROM node
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY client/build client/build
RUN npm install
COPY . .
COPY .env.build .env
RUN cd cheap-blue && make && cd ..
EXPOSE 4000
CMD ["npm", "start"]