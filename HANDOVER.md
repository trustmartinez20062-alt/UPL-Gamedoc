# 🧊 Guía de Entrega y Despliegue: Game Doctor — Uruguay

Este documento es una guía técnica completa diseñada para que cualquier desarrollador o especialista SEO pueda tomar el proyecto desde cero, configurarlo y ponerlo en producción en menos de 15 minutos.

---

## 📋 1. Requisitos Previos
Antes de empezar, asegúrate de tener:
- **Node.js** (v20 o superior recomendado).
- Cuenta gratuita en [Supabase](https://supabase.com/).
- Cuenta en un hosting compatible con Vite (Recomendado: [Vercel](https://vercel.com/) o [Netlify](https://netlify.com/)).

---

## 🗄️ 2. Despliegue de la Base de Datos (Supabase)
El proyecto utiliza Supabase como backend. Para replicar la base de datos:

1. Crea un nuevo proyecto en **Supabase**.
2. Ve a la sección **SQL Editor** en el panel lateral.
3. Haz clic en "New Query".
4. Abre el archivo **`CLONE_DATABASE.sql`** (incluido en la raíz de este proyecto).
5. Copia todo el contenido del archivo y pégalo en el editor de Supabase.
6. Haz clic en **"Run"**.
    - *Esto creará automáticamente todas las tablas, las políticas de seguridad (RLS) y los datos iniciales.*

---

## 🛠️ 3. Configuración del Entorno (.env)
Para conectar el frontend con la base de datos y configurar el SEO:

1. Localiza el archivo **`.env.example`** y cámbiale el nombre a **`.env.local`** (para desarrollo) o configúralas en tu hosting (para producción).
2. Completa las siguientes variables:
    - **`VITE_SUPABASE_URL`**: La URL de tu proyecto Supabase (Settings > API).
    - **`VITE_SUPABASE_ANON_KEY`**: La clave anónima (Settings > API).
    - **`VITE_SITE_URL`**: El dominio final (ej: `https://gamedoctor.uy`). **Este es el interruptor maestro del SEO.**

---

## 📦 4. Instalación y Compilación (Build)
Desde una terminal en la carpeta raíz:

1. **Instalar dependencias**: `npm install`
2. **Ejecutar en desarrollo**: `npm run dev`
3. **Generar para producción**: `npm run build`
    - *Nota: Al ejecutar `build`, el sistema también genera automáticamente el `sitemap.xml` usando la URL del .env.*

---

## 📈 5. Guía SEO y Google Search Console (GSC)
Para asegurar que el sitio aparezca en Google:

1. **Alta**: Registra la propiedad en [Search Console](https://search.google.com/search-console) como "Prefijo de URL".
2. **Verificación**: Descarga el archivo `.html` de Google y colócalo en la carpeta **`public/`**. Luego haz el despliegue.
3. **Sitemap**: En GSC, ve a Sitemaps y envía el archivo `sitemap.xml`.
4. **Resumen**: Al cambiar `VITE_SITE_URL` y hacer build, el sitemap se actualiza solo.

---

## 🧹 6. Estructura de Archivos y Limpieza
Si vas a entregar el código o migrarlo, ten en cuenta:

- **Archivos que puedes eliminar (Safe to delete)**:
    - `node_modules/`: Se regenera con `npm install`.
    - `dist/`: Se regenera con `npm run build`.
    - `DOMAIN_CONFIG.json`: Fue una herramienta de auditoría, ya no es necesaria tras la migración dinámica.
    - `.git/`: Si vas a inicializar un nuevo repositorio.

- **Archivos CRÍTICOS (NO ELIMINAR)**:
    - `src/`: Todo el código fuente.
    - `public/`: Assets estáticos, robots.txt, sitemap base.
    - `scripts/generate-sitemap.js`: Lógica esencial de SEO.
    - `package.json`: Configuración y dependencias.

---

---

## 🔐 7. Administración y Seguridad
- **URL del Panel**: `TU_DOMINIO/paneladmin`
- **Gestión de Usuarios**: Los administradores se crean en Supabase (Authentication > Users). El sistema detectará automáticamente si el correo existe en la tabla `profiles` para dar permisos de edición.
- **Cambio de claves**: Se recomienda cambiar la contraseña de Supabase apenas se realice el despliegue.

---

## 🌐 8. Compra y Configuración de Dominio (Vercel)
Si el cliente no tiene un dominio y desea comprarlo directamente a través de **Vercel**:

1. Entra al panel de tu proyecto en Vercel.
2. Ve a la pestaña **Settings > Domains**.
3. Haz clic en el botón **"Add"**.
4. Escribe el nombre del dominio deseado. Vercel te dará la opción de **"Buy"** si está disponible.
5. Sigue los pasos de pago. Vercel configurará automáticamente los registros DNS.
6. **MUY IMPORTANTE**: Una vez tengas el dominio (ej. `www.gamedoctor.com.uy`), ve a **Settings > Environment Variables** en Vercel y actualiza el valor de `VITE_SITE_URL` con la nueva dirección.
7. Haz un **Redeploy** del proyecto para que el Sitemap y los metadatos SEO se regeneren con el nuevo dominio.

---

> [!IMPORTANT]
> **Portabilidad**: Gracias a la refactorización realizada, este sitio no tiene URLs hardcodeadas. Cambiando un solo valor en el `.env`, el sitio completo se adapta al nuevo dominio.

> [!TIP]
> **Soporte**: El proyecto utiliza **Vite + React + Tailwind CSS**. Es un stack estándar, por lo que cualquier desarrollador moderno podrá mantenerlo fácilmente.
