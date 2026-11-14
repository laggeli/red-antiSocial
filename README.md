# ✦ UnaHur Anti-Social Net

UnaHur Anti-Social Net es una aplicación web desarrollada con **React y TypeScript** como trabajo práctico de la materia Construcción de Interfaces de Usuario de la Universidad Nacional de Hurlingham.

El proyecto propone una pequeña red social donde las personas usuarias pueden registrarse, iniciar sesión, compartir publicaciones, agregar comentarios y explorar el contenido de otros usuarios.

## ✧ Tecnologías utilizadas

- **React** – Desarrollo de interfaces.
- **TypeScript** – Tipado y organización del código.
- **React Router DOM** – Navegación entre páginas.
- **Context API** – Gestión global del usuario logueado.
- **Fetch API** – Comunicación con el backend.
- **CSS** – Estilos y diseño responsive.
- **Node.js + Express** – API REST proporcionada por la cátedra.
- **SQLite + Sequelize** – Base de datos utilizada por el backend.

## ✧ Estructura del proyecto

El trabajo está dividido en dos repositorios independientes:

| Repositorio | Descripción |
|---|---|
| FrontEnd | Interfaz de usuario desarrollada con React y TypeScript |
| BackEnd | API REST proporcionada por la cátedra para gestionar los datos |

El frontend consume los endpoints del backend mediante peticiones HTTP (`fetch`). De esta manera, ambos proyectos se ejecutan por separado, pero se comunican a través de la API.

## ✧ Instalación y ejecución

Para ejecutar la aplicación localmente es necesario levantar primero el backend y luego el frontend.

### 1. Backend

Clonar el repositorio proporcionado por la cátedra:

```bash
git clone https://github.com/lucasfigarola/backend-api.git
```

Ingresar a la carpeta e instalar las dependencias:

```bash
cd backend-api
npm install
```

Si durante la instalación aparece un aviso indicando que se bloquearon los scripts de `sqlite3`, ejecutar:

```bash
npm install-scripts approve sqlite3
npm rebuild sqlite3
```

Crear y cargar la base de datos con los datos de prueba:

```bash
node seed.js
```

Iniciar el servidor:

```bash
npm start
```

El backend estará disponible en:

```text
http://localhost:3001
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

La dirección base del backend es:

```ts
const API_URL = "http://localhost:3001";
```

Por ejemplo, para consultar los usuarios:

```ts
const respuesta = await fetch(`${API_URL}/users`);
const usuarios = await respuesta.json();
```

El backend tiene CORS habilitado, por lo que permite las peticiones desde el frontend.

Ambos servidores deben permanecer ejecutándose mientras se utiliza la aplicación:

- FrontEnd: `localhost:5173`
- BackEnd: `localhost:3001`

## ✧ Funcionalidades del proyecto

La aplicación contempla las siguientes funcionalidades:

- Inicio de sesión simulado.
- Registro de nuevos usuarios.
- Visualización de publicaciones recientes.
- Detalle de cada publicación.
- Consulta y creación de comentarios.
- Perfil de usuario con sus publicaciones.
- Creación de nuevas publicaciones.
- Asociación de imágenes y etiquetas.
- Navegación entre las distintas secciones.
- Persistencia de la sesión mediante `localStorage`.

El inicio de sesión utiliza una contraseña fija (`123456`), validada desde el frontend, de acuerdo con las consignas del trabajo práctico. No se implementa autenticación real ni JWT.

## ✧ Perfil de usuario

La sección de perfil permite visualizar la información del usuario que inició sesión y consultar sus publicaciones.

Entre los datos y elementos mostrados se encuentran:

- Nickname y correo electrónico.
- Cantidad de publicaciones.
- Descripción de cada publicación.
- Imágenes asociadas.
- Etiquetas.
- Cantidad de comentarios visibles.
- Acceso al detalle de cada publicación.
- Opción para cerrar sesión.

La información se obtiene mediante consultas a la API, utilizando el identificador del usuario para recuperar sus publicaciones.

## ✧ Sobre el Grupo
- Fajardo, Eugenia 
- González Ortiz, Celeste Alejandra
- Fogel, Facundo
- Laginestra Elisa

Desarrollado para la Universidad Nacional de Hurlingham.
</p>