# Dev

## 1. Primeros Pasos

Hacer una copia del archivo `.env.template` y renombrarlo a `.env`

Ejecutar `npx prisma generate` para sincronizar los cambios de prisma en el codigo

Para ventar el sistema ejecutar `npm run start:dev`, ese comando inicializara NestJs


## 2. Base de datos

Para conectarse a la base de datos necesita ingresar las credenciales que estan en `.env.template` en MongoCompass o en otro gestor de base de datos.

Recuerde instalar siempre el servidor de MongoDB edicion Comunnity

## Flujo de Datos

HTTP Request → Controller → Use Case → Domain Service → Repository → DB
                                        ↑
                                (Valida con DTOs)
