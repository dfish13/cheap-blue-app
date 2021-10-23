

# About



Check out the deployed app [Cheap Blue](https://duncanfish.co).

## Develop

From the root directory, you can use these commands:

```
npm start
```

Runs the backend in the development mode.\
If you edit any code it will automatically restart.

To launch the Postgres database as a Docker service:

```
npm run db
```

To launch pgAdmin 4 as a Docker service so you can examine the db as you develop:

```
npm run pgadmin
```

To run the client:

```
cd client
npm start
```

Navigate to the browser at [http://localhost:3000](http://localhost:3000)  to view the app. If you edit any code in the client directory it will restart. You will have to bring up another terminal if you have the backend running in your current one.

Finally you will have to build the Cheap Blue chess engine from source. Again, this will have to be in a new terminal because you already have two terminals busy running the frontend and backend. Back in the root directory run:

```
cd cheap-blue
make
```

This builds an executable that is run as a subprocess by the server. Now you can finally test the app and even play the engine.

## Build

This app is built/deployed as 2 Docker containers:

- ### cb-server
  Express backend and react frontend wrapped in one service.
- ### postgres
  The default Postgres database provided on dockerhub.

To build the project perform the following steps in order.

Navigate to the client directory and create a minified static build:

```
cd client
npm run build
```

Go back to the root directory and build cb-server with the following commands:

```
cd ..
docker build -t duncanfish/cheap-blue:cb-server .
```

You probably want to replace the tag with something besides my dockerhub repo.\
If you do, you will also need to replace the image name for cb-server in docker-compose.yml.

To start all containers:

```
docker-compose up -d
```

And the whole app should be running on your local machine!\
Go to [http://localhost:4000](http://localhost:4000) to view it :smile:


## Deploy

Not sure why anyone besides me would want to deploy this project but I will document the process anyway. I wrote a script to execute all of the steps in the deployment process. In my case, I am currently using a Linux VM on AWS Lightsail with docker installed. If you really want to deploy it yourself you can modify this script to work with your specific deployment environment.

```
./deploy.sh
```


