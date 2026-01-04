# Guía de Gestión de Eventos - MedellinJS

Esta guía explica cómo usar el sistema de gestión de eventos de MedellinJS a través del panel de administración de PayloadCMS.

## Acceso al Panel de Administración

1. Navega a `/admin` en tu navegador
2. Inicia sesión con tus credenciales de administrador
3. Verás el panel principal con todas las colecciones disponibles

## Colecciones Disponibles

### 📅 Events (Eventos)
Gestiona todos los eventos de la comunidad MedellinJS.

### 🎤 Speakers (Ponentes)
Gestiona los perfiles de los speakers que participan en eventos.

### 👥 Members (Miembros)
Gestiona los perfiles de miembros de la comunidad.

### 📁 Media (Medios)
Gestiona imágenes y archivos multimedia.

### 👤 Users (Usuarios)
Gestiona usuarios administrativos con acceso al panel.

---

## Cómo Crear un Nuevo Evento

### Paso 1: Crear Speakers (si es necesario)

Antes de crear un evento, asegúrate de que los speakers existan en el sistema:

1. Ve a la colección **Speakers** en el menú lateral
2. Haz clic en **Create New**
3. Completa los campos:
   - **Nombre completo** *(requerido)*: Nombre del speaker
   - **Cargo o rol** *(requerido)*: Ej: "Frontend Developer", "Tech Lead"
   - **Empresa**: Empresa donde trabaja (opcional)
   - **Foto del speaker**: Sube una imagen de perfil (preferiblemente cuadrada)
   - **Enlace externo**: LinkedIn, Twitter, sitio web personal (opcional)
   - **Biografía**: Breve descripción del speaker (opcional)
4. Haz clic en **Save**

**Nota**: Los speakers pueden reutilizarse en múltiples eventos. Si editas un speaker, los cambios se reflejarán en todos los eventos donde participa.

### Paso 2: Crear el Evento

1. Ve a la colección **Events** en el menú lateral
2. Haz clic en **Create New**
3. Completa los campos principales:

#### Información Básica
- **Título del evento** *(requerido)*: Nombre descriptivo del evento
- **Slug (URL)**: Se genera automáticamente desde el título. Puedes editarlo si es necesario.
- **Descripción** *(requerido)*: Descripción completa del evento. Soporta formato rico (negritas, enlaces, listas, etc.)
- **Imagen de portada**: Imagen principal del evento para preview y detalle

#### Fecha y Hora
- **Fecha y hora de inicio** *(requerido)*: Cuándo comienza el evento
- **Fecha y hora de finalización**: Cuándo termina el evento (opcional)
- **Zona horaria** *(requerido)*: Por defecto "America/Bogota"

#### Lugar del Evento
- **Nombre del lugar** *(requerido)*: Ej: "Ruta N", "Centro de Innovación", "Virtual"
- **URL de Google Maps**: Enlace a Google Maps con la ubicación exacta (opcional)
- **Información adicional**: Detalles extra: piso, sala, indicaciones (opcional)

#### Speakers
- **Speakers**: Selecciona uno o más speakers del listado. Puedes buscar por nombre.

#### Asistentes
- **Asistentes confirmados**: Lista de personas que asistieron al evento
  - Para cada asistente:
    - **Nombre** *(requerido)*
    - **URL del avatar**: Foto de perfil del asistente (opcional)

#### Registro
- **URL de registro**: Enlace para registrarse (Meetup, Eventbrite, etc.)

#### Estado y Visibilidad
- **Estado** *(requerido)*:
  - **Próximo**: El evento aún no ha comenzado
  - **En progreso**: El evento está ocurriendo ahora
  - **Completado**: El evento ya finalizó
  - **Cancelado**: El evento fue cancelado

- **Publicado** *(sidebar)*: Marca esta casilla para que el evento sea visible al público
- **Destacado** *(sidebar)*: Marca para que aparezca en la página principal
- **Capacidad máxima** *(sidebar)*: Número máximo de asistentes (opcional)

#### Etiquetas
- **Etiquetas**: Categoriza el evento (React, Node.js, Workshop, etc.)
  - Haz clic en "Add Etiquetas" para agregar cada etiqueta

4. Haz clic en **Save** o **Save Draft**

### Paso 3: Publicar el Evento

Para que el evento sea visible al público:

1. Asegúrate de que el campo **Publicado** esté marcado (en el sidebar)
2. Guarda los cambios
3. El evento aparecerá automáticamente en `/events`

---

## Gestión de Speakers

### Crear un Nuevo Speaker

1. Ve a **Speakers** → **Create New**
2. Completa los campos requeridos (nombre, rol)
3. Sube una foto de perfil (recomendado: imagen cuadrada, mínimo 400x400px)
4. Agrega enlaces a redes sociales o sitio web
5. Guarda

### Editar un Speaker Existente

1. Ve a **Speakers**
2. Busca y selecciona el speaker
3. Edita los campos necesarios
4. Guarda los cambios

**Importante**: Los cambios se propagarán automáticamente a todos los eventos donde el speaker participa.

### Asignar Speakers a Eventos

1. Al crear o editar un evento, ve al campo **Speakers**
2. Haz clic en el selector y busca el speaker por nombre
3. Selecciona uno o más speakers
4. Los speakers aparecerán en el detalle del evento con su foto, nombre, rol, empresa y enlace

---

## Gestión de Asistentes

### Agregar Asistentes a un Evento

1. Edita el evento
2. Ve a la sección **Asistentes confirmados**
3. Haz clic en **Add Asistentes confirmados**
4. Completa:
   - **Nombre**: Nombre del asistente
   - **URL del avatar**: Foto de perfil (opcional)
5. Repite para agregar más asistentes
6. Guarda

### Importar Lista de Asistentes

Si tienes una lista grande de asistentes:

1. Prepara los datos en formato JSON o CSV
2. Usa la API de Payload para importarlos en batch (requiere desarrollo adicional)
3. O agrégalos manualmente uno por uno

**Nota**: Si hay más de 30 asistentes, la página pública mostrará un botón "Ver más" para cargar el resto.

---

## Páginas Públicas

### Listado de Eventos: `/events`
- Muestra todos los eventos publicados
- Ordenados por fecha (más recientes primero)
- Tarjetas con imagen, título, fecha, lugar y estado
- Eventos pasados aparecen con menor opacidad y badge "Finalizado"
- Eventos destacados muestran badge "Destacado"

### Detalle de Evento: `/events/:slug`
- Muestra información completa del evento
- Hero image grande
- Descripción completa con formato rico
- Fecha, hora y zona horaria
- Lugar con enlace a Google Maps
- Botón de registro (si aplica y el evento es próximo)
- Grid de speakers con fotos circulares, nombre, rol, empresa y enlace
- Etiquetas del evento
- Grid de asistentes con avatares

---

## SEO y Redes Sociales

Cada evento automáticamente incluye:

- **Meta tags** para SEO (título, descripción)
- **Open Graph tags** para Facebook/LinkedIn
- **Twitter Card tags** para Twitter
- **JSON-LD Schema.org** para Google Rich Results
  - Incluye información del evento
  - Speakers como "performers"
  - Lugar del evento
  - Fechas y horarios
  - Información de registro

Para verificar que el SEO funciona correctamente:
1. Publica un evento
2. Visita la página del evento
3. Inspecciona el código fuente (Ver → Código fuente)
4. Busca las etiquetas `<meta property="og:` y `<script type="application/ld+json">`
5. Usa [Google Rich Results Test](https://search.google.com/test/rich-results) para validar

---

## Revalidación y Caché

Las páginas públicas usan **ISR (Incremental Static Regeneration)** con revalidación cada 60 segundos:

- Los cambios en eventos pueden tardar hasta 1 minuto en aparecer en producción
- En desarrollo, los cambios son inmediatos
- Las páginas de eventos pasados se generan estáticamente para mejor rendimiento

---

## Consejos y Mejores Prácticas

### Imágenes
- **Eventos**: Usa imágenes horizontales (16:9) de al menos 1200x675px
- **Speakers**: Usa imágenes cuadradas de al menos 400x400px
- **Formato**: JPG o PNG, optimizadas (< 500KB)

### Descripciones
- Usa formato rico para hacer descripciones más legibles
- Incluye información clave: qué se aprenderá, requisitos, agenda
- Mantén descripciones entre 200-500 palabras

### Slugs
- Se generan automáticamente desde el título
- Puedes editarlos manualmente si es necesario
- Usa slugs descriptivos y cortos
- Evita caracteres especiales

### Estados
- Marca eventos como "Completado" después de que ocurran
- Actualiza el estado a "En progreso" durante el evento (opcional)
- Marca "Cancelado" si el evento no se realizará

### Publicación
- Crea eventos como borrador (sin marcar "Publicado") mientras los preparas
- Marca "Publicado" solo cuando estés listo para que el público lo vea
- Usa "Destacado" para eventos importantes que quieres resaltar

---

## Solución de Problemas

### El evento no aparece en `/events`
- Verifica que el campo **Publicado** esté marcado
- Espera hasta 60 segundos para que la caché se actualice
- Verifica que no haya errores en el servidor

### Las imágenes no se muestran
- Asegúrate de haber subido la imagen a la colección **Media**
- Verifica que la imagen esté seleccionada en el campo correspondiente
- Revisa que el archivo no sea demasiado grande (< 5MB)

### Los speakers no aparecen
- Verifica que hayas seleccionado speakers en el campo **Speakers**
- Asegúrate de que los speakers existan en la colección **Speakers**
- Guarda el evento después de agregar speakers

### Cambios no se reflejan
- Espera 60 segundos (tiempo de revalidación ISR)
- Recarga la página con Ctrl+F5 (forzar recarga sin caché)
- Verifica que hayas guardado los cambios en el admin

---

## Contacto y Soporte

Si tienes problemas o preguntas:
- Revisa esta guía primero
- Contacta al equipo técnico de MedellinJS
- Reporta bugs en el repositorio de GitHub

---

**Última actualización**: Enero 2026

