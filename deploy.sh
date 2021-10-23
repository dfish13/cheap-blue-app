#!/bin/bash

# configure for deployed environment
cp deploy/.env .env
cp deploy/.dockerignore .

# Build optimized frontend
cd client
npm run build
cd ..

# clean up cheap-blue in case there are build files in there
cd cheap-blue
make realclean
cd ..

# Build and push docker image
docker build -t duncanfish/deployment-images:cb-server .
docker push duncanfish/deployment-images:cb-server

# undo changes to working directory
git checkout .env
git checkout .dockerignore

# SSH to host server
# Pull new image
# Stop currently running containers
# Restart with new image
ssh -i ~/.ssh/LightsailDefaultKeyPair-us-east-1.pem ubuntu@52.201.159.220 "\
  cd git/cheap-blue-app;\
  docker pull duncanfish/deployment-images:cb-server;\
  docker-compose -f docker-compose.deploy.yml down;\
  docker-compose -f docker-compose.deploy.yml up -d;\
  exit\
"

echo "... Done\n"
