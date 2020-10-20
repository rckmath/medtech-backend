![MedTech](https://i.imgur.com/NdVec2f.png)

## The Project

This project was developed to the university subject of Tecnologia e Programação para Web e para Dispositivos Móveis where we learn back and frontend applications development.

## MedTech

MedTech is an idea of a smart medical clinic appointment management system where medics and patients can use it to organize and communicate between themselves and also use it as a calendar center for they medical appointments.

## Table of Contents
- [The Project](#the-project)
- [MedTech](#medtech)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Setup](#setup)
  - [Pre-requisites](#pre-requisites)
  - [Instructions](#instructions)
- [Docker](#docker)
- [Technologies](#technologies)
- [Environment](#environment)

## Features

- Create, read, update and soft delete users (admin, patient and medic)
- Create, read, update and soft delete appointments
- AWS S3 Bucket Integrations to user profile photos
- Mailing ready system with Google OAuth2 (only Gmail)
- Docker Compose ready project (see [Docker](#docker) section)
- MVC based project

## Setup

### Pre-requisites

- [Node 12.19.0 LTS](https://nodejs.org/en/) -> To run the application
- [Yarn](https://yarnpkg.com/getting-started/install) -> If you want to use the package.json scripts
- [PostgreSQL](https://www.postgresql.org) -> If you will **not** use [Docker](#docker)
- [Google Developer account](https://developers.google.com) -> In order to use the mailing system
- [AWS S3 Bucket](https://aws.amazon.com/s3/) -> If you want to use the AWS S3 Bucket Integration
- [Windows WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) -> If at Windows, necessary to run some package.json scripts that uses Linux terminal commands

### Instructions

With all pre-requisites configured, the next step is to follow these instructions:

1. Clone the repository
2. Open the terminal at the project root folder and type "yarn" to install all dependencies
3. Create a file named as ".env-development". We will start using a development environment.
4. Use the following code at the created file:

```env
PORT=YOUR_PREFERRED_PORT_NUMBER
HOST=YOUR_HOST #(default: 0.0.0.0)

NODE_ENV=development

DATABASE_PORT=YOUR_POSTGRES_DATABASE_PORT #(default: 5432)
DATABASE_HOST=YOUR_POSTGRES_DATABASE_HOST
DATABASE_NAME=YOUR_POSTGRES_DATABASE_NAME
DATABASE_USER=YOUR_POSTGRES_USER
DATABASE_PASSWORD=YOUR_POSTGRES_DATABASE_PASSWORD

SYSTEM_PASSWORD=YOUR_PREFERRED_ADMIN_PASSWORD

AUTH_JWT_SECRET=YOUR_PREFERRED_JWT_SECRET
AUTH_ACCESS_TOKEN_LIFETIME=YOUR_PREFERRED_TOKEN_LIFETIME #(example: 12h)
AUTH_REFRESH_TOKEN_LIFETIME=YOUR_PREFERRED_TOKEN_LIFETIME #(example: 14d)

MAILING_EMAIL=YOUR_GOOGLE_MAILING_EMAIL
MAILING_ALIAS=YOUR_PREFERRED_MAILING_ALIAS

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN=YOUR_GOOGLE_REFRESH_TOKEN

AWS_ACCESS_KEY=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_REGION=YOUR_AWS_REGION
AWS_BUCKET_NAME=YOUR_AWS_BUCKET
```

## Docker

This project is Docker Compose compatible, and I've used the following configuration in order to set-up the project with Docker:

**Dockerfile**
```Dockerfile
FROM node:12-alpine

ENV HOME=/home/app/medtech
WORKDIR ${HOME}

COPY package*.json ./

RUN yarn

COPY . .

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT [ "./docker-entrypoint.sh" ]
```

**docker-compose.yml**
```yml
version: "3.8"

x-common_env: &common_env
  PORT: ${PORT}
  HOST: ${HOST}
  NODE_ENV: ${NODE_ENV}
  SYSTEM_PASSWORD: ${SYSTEM_PASSWORD}
  DATABASE_PORT: ${DATABASE_PORT}
  DATABASE_HOST: ${DATABASE_HOST}
  DATABASE_NAME: ${DATABASE_NAME}
  DATABASE_USER: ${DATABASE_USER}
  DATABASE_PASSWORD: ${DATABASE_PASSWORD}
  AUTH_JWT_SECRET: ${AUTH_JWT_SECRET}
  AUTH_ACCESS_TOKEN_LIFETIME: ${AUTH_ACCESS_TOKEN_LIFETIME}
  AUTH_REFRESH_TOKEN_LIFETIME: ${AUTH_REFRESH_TOKEN_LIFETIME}

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - ${PORT}:${PORT}
    environment:
      <<: *common_env
    depends_on:
      - database
    links:
      - database:database
    volumes:
      - type: bind
        source: ./
        target: /home/app/medtech
    deploy:
      resources:
        limits:
          memory: 384M
        reservations:
          memory: 128M
  database:
    image: postgres:alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${DATABASE_USER}
      POSTGRES_DB: ${DATABASE_NAME}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - medtech-data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 64M

volumes:
  medtech-data:
    name: "medtech"
```

At package.json we also have the properly scripts in order to build and run with Docker. With a configured environment (see [setup](#setup) section to more details) we can run as dev through the following scripts:

1. yarn build:dev
2. yarn docker:dev

## Technologies

- :star: Node.js
- :star: Express
- :star: Sequelize ORM
- :star: PostgreSQL
- :star: Docker
- :star: AWS S3
- :star: Nodemailer
- :star: Babel
- :star: JSON Web Token
- :star: MJML

## Environment

- :desktop_computer: Visual Studio Code for coding
- :desktop_computer: JetBrains DataGrip for database management
- :desktop_computer: Postman for API testing
- :desktop_computer: Git for code versioning
- :desktop_computer: Notion for annotating
- :desktop_computer: Spotify music for focusing
- :beetle: ~~Stack Overflow for debugging~~