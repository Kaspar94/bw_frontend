# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /frontend

ENV PATH /frontend/node_modules/.bin:$PATH
# add

# install and cache app dependencies
COPY package.json /frontend/package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent

COPY . /frontend
# start app
CMD ["npm", "start"]
