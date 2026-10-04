# Proyecto 1 - Bases de Datos 2

**Instituto Tecnológico de Costa Rica**
**Curso:** Bases de Datos 2
**Profesor:** Cristian Paz Campos Agüero
**Fecha de entrega:** 4 de octubre de 2026
**Hora de entrega:** 10:00 p. m.

## Integrantes

* Alice Arias Salazar - 20231904639
* Heldyis Agüero Espinoza - 2023296812

---

## Descripción general

Aplicación web para administrar **Clientes, Proveedores, Inventario, Ventas y Reportes** sobre la base de datos de ejemplo de Microsoft **WideWorldImporters**.

El sistema tiene tres partes que trabajan juntas:

| Parte | Tecnología | Para qué sirve |
|---|---|---|
| **Base de datos** | SQL Server (WideWorldImporters) | Guarda la información y contiene las reglas del negocio (procedimientos almacenados). |
| **API** (carpeta `Api`) | Node.js + Express | Recibe las peticiones de la página y las envía a la base de datos. |
| **Website** (carpeta `WebSite`) | React + Vite | La página que se ve en el navegador: menú lateral, tablas, filtros y botones. |

> **Importante:** las reglas (qué es obligatorio, qué rangos se permiten, qué no se puede borrar) viven en los **procedimientos almacenados (SP)**. La página solo muestra los mensajes que ellos devuelven.

---

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

---

# Manual de Usuario

## Índice

- [Proyecto 1 - Bases de Datos 2](#proyecto-1---bases-de-datos-2)
  - [Integrantes](#integrantes)
  - [Descripción general](#descripción-general)
  - [Objetivos alcanzados](#objetivos-alcanzados)
  - [Objetivos no alcanzados](#objetivos-no-alcanzados)
- [Manual de Usuario](#manual-de-usuario)
  - [Índice](#índice)
  - [1. Requisitos previos](#1-requisitos-previos)
  - [2. Estructura del proyecto](#2-estructura-del-proyecto)
  - [3. Descargar el proyecto desde GitHub](#3-descargar-el-proyecto-desde-github)
    - [Cómo abrir una terminal dentro de una carpeta](#cómo-abrir-una-terminal-dentro-de-una-carpeta)
  - [4. Preparar la base de datos](#4-preparar-la-base-de-datos)
  - [5. Ejecución de la API](#5-ejecución-de-la-api)
  - [6. Ejecución de la aplicación web](#6-ejecución-de-la-aplicación-web)
  - [7. Verificar los 3 puertos](#7-verificar-los-3-puertos)
  - [8. Cómo usar el sitio web](#8-cómo-usar-el-sitio-web)
    - [Mensajes de la página](#mensajes-de-la-página)
    - [Cómo funcionan los filtros (en todos los módulos)](#cómo-funcionan-los-filtros-en-todos-los-módulos)
  - [9. Módulo de Clientes](#9-módulo-de-clientes)
    - [Tabla general y filtros](#tabla-general-y-filtros)
    - [👁️ Ver](#️-ver)
    - [➕ Agregar y ✏️ Modificar](#-agregar-y-️-modificar)
    - [🗑️ Eliminar](#️-eliminar)
  - [10. Módulo de Proveedores](#10-módulo-de-proveedores)
    - [Tabla general y filtros](#tabla-general-y-filtros-1)
    - [👁️ Ver](#️-ver-1)
    - [➕ Agregar y ✏️ Modificar](#-agregar-y-️-modificar-1)
    - [🗑️ Eliminar](#️-eliminar-1)
  - [11. Módulo de Inventario](#11-módulo-de-inventario)
    - [Tabla general y filtros](#tabla-general-y-filtros-2)
    - [👁️ Ver](#️-ver-2)
    - [➕ Agregar y ✏️ Modificar](#-agregar-y-️-modificar-2)
    - [🗑️ Eliminar](#️-eliminar-2)
  - [12. Módulo de Ventas](#12-módulo-de-ventas)
    - [Tabla general y filtros](#tabla-general-y-filtros-3)
    - [👁️ Ver](#️-ver-3)
    - [➕ Agregar y ✏️ Modificar](#-agregar-y-️-modificar-3)
    - [🗑️ Eliminar](#️-eliminar-3)
  - [13. Módulo de Reportes](#13-módulo-de-reportes)
  - [14. Mensajes de validación y tipos de error](#14-mensajes-de-validación-y-tipos-de-error)
    - [Protección de los datos (transacciones)](#protección-de-los-datos-transacciones)
  - [15. Sinónimos usados en la base de datos](#15-sinónimos-usados-en-la-base-de-datos)
  - [16. Flujo general de ejecución](#16-flujo-general-de-ejecución)
  - [17. Detener el sistema](#17-detener-el-sistema)
  - [18. Problemas comunes](#18-problemas-comunes)
  - [19. Video de la aplicación](#19-video-de-la-aplicación)

---

## 1. Requisitos previos

Para ejecutar correctamente el proyecto se debe contar con:

* **Node.js** instalado (descargar la versión LTS desde <https://nodejs.org>). Al instalarlo también se instala `npm`.
* **SQL Server** instalado y funcionando.
* La base de datos **WideWorldImporters** creada y configurada.
* Una herramienta para ejecutar scripts SQL: **SQL Server Management Studio (SSMS)** o **Azure Data Studio**.
* El código fuente del proyecto descargado o clonado.
* Un navegador web (Chrome, Edge o Firefox).

Las dependencias de Node.js de las carpetas `Api` y `WebSite` se instalan con `npm install` (ver secciones 5 y 6).

## 2. Estructura del proyecto

El proyecto se encuentra organizado en tres carpetas principales:

* **`Script`**: contiene los scripts de SQL utilizados para la creación, configuración y funcionamiento de la base de datos (sinónimos y procedimientos almacenados).
* **`Api`**: contiene el servidor desarrollado con Node.js y Express, encargado de comunicarse con SQL Server y proporcionar los servicios utilizados por la aplicación web.
* **`WebSite`**: contiene la aplicación web desarrollada con React.

## 3. Descargar el proyecto desde GitHub

No necesita saber usar Git. Solo siga estos pasos:

1. Abra el enlace del repositorio en su navegador:

   **`[https://github.com/Alice-Arias/Proyecto-1-Base-de-datos-2.git]`**

2. Cerca de la parte superior derecha encontrará un botón verde que dice **`<> Code`**. Haga clic en él.
3. En el menú que se abre, haga clic en **`Download ZIP`**.
4. El navegador descargará un archivo `.zip` (normalmente a la carpeta *Descargas*).
5. **Extraiga el ZIP:**
   * **Windows:** clic derecho sobre el archivo → **Extraer todo…** → **Extraer**.
   * **Mac:** doble clic sobre el archivo.
6. Se creará una carpeta con el nombre del proyecto. **Entre a esa carpeta**: debe ver adentro las carpetas `Script`, `Api` y `WebSite`.

> ⚠️ No ejecute el proyecto desde dentro del ZIP. Siempre extráigalo primero.

### Cómo abrir una terminal dentro de una carpeta

Se necesitará en los pasos siguientes:

* **Windows:** abra la carpeta en el Explorador de archivos, haga clic en la **barra de direcciones** (arriba), escriba `cmd` y presione **Enter**. Se abrirá una ventana negra ya ubicada en esa carpeta.
* **Mac:** clic derecho sobre la carpeta → **Nuevo terminal en la carpeta**.

## 4. Preparar la base de datos

La base de datos debe llamarse **`WideWorldImporters`**. Abra SSMS o Azure Data Studio, conéctese a su SQL Server y ejecute los scripts de la carpeta **`Script`** **en este orden**:

| Orden | Script | Qué crea |
|---|---|---|
| 1 | Script de **sinónimos** | Los 22 nombres alternativos en español (ver [sección 15](#15-sinónimos-usados-en-la-base-de-datos)). **Debe ir primero**, porque los demás scripts usan estos nombres. |
| 2 | Script de **Clientes** | `SP_Clientes_Listar`, `_Detalle`, `_Insertar`, `_Actualizar`, `_Eliminar`, `_Opciones` |
| 3 | Script de **Inventario** | `SP_Inventarios_Listar`, `_Detalle`, `SP_Inventario_Insertar`, `_Actualizar`, `_Eliminar`, `_Opciones` |
| 4 | Script de **Proveedores** | `SP_Proveedores_Listar`, `_Detalle`, `_Insertar`, `_Actualizar`, `_Eliminar`, `_Opciones` |
| 5 | Script de **Ventas** | `SP_Ventas_Listar`, `_Detalle`, `_Insertar`, `_Actualizar`, `_Opciones` |
| 6 | Script de **Reportes** | Consultas estadísticas con `ROLLUP`, `DENSE_RANK` y `PARTITION BY` |

Cada script empieza con `USE WideWorldImporters; GO`, así que se ejecuta sobre la base correcta.

> 📝 **[AJUSTAR]** Si la API necesita datos de conexión (servidor, usuario, contraseña, nombre de la base), indique aquí en qué archivo se configuran (por ejemplo `Api/.env` o `Api/db.js`) y qué valores colocar.

## 5. Ejecución de la API

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

La API debe permanecer ejecutándose durante el uso de la aplicación web, ya que la aplicación React utiliza sus servicios para realizar las consultas y operaciones sobre la base de datos. **No cierre esta terminal.**

## 6. Ejecución de la aplicación web

Con la API ejecutándose, se debe abrir una **segunda terminal** y ubicarse dentro de la carpeta `WebSite`.

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

El comando mostrará en la terminal la dirección local donde se encuentra disponible la aplicación (normalmente algo como `http://localhost:5173`). **Esta dirección debe abrirse en un navegador web.** No cierre esta terminal mientras use el sistema.

## 7. Verificar los 3 puertos

Cuando todo está corriendo deben estar activos **3 puertos**, uno por cada parte del sistema:

| Servicio | Puerto | Cómo comprobarlo |
|---|---|---|
| **Base de datos** (SQL Server) | `[PUERTO_BD]` (por defecto `1433`) | No se abre en el navegador. Se conecta con SSMS / Azure Data Studio. |
| **API** (Node + Express) | `[PUERTO_API]` | La terminal de `Api` muestra en qué puerto quedó escuchando. |
| **Website** (React + Vite) | `[PUERTO_WEB]` (Vite suele usar `5173`) | La terminal de `WebSite` muestra la dirección. **Esta es la página que usted usará.** |

> 📝 **[AJUSTAR]** Reemplace `[PUERTO_BD]`, `[PUERTO_API]` y `[PUERTO_WEB]` por los números reales de su proyecto.

Para comprobar en Windows qué puertos están activos, abra una terminal y escriba:

```bash
netstat -ano | findstr LISTENING
```

Debe aparecer en la lista el puerto de cada servicio.

## 8. Cómo usar el sitio web

1. Abra el navegador en la dirección que mostró `npm run dev` en la carpeta `WebSite`.
2. Al ingresar se muestra la interfaz principal del sistema. A la **izquierda** hay un **menú lateral** con un botón por cada módulo: **Clientes, Proveedores, Inventario, Ventas y Reportes**.
3. Al hacer clic en un módulo se abre su **tabla general** con los registros.
4. Encima o al lado de la tabla están los **filtros**.
5. Cada fila tiene tres **botones de acción**:

| Botón | Qué hace |
|---|---|
| 👁️ **Ver** | Abre la ventana de detalle con toda la información del registro (solo lectura). |
| ✏️ **Modificar** | Abre un formulario con los datos actuales para cambiarlos y guardar. |
| 🗑️ **Eliminar** | Intenta borrar el registro. |

6. Para crear algo nuevo use el botón de **agregar/nuevo** del módulo.

### Mensajes de la página

Cada vez que guarda o elimina, la base de datos valida las reglas. Si algo no se cumple, **la página muestra un mensaje explicando el motivo y no se guarda nada**. Por ejemplo:

* *"El teléfono es obligatorio."* → faltó llenar un campo.
* *"El descuento debe estar entre 0 y 100."* → un número fuera de rango.
* *"Ya existe un cliente con ese nombre."* → nombre repetido.
* *"No se puede eliminar: el cliente tiene facturas."* → el registro está en uso.

Si todo sale bien, el registro se guarda y la tabla se actualiza.

### Cómo funcionan los filtros (en todos los módulos)

* Los filtros son **acumulativos**: puede usar varios a la vez y el resultado debe cumplir **todos**.
* Escriba en el campo y presione buscar/filtrar. **Dejar un filtro vacío significa "no filtrar por eso"**.
* Los filtros de texto buscan **coincidencias parciales**: si escribe `an`, aparecen todos los que contengan "an" en cualquier parte del nombre. No hace falta escribir el nombre completo.
* Normalmente no distinguen mayúsculas de minúsculas.
* Los resultados se ordenan **alfabéticamente de la A a la Z**.

---

## 9. Módulo de Clientes

Permite consultar y administrar la información de los clientes.

### Tabla general y filtros

Columnas: **Nombre del cliente, Categoría, Método de entrega.**

| Filtro | Cómo se usa | Restricción |
|---|---|---|
| **Nombre** | Texto parcial, ej. `Tailspin`. | Máx. 100 caracteres. |
| **Categoría** | Texto parcial, ej. `Novelty`. | Máx. 100 caracteres. |
| **Método de entrega** | Texto parcial, ej. `Van`. | Máx. 100 caracteres. |

### 👁️ Ver
Muestra: categoría, grupo de compra, contacto primario y alternativo, cliente por facturar, método y ciudad de entrega, código postal, teléfono, fax, sitio web, días de gracia, límite de crédito, descuento, direcciones de entrega y postal, y ubicación (latitud/longitud).

### ➕ Agregar y ✏️ Modificar

**Campos obligatorios** (si falta alguno aparece un mensaje de error tipo 1):

| Campo | Notas |
|---|---|
| Nombre | No puede estar vacío ni repetirse. |
| Categoría | Se elige de una lista. |
| Contacto primario | Se elige de una lista. |
| Método de entrega | Se elige de una lista. |
| Ciudad de entrega | Se elige de una lista. |
| Teléfono | Máx. 20 caracteres. |
| Dirección de entrega 1 | Máx. 60 caracteres. |
| Código postal | Máx. 10 caracteres. |
| Dirección postal 1 | Máx. 60 caracteres. |

**Campos opcionales:** grupo de compra, contacto alternativo, cliente por facturar, límite de crédito, descuento, días de gracia, fax, sitio web, dirección de entrega 2, dirección postal 2.

**Restricciones y rangos:**

| Campo | Regla |
|---|---|
| Sitio web | Si se escribe, **debe empezar con `http`** (ej. `https://miempresa.com`). |
| Descuento | Entre **0 y 100**. Por defecto 0. |
| Días de gracia | Entre **0 y 365**. Por defecto 7. |
| Límite de crédito | **No puede ser negativo.** |
| Nombre | **No puede existir otro cliente con el mismo nombre.** |
| Listas (categoría, grupo, contactos, método, ciudad, cliente por facturar) | El valor elegido debe existir. |

**Comportamiento especial:** si deja **vacío** el campo *Cliente por facturar*, el cliente se **factura a sí mismo**.

### 🗑️ Eliminar

El cliente **solo se puede eliminar si no tiene ningún registro relacionado**. Se bloquea (con mensaje) si tiene:

* Órdenes
* Facturas (como cliente o como cliente por facturar)
* Transacciones
* Ofertas especiales
* Movimientos de inventario
* Otros clientes que se facturan a él

---

## 10. Módulo de Proveedores

Permite consultar y administrar la información de los proveedores registrados.

### Tabla general y filtros

Columnas: **Nombre del proveedor, Categoría, Método de entrega.**

| Filtro | Cómo se usa | Restricción |
|---|---|---|
| **Nombre** | Texto parcial. | Máx. 100 caracteres. |
| **Categoría** | Texto parcial. | Máx. 100 caracteres. |
| **Método de entrega** | Texto parcial. | Máx. 100 caracteres. |

### 👁️ Ver
Muestra: categoría, contactos primario y alternativo, método y ciudad de entrega, referencia del proveedor, datos bancarios (nombre de cuenta, sucursal, número, código internacional), días de pago, teléfono, fax, sitio web, direcciones de entrega y postal, códigos postales, ciudad postal y ubicación (latitud/longitud).

### ➕ Agregar y ✏️ Modificar

**Campos obligatorios:**

| Campo | Notas |
|---|---|
| Nombre | No puede repetirse. |
| Categoría | Debe existir. |
| Contacto primario | Debe existir. |
| Método de entrega | Debe existir. |
| Ciudad de entrega | Debe existir. |
| Ciudad postal | Debe existir. |
| Teléfono | Máx. 20 caracteres. |
| Dirección de entrega 1 | Máx. 60 caracteres. |
| Código postal de entrega | Máx. 10 caracteres. |
| Dirección postal 1 | Máx. 60 caracteres. |
| Código postal (dirección postal) | Máx. 10 caracteres. |

**Campos opcionales:** contacto alternativo, referencia del proveedor, datos bancarios (nombre de cuenta, sucursal, código de banco, número de cuenta, código internacional), comentarios internos, fax, sitio web, dirección 2 (entrega y postal), ubicación.

**Restricciones:**

| Campo | Regla |
|---|---|
| Sitio web | Si se escribe, **debe empezar con `http`**. |
| Días de pago | Entre **0 y 365**. Por defecto 7. |
| Nombre | **Único** entre proveedores. |

### 🗑️ Eliminar

Se bloquea (con mensaje) si el proveedor tiene:

* Órdenes de compra
* Transacciones
* Artículos en inventario
* Movimientos de inventario

---

## 11. Módulo de Inventario

Permite consultar la información de los productos y sus existencias.

### Tabla general y filtros

Columnas: **Producto, Grupo(s), Cantidad en inventario.**

| Filtro | Cómo se usa | Restricción |
|---|---|---|
| **Nombre** | Texto parcial del producto. | Máx. 100 caracteres. |
| **Grupo** | Texto parcial del grupo, ej. `Novelty`. | Máx. 100 caracteres. Al filtrar por grupo, la columna *Grupo* solo muestra los grupos que coinciden. |
| **Cantidad** | Número **mínimo** en stock. Muestra productos con esa cantidad **o más** (≥). | Debe ser un número entero. |

> Si un producto pertenece a varios grupos, estos aparecen juntos en una sola fila, separados por comas.

### 👁️ Ver
Muestra: proveedor, color (o "Color sin definir"), marca (o "Marca sin definir"), tipo de empaque unitario y exterior, cantidad por empaque, talla, impuesto, precio unitario, precio de venta, peso, palabras clave, cantidad disponible y ubicación en bodega.

### ➕ Agregar y ✏️ Modificar

**Campos obligatorios:**

| Campo | Regla |
|---|---|
| Nombre del producto | Único (no se repite). Máx. 100 caracteres. |
| Proveedor | Debe existir. |
| Paquete por unidad | Debe existir. |
| Paquete exterior | Debe existir. |
| Días de entrega | **No negativo** (≥ 0). |
| Cantidad por empaque | **Mayor que 0.** |
| Almacenamiento refrigerado | Sí / No. |
| Tasa de impuesto | **No negativa.** |
| Precio unitario | **No negativo.** |
| Peso | **No negativo.** |
| Usuario que edita (al modificar) | Obligatorio. |

**Campos opcionales:** color, marca, talla, código de barras, comentarios de marketing, comentarios internos, foto y campos personalizados. Si el **precio de venta recomendado** se indica, no puede ser negativo.

### 🗑️ Eliminar

Se bloquea (con mensaje) si el producto:

* Tiene **transacciones** registradas.
* Tiene **registros de inventario**.
* Pertenece a uno o más **pedidos**.
* Pertenece a una o más **facturas**.

Si no tiene nada de lo anterior, primero se quitan sus relaciones con grupos y luego se elimina el producto.

> ℹ️ En WideWorldImporters casi todos los productos ya tienen un registro de inventario, por lo que es normal ver con frecuencia el mensaje de que no se puede eliminar.

---

## 12. Módulo de Ventas

Permite consultar y gestionar las operaciones de venta. Las ventas son **facturas**: cada una tiene un **encabezado** (cliente, fechas, personas, comentarios) y una **línea de producto**. Las operaciones se realizan mediante procedimientos almacenados en SQL Server.

### Tabla general y filtros

Columnas: **Número de factura, Fecha, Cliente, Método de entrega, Monto.**

| Filtro | Cómo se usa | Restricción |
|---|---|---|
| **Número de factura** | Número **exacto** de factura. | Solo números enteros. |
| **Fecha inicio** | Muestra facturas desde esa fecha (inclusive). | Formato de fecha. |
| **Fecha fin** | Muestra facturas hasta esa fecha (inclusive). | Formato de fecha. Úselo junto con *Fecha inicio* para un rango. |
| **Cliente** | Texto parcial del nombre del cliente. | Máx. 100 caracteres. |
| **Método de entrega** | Texto parcial. | Máx. 50 caracteres. |
| **Monto inicio** | Total mínimo de la factura (≥). | Número decimal. |
| **Monto fin** | Total máximo de la factura (≤). | Número decimal. Úselo junto con *Monto inicio* para un rango. |

El **Monto** es la suma del total de las líneas de la factura (con impuesto incluido).

### 👁️ Ver
Muestra el **encabezado** (cliente, cliente a facturar, pedido, método de entrega, persona de contacto, persona de cuentas, vendedor, empacado por, fecha, número de orden, nota de crédito, comentarios, instrucciones de entrega, totales de artículos secos/refrigerados, ruta y posición de entrega) y el **detalle** de productos (producto, descripción, cantidad, precio unitario, impuesto aplicado y monto, total de línea).

### ➕ Agregar y ✏️ Modificar

**Campos obligatorios del encabezado:**

| Campo | Regla |
|---|---|
| Cliente | Debe existir. |
| Cliente a facturar | Debe existir. |
| Método de entrega | Debe existir. |
| Persona de contacto | Debe existir. |
| Persona de cuentas | Debe existir. |
| Vendedor | Debe existir. |
| Empacado por | Debe existir. |
| Fecha de factura | Obligatoria. |
| ¿Es nota de crédito? | Sí / No. |
| Total de artículos secos | **No negativo.** |
| Total de artículos refrigerados | **No negativo.** |

**Opcionales del encabezado:** pedido (si se indica, debe existir), número de orden de compra del cliente (si se indica, debe existir en los pedidos), razón de nota de crédito, comentarios, instrucciones de entrega, comentarios internos, ruta de entrega, posición en la ruta, datos de entrega devueltos.

**Campos obligatorios de la línea de producto:**

| Campo | Regla |
|---|---|
| Producto | Debe existir **y tener un costo registrado** (si no, no se puede calcular la ganancia). |
| Descripción | No puede estar vacía. |
| Tipo de paquete | Debe existir. |
| Cantidad | **Mayor que 0.** |
| Tasa de impuesto | Entre **0 y 100**. |
| Precio unitario | Opcional, pero **no puede ser negativo**. Si se deja vacío, impuesto, total y ganancia quedan en 0. |

**Cálculos automáticos** (usted no los escribe):

* **Impuesto** = cantidad × precio unitario × (tasa ÷ 100)
* **Total de la línea** = cantidad × precio unitario + impuesto
* **Ganancia** = se calcula usando el último costo del producto.

**Al modificar:** se puede cambiar el encabezado y los datos de la línea (descripción, empaque, cantidad, precio e impuesto), pero **el producto de la línea no se puede cambiar**: debe ser uno que ya esté en esa factura. La factura debe existir.

### 🗑️ Eliminar

**No disponible.** La eliminación de ventas no forma parte de las operaciones establecidas para este módulo, por lo que las facturas no se pueden borrar desde el sistema (ver *Objetivos no alcanzados*).

---

## 13. Módulo de Reportes

Permite consultar información estadística generada a partir de los datos almacenados en la base de datos. Se incluyen consultas que utilizan agrupaciones, totales y rankings para presentar información de forma resumida y facilitar su análisis.

Funcionalidades utilizadas:

* Agrupaciones y totales mediante **`ROLLUP`**.
* Rankings mediante **`DENSE_RANK`**.
* Segmentación de información mediante **`PARTITION BY`**.
* Consultas estadísticas.

Todo el procesamiento se realiza en SQL Server; la página solo muestra los resultados.

> 📝 **[AJUSTAR]** Si desea más detalle, agregue aquí el nombre de cada reporte, qué muestra y qué filtros tiene.

---

## 14. Mensajes de validación y tipos de error

La aplicación cuenta con validaciones para evitar que se ingresen datos incorrectos o incompletos. Cuando una operación no puede realizarse, el sistema muestra un mensaje indicando el problema para que el usuario pueda corregir la información ingresada.

Todos los módulos usan la misma clasificación de errores:

| Tipo | Significado | Ejemplo de mensaje |
|---|---|---|
| **1** | Falta un dato obligatorio o el formato es incorrecto. | "El teléfono es obligatorio." / "El sitio web debe empezar con http" |
| **2** | Valor fuera de rango. | "El descuento debe estar entre 0 y 100." |
| **3** | Un registro relacionado no existe. | "La categoria indicada no existe." |
| **4** | Duplicado (ya existe uno con ese nombre). | "Ya existe un cliente con ese nombre." |
| **5** | El registro que quiere modificar o eliminar no existe. | "El cliente que intenta eliminar no existe." |
| **6** | El registro tiene datos relacionados y no se puede borrar. | "No se puede eliminar: el cliente tiene facturas." |

### Protección de los datos (transacciones)

Al **agregar, modificar o eliminar**, las operaciones utilizan una **transacción** (`TRANSACTION`, `COMMIT`, `ROLLBACK`): o se guardan **todos** los cambios, o **ninguno**. Si ocurre un error a mitad de camino, todo se deshace automáticamente, así nunca quedan datos a medias.

---

## 15. Sinónimos usados en la base de datos

Un **sinónimo** es un nombre alternativo para una tabla. Aquí se usaron para que los procedimientos usen **nombres en español** en lugar de los nombres originales en inglés de WideWorldImporters. Todos se crean en el esquema `dbo`.

| Sinónimo (`dbo.`) | Tabla original |
|---|---|
| `ClientesActuales` | `Sales.Customers` |
| `TiposCliente` | `Sales.CustomerCategories` |
| `GruposCompradores` | `Sales.BuyingGroups` |
| `Pedidos` | `Sales.Orders` |
| `DetallesPedido` | `Sales.OrderLines` |
| `Facturas` | `Sales.Invoices` |
| `DetalleFacturas` | `Sales.InvoiceLines` |
| `DetallesFactura` | `Sales.InvoiceLines` |
| `Contactos` | `Application.People` |
| `FormasEntrega` | `Application.DeliveryMethods` |
| `Ciudades` | `Application.Cities` |
| `ProveedoresActuales` | `Purchasing.Suppliers` |
| `CategoriaProveedores` | `Purchasing.SupplierCategories` |
| `TransaccionesProveedores` | `Purchasing.SupplierTransactions` |
| `OrdenesCompra` | `Purchasing.PurchaseOrders` |
| `ProductosActuales` | `Warehouse.StockItems` |
| `ProductosInventario` | `Warehouse.StockItemHoldings` |
| `GruposInventario` | `Warehouse.StockGroups` |
| `ItemGrupos` | `Warehouse.StockItemStockGroups` |
| `ColoresProductos` | `Warehouse.Colors` |
| `EmpaquetamientoInventario` | `Warehouse.PackageTypes` |
| `ProductosTransacciones` | `Warehouse.StockItemTransactions` |

Ejemplo: escribir `SELECT * FROM dbo.ClientesActuales` es lo mismo que `SELECT * FROM Sales.Customers`.

---

## 16. Flujo general de ejecución

Para utilizar el sistema correctamente se deben mantener abiertas **dos terminales** (y SQL Server funcionando):

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

## 17. Detener el sistema

En cada una de las dos terminales presione **`Ctrl + C`** para detener la API y la aplicación web. Para volver a usarlo otro día, repita la [sección 16](#16-flujo-general-de-ejecución) (no hace falta repetir `npm install`).

## 18. Problemas comunes

| Problema | Posible solución |
|---|---|
| `npm` o `node` no se reconoce como comando | Node.js no está instalado o la terminal se abrió antes de instalarlo. Instálelo y abra una terminal nueva. |
| `npm run dev` da error de que no encuentra `package.json` | La terminal no está dentro de la carpeta correcta. Use `cd Api` o `cd WebSite` desde la carpeta del proyecto. |
| La API no se conecta a SQL Server | Verifique que SQL Server esté encendido, que los datos de conexión de la API sean correctos y que el protocolo TCP/IP esté habilitado (SQL Server Configuration Manager). |
| Un puerto ya está en uso | Otro programa usa ese puerto. Ciérrelo o cambie el puerto en la configuración. |
| La página abre pero las tablas salen vacías o con error | La API no está corriendo o no se conecta a la base. Revise la terminal de `Api`, y recargue (F5). |
| Error de que no existe un procedimiento o sinónimo | No se ejecutaron los scripts de la [sección 4](#4-preparar-la-base-de-datos), o no se ejecutaron en orden (sinónimos primero). |
| "No se puede eliminar..." | No es un fallo: el registro tiene datos relacionados (ver [tipo de error 6](#14-mensajes-de-validación-y-tipos-de-error)). |

## 19. Video de la aplicación

[Ver video en YouTube](ENLACE_AQUI)