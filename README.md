# Hust-NetworkPrograming-Quizzezz

## I. Intro

### 1. Functions

### 2. Platform

- Server: Unix(Linux)
- Client: Website

## II. Network Protocol

1. Description

- Request: <path> headers body
- Response:

2. Status code

### How to run

> prerequisite: make sure you have installed gcc/g++, cmake, node and the libpq++ library (for postgreSQL connection)

1. Install dependencies
   From the root folder (Hust-NetworkPrograming-Quizzezz)

```sh
cd Proxy
npm i
cd ../Client
npm i
```

2. Build server

```sh
cd ../Server
cmake build
```

3. Run the server

```sh
build/Server
```

The server is serve at http://localhost:8080

4. Run the proxy
   Open new terminal at the root folder

```sh
cd Proxy
node proxy.sh
```

5. Build and run the client

Open new terminal at the root folder

```sh
cd Client
npm run build
npm start
```

Now the app is ready at http://localhost:3000
