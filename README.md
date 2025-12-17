<h1 align="center"> # Sistema de Agendamiento Médico :hospital: </h1>

Plataforma basada en **Microservicios** para la gestión hospitalaria. Permite administrar pacientes, médicos, generar agendas por slots de tiempo y gestionar citas médicas con notificaciones automáticas.


## :clipboard: Requisitos previos

- [cite_start]Node.js (v18 o superior)
- NPM (Incluido con Node)
- Git


## Clonar el repositorio
```
git clone https://github.com/ssaloudd/sistema-agendamiento.git
cd sistema-agendamiento
```


### :rocket: **Backend (Microservicios NodeJS)**
El sistema consta de 6 componentes de backend independientes. Es necesario instalar las dependencias en cada uno.

###     1. Estructura de Puertos
| API Gateway        |   4000	|Punto de entrada único         |
| Event Bus          |   4005	|Broker de mensajería asíncrona |
| MS Médicos	     |   4001	|Gestión de médicos y turnos    |
| MS Pacientes	     |   4002	|Gestión de pacientes           |
| MS Agendamiento	 |   4003	|Orquestador de citas           |
| MS Notificaciones	 |   4004	|Buzón de correos simulado      |

###     2. Instalar dependencias
Debes ingresar a cada carpeta y ejecutar la instalación.
- :file_folder: Primer Terminal: \event-bus
- :file_folder: Segundo Terminal: \api-gateway
- :file_folder: Tercer Terminal: \ms-pacientes
- :file_folder: Cuarto Terminal: \ms-medicos
- :file_folder: Quinto Terminal: \ms-agendamiento
- :file_folder: Sexto Terminal: \ms-notificaciones
En cada una ejecutar:
```
npm install
```


###     3. Base de Datos (SQLite)
No requiere instalación de servidor de base de datos. El sistema utiliza SQLite con Sequelize ORM. Los archivos .sqlite se generarán automáticamente dentro de cada carpeta de microservicio (ms-*/) la primera vez que se ejecute el comando npm start.



### :computer: **Frontend (React + Vite)**

###     1. Instalar dependencias
- :file_folder: Terminal 7: \client
```
npm install
```

###     2. Ejecución del Proyecto
Tienes dos formas de ejecutar el sistema:
- OPCIÓN A: Ejecución Automática (Recomendada :white_check_mark:)
Si estás en Windows, simplemente haz doble clic en el archivo ubicado en la raíz:
```
start-all.bat
```
Esto abrirá todas las terminales necesarias y lanzará los servidores en orden.

- OPCIÓN B: Ejecución Manual
Si prefieres hacerlo manualmente, debes abrir 7 terminales y ejecutar los servicios en este orden sugerido:

#### 1. Infraestructura:
```
cd event-bus && npm start
cd api-gateway && npm start
```

#### 2. Microservicios:
```
cd ms-pacientes && npm start
cd ms-medicos && npm start
cd ms-agendamiento && npm start
cd ms-notificaciones && npm start
```

#### 3. Frontend:
```
cd client && npm run dev
```

### :star2: **Ejecución**
Una vez iniciados todos los servicios, abre tu navegador en: http://localhost:5173