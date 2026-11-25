---
slug: wealthos
translationId: wealthos
projectType: personal
title: WealthOS
description: Plataforma de finanzas personales enfocada en seguimiento de transacciones y automatización financiera inteligente.
category: Proyecto personal / Tecnología financiera
technologies: [Next.js, NestJS, TypeScript, PostgreSQL, PWA]
coverAlt: Pantalla de inicio de sesión de WealthOS con una introducción color borgoña y un formulario oscuro.
coverImage: ../../../assets/projects/wealthos-sign-in.png
demoUrl: https://wealth-os-pwa.vercel.app/
featured: true
order: 1
presentation: feature
language: es
draft: false
---
## El producto

WealthOS es mi aplicación de finanzas personales para seguir cuentas, transacciones, categorías, presupuestos y metas. Su enfoque de ingeniería es mantener flujos financieros útiles cuando cambia la conectividad y dar límites explícitos a la automatización.

Este caso describe el código inspeccionado de la aplicación. Distingue lo implementado de la configuración de despliegue y no afirma que todas las integraciones estén habilitadas públicamente.

## Arquitectura

El frontend usa Next.js App Router, React y TypeScript. TanStack Query gestiona datos remotos, Zustand mantiene estado de aplicación y Dexie provee una base IndexedDB para registros locales y operaciones pendientes. Una API separada en NestJS usa Prisma con PostgreSQL.

La separación permite que frontend y backend evolucionen de forma independiente, pero exige un contrato de API deliberado. El navegador debe representar escrituras pendientes, operaciones rechazadas y conflictos sin asumir que una edición local ya fue confirmada de forma remota.

## Escritura sin conexión

Editar una transacción actualiza el almacenamiento local y agrega una operación al outbox. La operación conserva propietario, payload, clave de idempotencia, versión base y estado de reintento. También puede depender de escrituras anteriores.

La sincronización se ejecuta al recuperar conectividad, enfocar la ventana y mediante un temporizador. Reclama operaciones pendientes antes de enviarlas para evitar que una edición simultánea reemplace silenciosamente el payload en proceso.

### Reintentos y operaciones duplicadas

Los reintentos usan la misma clave de idempotencia. Los fallos transitorios aplican backoff exponencial con jitter. Las ediciones pendientes pueden combinarse y crear y luego borrar un registro aún no sincronizado puede eliminar la creación pendiente.

### Ediciones concurrentes

Las actualizaciones envían la versión base mediante `If-Match`. Ante un conflicto, el cliente compara el snapshot original, los cambios locales y el estado del servidor. Los cambios independientes pueden reintentarse; los campos en conflicto quedan disponibles para resolución explícita.

## Separación entre shell y datos financieros

El service worker precarga rutas, scripts, estilos, íconos y fuentes. Excluye respuestas de API, mutaciones, tokens y solicitudes de React Server Components.

Los registros financieros y operaciones pendientes viven en almacenes IndexedDB asociados al usuario. El primer inicio de sesión requiere conexión y los datos sin conexión dependen de haber sido cargados previamente.

## Ingesta de transacciones por correo

El backend incluye una integración con Gmail mediante OAuth, reglas por banco, registros de importación y ejecuciones de sincronización. Primero lee metadatos, aplica reglas habilitadas y extrae una transacción candidata de los mensajes coincidentes.

La aprobación manual es el valor predeterminado. El modo automático es una configuración separada y depende de las validaciones del servicio. El fallback de extracción con DeepSeek existe en el código, pero está condicionado por configuración; su presencia no demuestra que esté activo en producción.

## Validación y privacidad

Los valores financieros usan campos decimales en PostgreSQL. El frontend valida con Zod y la API incluye DTOs, controles de autorización y versiones optimistas.

Los tokens de acceso permanecen en memoria y las sesiones de renovación usan cookies HttpOnly. Estas son fronteras de implementación, no una afirmación de auditoría externa de seguridad.

## Despliegue y estado actual

El enlace público del frontend está alojado en Vercel. El repositorio de la API documenta Render y Neon, incluidas migraciones separadas. Se inspeccionaron esas instrucciones, pero no la configuración viva del backend.

## Aprendizajes de ingeniería

La decisión central equilibra una experiencia local inmediata con la complejidad de reconciliarla con un backend compartido. El outbox, las versiones y el estado de conflictos hacen explícita esa complejidad.
