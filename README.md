# ✦ UnaHur Anti-Social Net

UnaHur Anti-Social Net es una aplicación web desarrollada con **React y TypeScript** como trabajo práctico de la materia Construcción de Interfaces de Usuario de la Universidad Nacional de Hurlingham.

El proyecto propone una pequeña red social donde las personas usuarias pueden registrarse, iniciar sesión, compartir publicaciones, agregar comentarios y explorar el contenido de otros usuarios.

## ✧ Tecnologías utilizadas

- **React** – Desarrollo de interfaces.
- **TypeScript** – Tipado y organización del código.
- **Vite** – Entorno de desarrollo y empaquetado.
- **React Router DOM** – Navegación entre páginas.
- **Context API** – Gestión global del usuario logueado.
- **Fetch API** – Comunicación con el backend.
- **CSS** – Estilos y diseño responsive.
- **React Bootstrap Icons** – Iconografía consistente en toda la interfaz.
- **Node.js + Express** – API REST diseñada por el grupo.
- **MongoDB y Mongoose** – Base de datos NoSQL para la persistencia de la información.
- **Docker y Docker Compose** – Contenedorización para ejecutar los servicios de base de datos de forma local.
- **Redis** – Sistema de caché para optimizar las consultas del servidor.

## ✧ Estructura del proyecto

El trabajo está dividido en dos repositorios independientes:

| Repositorio | Descripción |
|---|---|
| FrontEnd | Interfaz de usuario desarrollada con React, TypeScript y CSS Modules |
| BackEnd | API REST desarrollada por el grupo cómo proyecto final de la materia EDP y modificada por la compañera Elisa Laginestra para sumar funcionalidades especificas pertinentes a la consigna. Encargada de la lógica de negocio, conexión con MongoDB y gestión de rutas |

El frontend consume los endpoints del backend mediante peticiones HTTP (`fetch`). De esta manera, ambos proyectos se ejecutan por separado, pero se comunican a través de la API.

## ✧ Requisitos previos

Antes de clonar e iniciar los proyectos, asegúrate de tener instalado en tu computadora:
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).
- [Docker Desktop](https://www.docker.com/) (debe estar abierto y ejecutándose en segundo plano para levantar los contenedores de MongoDB y Redis).

## ✧ Instalación y ejecución

Para ejecutar la aplicación localmente es necesario levantar primero el backend (junto con sus bases de datos) y luego el frontend.

### 1. Backend

Clonar el repositorio desarrollado por el grupo:

```bash
git clone https://github.com/laggeli/red-antiSocial-back
cd red-antiSocial-back
code .
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor:

```bash
docker compose up -d
npm run seed:users
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

### 2. FrontEnd

Clonar el repositorio del proyecto:

```bash
git clone https://github.com/laggeli/red-antiSocial.git
```

Ingresar a la carpeta e instalar las dependencias:

```bash
cd red-antiSocial
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará la dirección local para acceder a la aplicación, normalmente:

```text
http://localhost:5173
```

## ✧ Comunicación entre FrontEnd y BackEnd

La aplicación utiliza `fetch` para realizar peticiones HTTP a la API.

La dirección por default del backend es:

```ts
const API_URL = "http://localhost:3000";
```

Por ejemplo, para consultar los usuarios:

```ts
const respuesta = await fetch(`${API_URL}/users`);
const usuarios = await respuesta.json();
```

El backend tiene CORS habilitado, por lo que permite las peticiones desde el frontend.

Ambos servidores deben permanecer ejecutándose mientras se utiliza la aplicación:

- FrontEnd: `localhost:5173`
- BackEnd: `localhost:3000`

## ✧ Funcionalidades del proyecto

La aplicación contempla las siguientes funcionalidades:

- Inicio de sesión simulado.
- Registro de nuevos usuarios.
- Visualización de publicaciones recientes.
- Detalle de cada publicación.
- Consulta y creación de comentarios.
- Perfil de usuario con sus publicaciones.
- Creación, edición y eliminación de publicaciones propias (incluyendo subida de archivos locales o múltiples URLs con validación).
- Creación, edición y eliminación de comentarios dentro del detalle de cada publicación.
- Exploración y filtrado de publicaciones por etiquetas (`#tags`).
- Sistema de seguimiento entre usuarios (seguir y dejar de seguir).
- Asociación de imágenes y etiquetas.
- Navegación entre las distintas secciones.
- Modales de confirmación reutilizables para acciones críticas (publicar, guardar cambios, eliminar contenido o dar de baja la cuenta).
- Modo claro y modo oscuro adaptable en todas las vistas.
- Persistencia de la sesión mediante `localStorage`.

## ✧ Perfil de usuario

La sección de perfil permite visualizar la información del usuario que inició sesión y consultar sus publicaciones.

Entre los datos y elementos mostrados se encuentran:

- Foto de perfil (o avatar con inicial), NickName y nombre completo.
- Cantidad de seguidores y seguidos.
- Cantidad de seguidores, seguidos y publicaciones.
- Descripción de cada publicación.
- Botón para seguir/dejar de seguir en perfiles de terceros e indicador de seguimiento mutuo.
- Listado de publicaciones del usuario con contador de comentarios y acceso al detalle.
- Opción para cerrar sesión y sección para eliminar la cuenta de forma permanente.

La información se obtiene mediante consultas a la API, utilizando el identificador del usuario para recuperar sus publicaciones.

## ✧ Sobre el Grupo
- Fajardo, Eugenia 
- González Ortiz, Celeste Alejandra
- Fogel, Facundo
- Laginestra Elisa

Desarrollado para la Universidad Nacional de Hurlingham.
</p>