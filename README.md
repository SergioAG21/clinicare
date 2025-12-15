# 🚀 Guía para ejecutar el proyecto **CliniCare** (Angular + Spring Boot)

Este documento explica paso a paso cómo ejecutar el proyecto **frontend (Angular)** y **backend (Spring Boot)** en un entorno de desarrollo local.

---

## 📋 Requisitos previos

Asegúrate de tener instalado lo siguiente:

### 🔧 Herramientas necesarias

- **Java JDK 17+** ☕
- **Maven**
- **Node.js 18+**
- **npm** (incluido con Node.js)
- **Angular CLI**

```bash
npm install -g @angular/cli
```

- **Git** (opcional, pero recomendado)
- **IDE recomendado**: IntelliJ IDEA (Backend) / VS Code (Frontend)

---

## 📁 Estructura del proyecto

```text
proyecto/
│
├── clinicare-api/      # Spring Boot (Backend)
│   └── pom.xml
│
└── clinicare/          # Angular (Frontend)
    └── angular.json
```

---

## ⚙️ Backend – Spring Boot

### 1️⃣ Acceder al backend

```bash
cd clinicare-api
```

### 2️⃣ Configurar variables de entorno

El backend utiliza variables de entorno definidas en un archivo `.env` (o configuradas en el sistema).

Archivo de configuración:

```text
src/main/resources/application.properties
```

Ejemplo:

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/clinicare
spring.datasource.username=${DATABASE_USER}
spring.datasource.password=${DATABASE_PASSWORD}

mailsender.username=${MAILSENDER_USERNAME}
mailsender.password=${MAILSENDER_PASSWORD}

jwt.secret=${JWT_SECRET}
```

📌 Asegúrate de que las variables de entorno estén definidas antes de arrancar el proyecto.

---

### 3️⃣ Ejecutar el backend

Con Maven:

```bash
mvn spring-boot:run
```

O generando el JAR:

```bash
mvn clean package
java -jar target/*.jar
```

📌 El backend quedará disponible en:

```text
http://localhost:8080/api
```

---

## 🎨 Frontend – Angular

### 1️⃣ Acceder al frontend

```bash
cd clinicare
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

---

### 3️⃣ Configurar el entorno

Crear un archivo `.env` en la raíz del proyecto **frontend** usando como base `.env.template`:

```text
API_BASE_URL=http://localhost:8080/api
```

Ejecutar el siguiente comando para generar los archivos de entorno:

```bash
npm run set-envs
```

Esto generará automáticamente los archivos en:

```text
src/environments/
```

Ejemplo de `environment.ts`:

```ts
export const environment = {
 apiBaseUrl: "http://localhost:8080/api",
};
```

---

### 4️⃣ Ejecutar Angular

```bash
ng serve
```

📌 La aplicación estará disponible en:

```text
http://localhost:4200
```

---

## 🔗 Comunicación Angular ↔ Spring Boot

Las llamadas HTTP se realizan usando `HttpClient` apuntando a:

```ts
${environment.apiBaseUrl}/...
```

Ejemplo:

```ts
this.http.get<User>(`${environment.apiBaseUrl}/users/${id}`);
```

---

## 🧪 Usuarios y pruebas

- Asegúrate de que el **backend esté levantado antes** que el frontend
- Revisa la configuración de **CORS** si hay errores de conexión

Ejemplo básico en Spring Boot:

```java
@CrossOrigin(origins = "http://localhost:4200")
```

---

## ❗ Problemas comunes

### ❌ Error CORS

✔️ Verifica `@CrossOrigin` o la configuración global de CORS

### ❌ Puerto ocupado

✔️ Cambia el puerto en `application.properties` o libera el puerto en uso

### ❌ Dependencias

✔️ Ejecuta nuevamente:

```bash
npm install
mvn clean install
```

---

## ✅ Comandos rápidos

```bash
# Backend
cd clinicare-api
mvn spring-boot:run

# Frontend
cd clinicare
ng serve
```

---

## 📌 Notas finales

- Ejecutar siempre **backend primero**
- No usar `ng serve --open` en producción
- Para producción usar:

```bash
ng build --configuration production
```

---

✨ Proyecto listo para desarrollo ✨
