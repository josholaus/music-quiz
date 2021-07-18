FROM node:14
LABEL com.josholaus.musicquiz.authors="josh@bemoty.dev"
WORKDIR /home/app/musicquiz

COPY . .

# Install the server
RUN cd /home/app/musicquiz/server && npm install

# Compile and install the React app
RUN cd /home/app/musicquiz/app && npm install && npm run build

EXPOSE 80
CMD [ "node", "/home/app/musicquiz/server" ]
