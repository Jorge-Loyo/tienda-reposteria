#!/bin/bash

# Script para actualizar dependencias vulnerables
echo "Actualizando dependencias vulnerables..."

# Actualizar dependencias críticas (sin @latest)
npm update next
npm update @prisma/client
npm update prisma
npm update axios
npm update jose
npm update zod

# Actualizar dependencias de desarrollo
npm update @types/node
npm update typescript
npm update eslint

# Ejecutar audit para verificar vulnerabilidades
npm audit

# Si hay vulnerabilidades que se pueden arreglar automáticamente
npm audit fix

echo "Actualización completada. Revisa el output de npm audit."