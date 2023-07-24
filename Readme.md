# API REST de Gestión de Información de Congreso

Este repositorio contiene un API REST desarrollado con Express, MongoDB y TypeScript que permite gestionar la información de un congreso. A continuación, encontrarás detalles sobre cómo instalar, configurar y ejecutar el proyecto.

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

- Node.js (versión 18.16.1)
- MongoDB

## Instalación

Sigue estos pasos para instalar las dependencias necesarias:

```bash
npm install
```

## Configuración

### Variables de Entorno

El proyecto utiliza diferentes variables de entorno según el entorno de desarrollo y producción. Asegúrate de crear los archivos `.env.development` y `.env.production` en la raíz del proyecto y proporcionar los valores adecuados para cada variable.

#### Ejemplo de archivo .env.development

```
DB_URL_DEV=mongodb://localhost:27017/congreso_dev
PORT=3000
```

#### Ejemplo de archivo .env.production

```
MONGO_URI=
PORT = 
SECRET =
EMAIL_USER=
EMAIL_PASSWORD=
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
DOMAIN=
```

## Ejecución

Para ejecutar el proyecto en modo de desarrollo, utiliza el siguiente comando:

```bash
npm run dev
```

Para ejecutar el proyecto en modo de producción, utiliza el siguiente comando:

```bash
npm run start
```

## Documentación

La documentación de los endpoints del API se encuentra en la ruta `/docs`. Después de ejecutar el proyecto, puedes acceder a la documentación desde tu navegador web ingresando la siguiente URL:

```
http://dominio:PORT/docs
```

## ¡Importante!

Recuerda asegurarte de tener MongoDB en ejecución antes de lanzar el servidor de la API.

¡Disfruta usando el API REST de Gestión de Información de Congreso! Si tienes alguna pregunta o inconveniente, no dudes en contactarnos.