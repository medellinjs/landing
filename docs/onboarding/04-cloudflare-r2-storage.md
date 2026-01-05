# Guía: Configurar Cloudflare R2 para imágenes (Payload CMS + Vercel)

Esta guía te explica cómo configurar **Cloudflare R2** (sin cuenta de AWS/S3) para almacenar las imágenes de **Payload CMS** cuando tu app corre en **Vercel**.

> ¿Por qué es necesario? En Vercel (serverless) el disco es **efímero**. Si Payload guarda archivos en el filesystem, luego no existen y las rutas tipo `/api/media/file/...` fallan en producción.

---

## Requisitos

- Proyecto en Vercel (ya desplegado o listo para desplegar)
- Payload CMS con colección `media` (`upload: true`)
- Cuenta en Cloudflare (gratuita) con acceso a **R2 Object Storage**

---

## 1) Crear el bucket en Cloudflare R2

1. Entra al **dashboard de Cloudflare**
2. Ve a **R2** → **Create bucket**
3. Ponle un nombre (ejemplo: `medellinjs-media`)
4. Crea el bucket

**Recomendación**: usa un bucket dedicado solo para uploads del sitio.

---

## 2) Crear credenciales (Access Key / Secret) para R2

1. En Cloudflare → **R2**
2. Ve a la sección **API** (o “R2 API Tokens / S3 API credentials” según el panel)
3. Crea un token/credencial con permisos para tu bucket:
   - **Read**
   - **Write**
4. Copia y guarda:
   - **Access Key ID**
   - **Secret Access Key**

> Guarda el Secret en un lugar seguro. No lo subas a GitHub.

---

## 3) Obtener el endpoint S3 de R2

Cloudflare R2 es compatible con el protocolo S3, por eso Payload usa el adapter “S3”.

Tu endpoint suele verse así:

`https://<accountId>.r2.cloudflarestorage.com`

Cloudflare te lo muestra en la misma sección de API / S3.

---

## 4) Definir cómo serán públicas las URLs de las imágenes

Tu frontend usa `media.url` (generado por Payload). Para que el navegador pueda cargar esas imágenes necesitas un hostname **público**.

Tienes dos opciones:

### Opción A (simple): dominio público de R2 (`r2.dev`)

- Cloudflare te puede dar un hostname tipo: `pub-xxxxx.r2.dev`
- Ventaja: rápido de configurar
- Desventaja: menos “marca” que un dominio propio

### Opción B (recomendado): dominio propio (ej: `assets.medellinjs.org`)

- Crea un subdominio y apúntalo a Cloudflare
- Configura ese dominio como público para servir objetos del bucket
- Ventaja: control total de la URL y cache/CDN

Al final vas a necesitar este valor para Next/Image:

- `S3_PUBLIC_HOSTNAME` = **hostname público** (sin `https://`)

Ejemplos:

- `pub-xxxxx.r2.dev`
- `assets.medellinjs.org`

---

## 5) Configurar variables de entorno en Vercel

En Vercel → **Project** → **Settings** → **Environment Variables**

Agrega estas variables (al menos en **Production**; ideal también en Preview):

- `S3_ENDPOINT` = `https://<accountId>.r2.cloudflarestorage.com`
- `S3_BUCKET` = `medellinjs-media` (o tu nombre de bucket)
- `S3_ACCESS_KEY_ID` = tu Access Key ID
- `S3_SECRET_ACCESS_KEY` = tu Secret Access Key
- `S3_REGION` = `auto`
- `S3_PUBLIC_HOSTNAME` = tu hostname público (ej: `pub-xxxxx.r2.dev`)

Luego, **redeploy** (nuevo deploy) para que Vercel tome los env vars.

---

## 6) Probar que funciona (Admin + Frontend)

1. Entra a `https://<tu-dominio>/admin`
2. Ve a la colección **Media**
3. Sube una imagen nueva
4. Verifica:
   - Que el documento `media` se crea correctamente
   - Que `media.url` apunta a tu hostname público
   - Que al abrir `media.url` en una pestaña se ve la imagen (HTTP 200)
   - Que el frontend renderiza la imagen sin errores de `next/image`

---

## 7) Migración: imágenes antiguas (IMPORTANTE)

Si subiste imágenes **antes** (cuando se guardaban localmente), esos archivos estaban en tu máquina o en un disco no persistente.

Para que aparezcan en producción:

- **Re-sube** esos archivos en la colección `Media` (o edita cada item y vuelve a subir el archivo)

Después de re-subir, las relaciones (Speakers/Events) deberían empezar a mostrarlas correctamente si están apuntando al nuevo `media.url`.

---

## Troubleshooting rápido

### Build / runtime rompe con: `column "prefix" does not exist`

Esto significa que tu tabla `media` en Postgres **no tiene una columna que Payload espera** para uploads (por ejemplo al usar storage adapters).

**Solución rápida (SQL seguro e idempotente)**: agrega la columna faltante.

Si usas Vercel Postgres:

1. Vercel → **Storage** → **Postgres** → **Query**
2. Ejecuta:

```sql
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" text;
```

Alternativa por consola (si tienes `psql` y `POSTGRES_URL`):

```bash
psql "$POSTGRES_URL" -c 'ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" text;'
```

Luego vuelve a correr el build / redeploy.

### “500 /api/media/file/...” en producción

- Falta configurar el storage en Vercel (revisa `S3_*`)
- El bucket/objetos no son públicos (o el `S3_PUBLIC_HOSTNAME` no corresponde)
- El deploy no tomó env vars (haz redeploy)

### Next/Image muestra “400 Bad Request”

- `next.config.mjs` necesita permitir el hostname de R2
- Asegúrate de definir `S3_PUBLIC_HOSTNAME` correctamente (solo el hostname)

---

## Checklist final

- [ ] Bucket creado en R2
- [ ] Access Key ID / Secret creados con permisos Read/Write
- [ ] `S3_ENDPOINT` correcto (r2.cloudflarestorage.com)
- [ ] `S3_PUBLIC_HOSTNAME` apunta a una URL pública (r2.dev o dominio propio)
- [ ] Env vars cargadas en Vercel + redeploy
- [ ] Upload nuevo funciona en `/admin` y se ve en frontend


