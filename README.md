# Proyecto 1 - Bases de Datos 2

**Instituto Tecnológico de Costa Rica**
**Curso:** Bases de Datos 2
**Profesor:** Cristian Paz Campos Agüero
**Fecha de entrega:** 4 de octubre de 2026
**Hora de entrega:** 10:00 p. m.

## Integrantes

* Alice Arias Salazar - 20231904639
* Heldyis Agüero Espinoza - 2023296812

## Objetivos alcanzados

* Desarrollo de una aplicación web utilizando React.
* Desarrollo de una API utilizando Node.js y Express.
* Integración de la aplicación web con SQL Server mediante la API.
* Implementación de los módulos de Clientes, Proveedores, Inventario, Ventas y Reportes.
* Implementación de filtros acumulativos en los diferentes módulos.
* Implementación de ventanas de detalle para consultar información específica.
* Implementación de operaciones de gestión mediante procedimientos almacenados.
* Creación y utilización de sinónimos para acceder a las tablas de la base de datos.
* Implementación de transacciones utilizando `TRANSACTION`, `COMMIT` y `ROLLBACK` en las operaciones correspondientes.
* Implementación de consultas estadísticas.
* Uso de `ROLLUP` para agrupaciones y totales.
* Uso de `DENSE_RANK` y `PARTITION BY` para generar rankings.
* Implementación de validaciones de datos.
* Implementación de mensajes de error para informar al usuario sobre problemas durante las operaciones.
* Organización del proyecto en las carpetas `Script`, `Api` y `WebSite`.
* Implementación de consultas y procesamiento de datos principalmente en SQL Server, evitando realizar la transformación de información directamente en la aplicación web.

## Objetivos no alcanzados

* No se implementó la eliminación de ventas, debido a que esta operación no se encuentra contemplada dentro de las operaciones permitidas para las ventas del proyecto.

## Manual de Usuario

### 1. Requisitos previos

Para ejecutar correctamente el proyecto se debe contar con:

* Node.js instalado.
* SQL Server instalado y funcionando.
* La base de datos utilizada por el proyecto creada y configurada.
* El código fuente del proyecto descargado o clonado.
* Las dependencias de Node.js instaladas en las carpetas `Api` y `WebSite`.

### 2. Estructura del proyecto

El proyecto se encuentra organizado en tres carpetas principales:

* **`Script`**: contiene los scripts de SQL utilizados para la creación, configuración y funcionamiento de la base de datos.
* **`Api`**: contiene el servidor desarrollado con Node.js y Express, encargado de comunicarse con SQL Server y proporcionar los servicios utilizados por la aplicación web.
* **`WebSite`**: contiene la aplicación web desarrollada con React.

### 3. Ejecución de la API

Primero se debe abrir una terminal y ubicarse dentro de la carpeta `Api`.

```bash
cd Api
```

Luego se deben instalar las dependencias del proyecto, en caso de que no se hayan instalado anteriormente:

```bash
npm install
```

Una vez instaladas las dependencias, se inicia la API mediante:

```bash
npm run dev
```

La API debe permanecer ejecutándose durante el uso de la aplicación web, ya que la aplicación React utiliza sus servicios para realizar las consultas y operaciones sobre la base de datos.

### 4. Ejecución de la aplicación web

Con la API ejecutándose, se debe abrir una segunda terminal y ubicarse dentro de la carpeta `WebSite`.

```bash
cd WebSite
```

Se instalan las dependencias:

```bash
npm install
```

Después se inicia la aplicación mediante:

```bash
npm run dev
```

El comando mostrará en la terminal la dirección local donde se encuentra disponible la aplicación. Esta dirección debe abrirse en un navegador web.

### 5. Inicio de sesión y acceso a la aplicación

Al ingresar a la aplicación se muestra la interfaz principal del sistema. Desde ella se puede acceder a los diferentes módulos disponibles.

Los módulos implementados son:

* Clientes
* Proveedores
* Inventario
* Ventas
* Reportes

### 6. Módulo de Clientes

El módulo de Clientes permite consultar y administrar la información relacionada con los clientes.

El usuario puede utilizar los filtros disponibles para realizar búsquedas. Los filtros son acumulativos, por lo que se pueden utilizar varios al mismo tiempo para obtener resultados más específicos.

También es posible seleccionar un cliente para consultar su información detallada y utilizar las opciones de gestión disponibles en el módulo.

### 7. Módulo de Proveedores

El módulo de Proveedores permite consultar y administrar la información de los proveedores registrados.

El usuario puede utilizar los filtros disponibles para encontrar proveedores específicos. Al realizar una búsqueda con varios filtros, estos se aplican de manera acumulativa.

También se dispone de opciones para consultar información detallada y realizar las operaciones permitidas sobre los proveedores.

### 8. Módulo de Inventario

El módulo de Inventario permite consultar la información relacionada con los productos y sus existencias.

El usuario puede utilizar los filtros para localizar productos y consultar la cantidad disponible. La información presentada permite conocer el estado del inventario y realizar las operaciones correspondientes.

### 9. Módulo de Ventas

El módulo de Ventas permite consultar y gestionar las operaciones de venta contempladas en el proyecto.

El usuario puede consultar la información de las ventas y utilizar los filtros disponibles para localizar registros específicos.

Las operaciones permitidas se realizan mediante procedimientos almacenados en SQL Server. La eliminación de ventas no se encuentra disponible, debido a que esta operación no forma parte de las operaciones establecidas para este módulo.

### 10. Módulo de Reportes

El módulo de Reportes permite consultar información estadística generada a partir de los datos almacenados en la base de datos.

Se incluyen consultas que utilizan agrupaciones, totales y rankings para presentar información de forma resumida y facilitar su análisis.

Entre las funcionalidades utilizadas se encuentran:

* Agrupaciones y totales mediante `ROLLUP`.
* Rankings mediante `DENSE_RANK`.
* Segmentación de información mediante `PARTITION BY`.
* Consultas estadísticas.

### 11. Mensajes de validación y errores

La aplicación cuenta con validaciones para evitar que se ingresen datos incorrectos o incompletos.

Cuando una operación no puede realizarse, el sistema muestra un mensaje indicando el problema para que el usuario pueda corregir la información ingresada.

Las operaciones realizadas sobre la base de datos utilizan procedimientos almacenados y, en los casos correspondientes, transacciones para mantener la integridad de la información.

### 12. Flujo general de ejecución

Para utilizar el sistema correctamente se deben mantener abiertas dos terminales:

**Terminal 1 — API**

```bash
cd Api
npm run dev
```

**Terminal 2 — Aplicación web**

```bash
cd WebSite
npm run dev
```

Una vez ejecutados ambos servicios, se abre en el navegador la dirección indicada por Vite para acceder a la aplicación.

## Video de la aplicación

[Ver video en YouTube](ENLACE_AQUI)
