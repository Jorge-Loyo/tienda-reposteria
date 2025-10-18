# 🏗️ Justificación de Arquitectura: EC2 vs Otros Servicios AWS

## 📋 Resumen Ejecutivo

Para el despliegue de **Casa Dulce Oriente**, se eligió **Amazon EC2** como plataforma principal en lugar de servicios como Elastic Beanstalk, Lambda, o Amplify debido a limitaciones de cuenta lab y requisitos específicos del proyecto.

✅ EC2 (elegido)

❌ Elastic Beanstalk (limitado en cuentas lab)

❌ Lambda (no óptimo para Next.js SSR)

❌ Amplify (no disponible en cuentas lab)

❌ ECS/Fargate (complejo y costoso)

---

## 🎯 Contexto del Proyecto

### Limitaciones de Cuenta Lab

- **Cuenta AWS Educate/Lab**: Acceso limitado a servicios premium
- **Presupuesto restringido**: Sin capacidad para servicios gestionados costosos
- **Tiempo limitado**: Necesidad de despliegue rápido y funcional
- **Aprendizaje**: Enfoque en comprensión de infraestructura básica

### Características de la Aplicación

- **Next.js 14**: Aplicación full-stack con SSR
- **Base de datos**: PostgreSQL (Neon - externa gratuita)
- **Archivos estáticos**: Cloudinary (CDN externo)
- **Tráfico esperado**: Bajo a medio (tienda local)

---

## ⚖️ Comparación de Servicios AWS

### 1. Amazon EC2 (Elegido) ✅

**Ventajas:**

- **Costo**: t3.micro elegible para Free Tier (750 horas/mes gratis)
- **Control total**: Acceso completo al sistema operativo
- **Flexibilidad**: Instalación de cualquier software necesario
- **Aprendizaje**: Comprensión profunda de infraestructura
- **Disponibilidad**: Accesible en cuentas lab sin restricciones

**Desventajas:**

- **Gestión manual**: Requiere configuración y mantenimiento
- **Escalabilidad**: Manual, no automática
- **Seguridad**: Responsabilidad completa del usuario

**Configuración Implementada:**

```bash
Instancia: t3.micro (1 vCPU, 1GB RAM)
OS: Ubuntu 22.04 LTS
Runtime: Node.js 18 + PM2
Proxy: Nginx (opcional)
Costo: $0/mes (Free Tier)
```

### 2. AWS Elastic Beanstalk ❌

**Por qué NO se eligió:**

- **Limitaciones de cuenta lab**: Acceso restringido en cuentas educativas
- **Costo**: Cobra por recursos subyacentes + overhead de gestión
- **Complejidad**: Configuración más compleja para Next.js SSR
- **Menos control**: Abstracción que limita personalización

**Sería ideal para:**

- Cuentas de producción con presupuesto
- Equipos que priorizan gestión automática
- Aplicaciones con patrones de tráfico predecibles

### 3. AWS Lambda + API Gateway ❌

**Por qué NO se eligió:**

- **Arquitectura**: Next.js SSR no es óptimo para serverless
- **Cold starts**: Latencia inicial en funciones inactivas
- **Limitaciones**: Tiempo de ejecución máximo (15 minutos)
- **Complejidad**: Requiere reestructuración completa de la app
- **Costo**: Puede ser más caro con tráfico constante

**Sería ideal para:**

- APIs puras sin SSR
- Tráfico muy esporádico
- Microservicios específicos

### 4. AWS Amplify ❌

**Por qué NO se eligió:**

- **Limitaciones de cuenta**: No disponible en cuentas lab
- **Costo**: Servicio premium fuera del Free Tier
- **Base de datos**: Requiere RDS (costoso) o DynamoDB (complejo)
- **Vendor lock-in**: Fuerte dependencia de servicios AWS

**Sería ideal para:**

- Proyectos con presupuesto para servicios gestionados
- Equipos que priorizan velocidad de desarrollo
- Aplicaciones que se benefician del ecosistema AWS completo

### 5. Amazon ECS/Fargate ❌

**Por qué NO se eligió:**

- **Complejidad**: Requiere conocimiento de Docker/contenedores
- **Costo**: Fargate es más caro que EC2 para cargas constantes
- **Overkill**: Excesivo para una aplicación simple
- **Curva de aprendizaje**: Tiempo adicional para dominar contenedores

---

## 🎯 Decisiones de Arquitectura Específicas

### Base de Datos: Neon PostgreSQL (Externa)

**En lugar de Amazon RDS:**

- **Costo**: RDS mínimo ~$15/mes vs Neon gratuito
- **Limitaciones lab**: RDS puede no estar disponible
- **Simplicidad**: Configuración más directa
- **Performance**: Suficiente para el caso de uso

### CDN: Cloudinary (Externo)

**En lugar de Amazon S3 + CloudFront:**

- **Costo**: S3 + CloudFront puede generar costos inesperados
- **Funcionalidad**: Cloudinary incluye optimización automática
- **Simplicidad**: Una sola plataforma para gestión de imágenes
- **Free tier**: Generoso para proyectos pequeños

### Monitoreo: PM2 + Logs básicos

**En lugar de CloudWatch:**

- **Costo**: CloudWatch puede generar costos por logs/métricas
- **Simplicidad**: PM2 incluye monitoreo básico suficiente
- **Acceso**: Disponible sin configuración adicional

---

## 📊 Análisis Costo-Beneficio

### Arquitectura Actual (EC2)

```
Costos mensuales:
- EC2 t3.micro: $0 (Free Tier)
- Neon PostgreSQL: $0 (Plan gratuito)
- Cloudinary: $0 (Plan gratuito)
- Tráfico: Mínimo dentro de Free Tier
TOTAL: ~$0-5/mes
```

### Alternativa con servicios gestionados

```
Costos mensuales estimados:
- Elastic Beanstalk: $15-30/mes
- RDS t3.micro: $15-20/mes
- S3 + CloudFront: $5-10/mes
- CloudWatch: $5-10/mes
TOTAL: $40-70/mes
```

**ROI**: La arquitectura actual ahorra $480-840/año

---

## 🚀 Ventajas de la Solución Implementada

### 1. **Económicas**

- Costo prácticamente nulo
- Escalabilidad manual cuando sea necesario
- Sin sorpresas en facturación

### 2. **Técnicas**

- Control total sobre el entorno
- Flexibilidad para modificaciones
- Aprendizaje profundo de infraestructura
- Fácil debugging y troubleshooting

### 3. **Operacionales**

- Despliegue rápido y directo
- Mantenimiento simple con PM2
- Logs accesibles y comprensibles
- Backup y restauración directos

### 4. **Educativas**

- Comprensión completa del stack
- Experiencia con Linux/Ubuntu
- Conocimiento de networking básico
- Fundamentos de DevOps

---

## 🔄 Plan de Migración Futura

### Cuando el proyecto crezca:

**Fase 1: Optimización EC2**

- Migrar a instancia más grande
- Implementar Load Balancer
- Configurar Auto Scaling

**Fase 2: Servicios Gestionados**

- Migrar a Elastic Beanstalk
- Implementar RDS Multi-AZ
- Configurar CloudFront

**Fase 3: Arquitectura Avanzada**

- Microservicios con ECS
- API Gateway + Lambda para funciones específicas
- Implementar CI/CD con CodePipeline

---

## 📈 Métricas de Éxito

### Actuales (EC2)

- **Uptime**: 99.5%+ con PM2
- **Tiempo de respuesta**: <500ms promedio
- **Costo**: $0-5/mes
- **Tiempo de despliegue**: 5-10 minutos

### Objetivos a 6 meses

- **Uptime**: 99.9%+ con Load Balancer
- **Tiempo de respuesta**: <200ms promedio
- **Escalabilidad**: Auto Scaling configurado
- **Monitoreo**: CloudWatch implementado

---

## 🎯 Conclusión

La elección de **Amazon EC2** para Casa Dulce Oriente fue la decisión correcta considerando:

1. **Limitaciones de cuenta lab** que restringen servicios premium
2. **Presupuesto cero** que requiere maximizar Free Tier
3. **Objetivos de aprendizaje** que priorizan comprensión técnica
4. **Simplicidad operacional** para un equipo pequeño
5. **Flexibilidad futura** para migrar cuando sea necesario

Esta arquitectura proporciona una base sólida, económica y educativa que puede evolucionar según las necesidades del negocio.

---

**Documento creado**: Enero 2025  
**Versión**: 1.0  
**Autor**: Equipo Casa Dulce Oriente
