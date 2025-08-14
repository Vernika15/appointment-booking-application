FROM node:20.19.3

# Set the working directory inside container
WORKDIR /app

# Copy package files and install dependencies in /app
COPY package*.json ./

RUN npm install

# Copy the rest of the source code into /app
COPY . .

EXPOSE 8081

CMD [ "npm", "run", "dev" ]