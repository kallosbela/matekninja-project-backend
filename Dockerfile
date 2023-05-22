FROM node:18-alpine
ADD . /appdir
WORKDIR /appdir
CMD ["npm", "start"]
EXPOSE 8000