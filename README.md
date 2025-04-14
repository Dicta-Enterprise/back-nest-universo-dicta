# BACKEND NESTJS DICTA

Este proyecto fue generado con [NestJs CLI](https://nestjs.com/) version 10.0.0.

## Instalaciones Necesarias

- version 10.0.0 [NestJs CLI](https://nestjs.com/)
- version 20.12.2 [NodeJs](https://nodejs.org/en)
- version 1.89 [Visual Studio Code](https://code.visualstudio.com/)
- version 10.5.0 [Npm](https://www.npmjs.com/)

## Servidor de Desarrollo

Antes de levantar el servidor, primero navegar hasta su rama personalizada para que no tenga conflictos luego

Ejecutar el comando de `npm install` en la raiz del proyecto para descargar toda la paqueteria de NodeJs necesaria para la ejecucion

Hacer una copia del archivo `.env.template` y renombrarlo a `.env`

Ejecutar `npx prisma generate` para sincronizar los cambios de prisma en el codigo

Para ventar el sistema ejecutar `npm run start:dev`, ese comando inicializara NestJs en el puerto 3000, por ejemplo `http://localhost:3000/`

El server se recargara automaticamente asi que no es necesario bajar el servidor y volver a levantarlo.

## Desarrollo con Docker

1. Clonar el repositorio
2. Create un .env basado en el .env.template
3. Ejecutar el comando `docker compose up --build`

npm run start:dev

## 2. Base de datos

Para conectarse a la base de datos necesita ingresar las credenciales que estan en `.env.template` en MongoCompass o en otro gestor de base de datos.

Recuerde instalar siempre el servidor de MongoDB edicion Comunnity

## Flujo de Datos

                   ┌────────────────────┐
                   │   HTTP Request     │
                   └────────┬───────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │     Controller     │
                   └────────┬───────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │      Use Case      │
                   └────────┬───────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │   Domain Service   │
                   └────────┬───────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │     Repository     │
                   └────────┬───────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │        DB          │
                   └────────────────────┘

## Dependencias

## Dependencias

| Nombre                                                                 | Versión | Uso                                                                                                  |
| ---------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| [@nestjs/mongoose](https://docs.nestjs.com/recipes/mongodb)            | 10.0.10 | Integración oficial de Mongoose con NestJS para trabajar con MongoDB.                                |
| [prisma](https://docs.nestjs.com/recipes/prisma)                       | 5.20.0  | ORM moderno para TypeScript que permite gestionar y consultar bases de datos de forma tipada.        |
| [@prisma/client](https://www.npmjs.com/package/@prisma/client)         | 5.20.0  | Cliente generado automáticamente por Prisma para interactuar con la base de datos.                   |
| [class-transformer](https://www.npmjs.com/package/class-transformer)   | 3.3.1   | Permite transformar objetos entre clases y planos, útil para la serialización y deserialización.     |
| [class-validator](https://www.npmjs.com/package/class-validator)       | 3.3.1   | Permite validar datos utilizando decoradores sobre clases y propiedades.                             |
| [dotenv](https://www.npmjs.com/package/dotenv)                         | 4.0.0   | Carga variables de entorno desde un archivo `.env` al entorno de ejecución (`process.env`).          |
| [joi](https://www.npmjs.com/package/joi)                               | 7.0.0   | Biblioteca para validación de datos con una sintaxis declarativa y poderosa.                         |
| [mongoose](https://www.npmjs.com/package/mongoose)                     | 16.4.1  | ODM para MongoDB que permite definir esquemas y modelos para manejar la base de datos desde Node.js. |
| [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) | 16.1.0  | Middleware para servir la documentación de Swagger UI en una aplicación Express o NestJS.            |
