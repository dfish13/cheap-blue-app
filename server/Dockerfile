FROM node
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN cd cheap-blue && make && cd ..
EXPOSE 4000
CMD ["npm", "start"]