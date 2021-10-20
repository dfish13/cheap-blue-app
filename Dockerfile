FROM node
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY client/build client/build
COPY .env.build .env
RUN npm install
COPY . .
RUN cd cheap-blue && make && cd ..
EXPOSE 4000
CMD ["npm", "start"]