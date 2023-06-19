FROM nvidia/opengl:1.0-glvnd-runtime-ubuntu22.04 as nvidia

# update 
RUN apt-get -y update
RUN apt-get -y upgrade
# install curl 
RUN apt-get -y install curl gnupg
# get install script and pass it to execute: 
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash
# and install node 
RUN apt-get install -y nodejs

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN apt-get install -y ffmpeg
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]  