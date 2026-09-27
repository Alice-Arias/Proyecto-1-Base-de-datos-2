USE WideWorldImporters;


GO
--Sinonimos modulo clientes
CREATE SYNONYM dbo.ClientesActuales FOR Sales.Customers;


GO
CREATE SYNONYM dbo.TiposCliente FOR Sales.CustomerCategories;


GO
CREATE SYNONYM dbo.GruposCompradores FOR Sales.BuyingGroups;


GO
CREATE SYNONYM dbo.Contactos FOR Application.People;


GO
CREATE SYNONYM dbo.FormasEntrega FOR Application.DeliveryMethods;


GO
CREATE SYNONYM dbo.Ciudades FOR Application.Cities;

SELECT *
FROM   dbo.FormasEntrega;


GO
-- revisar contenido de las tablas clientes y relacionados
-- 1. dbo.ClientesActuales
-- CustomerID: Identificador único del cliente.
-- CustomerName: Nombre del cliente o empresa.
-- BillToCustomerID: Cliente al que se factura.
-- CustomerCategoryID: Categoría a la que pertenece el cliente.
-- BuyingGroupID: Grupo de compra al que pertenece.
-- PrimaryContactPersonID: Persona principal de contacto.
-- AlternateContactPersonID: Persona de contacto alternativa.
-- DeliveryMethodID: Método utilizado para entregar los pedidos.
-- DeliveryCityID: Ciudad donde se realizan las entregas.
-- PostalCityID: Ciudad asociada a la dirección postal.
-- CreditLimit: Límite de crédito asignado al cliente.
-- AccountOpenedDate: Fecha en que se abrió la cuenta.
-- StandardDiscountPercentage: Porcentaje de descuento estándar.
-- IsStatementSent: Indica si se envían estados de cuenta.
-- IsOnCreditHold: Indica si el cliente tiene crédito bloqueado.
-- PaymentDays: Cantidad de días otorgados para realizar el pago.
-- PhoneNumber: Número telefónico.
-- FaxNumber: Número de fax.
-- WebsiteURL: Sitio web del cliente.
-- DeliveryAddressLine1: Primera línea de la dirección de entrega.
-- DeliveryAddressLine2: Segunda línea de la dirección de entrega.
-- DeliveryPostalCode: Código postal de entrega.
-- DeliveryLocation: Ubicación geográfica de entrega.
-- PostalAddressLine1: Primera línea de la dirección postal.
-- PostalAddressLine2: Segunda línea de la dirección postal.
-- PostalPostalCode: Código postal.
-- LastEditedBy: Usuario que realizó la última modificación.
-- ValidFrom: Fecha desde la cual el registro es válido.
-- ValidTo: Fecha hasta la cual el registro es válido.
SELECT *
FROM   dbo.ClientesActuales;


GO
-- 2. dbo.TiposCliente : categorias
-- CustomerCategoryID: Identificador único de la categoría.
-- CustomerCategoryName: Nombre de la categoría de clientes.
-- LastEditedBy: Usuario que realizó la última modificación.
-- ValidFrom: Fecha desde la cual el registro es válido.
-- ValidTo: Fecha hasta la cual el registro es válido.
SELECT *
FROM   dbo.TiposCliente;


GO
-- 3. dbo.GruposCompradores
-- BuyingGroupID: Identificador único del grupo de compradores.
-- BuyingGroupName: Nombre del grupo de compradores.
-- LastEditedBy: Usuario que realizó la última modificación.
-- ValidFrom: Fecha desde la cual el registro es válido.
-- ValidTo: Fecha hasta la cual el registro es válido.
SELECT *
FROM   dbo.GruposCompradores;


GO
-- 4. dbo.Contactos
-- PersonID: Identificador único de la persona.
-- FullName: Nombre completo de la persona.
-- PreferredName: Nombre por el que prefiere ser llamada.
-- SearchName: Nombre utilizado para búsquedas.
-- IsPermittedToLogon: Indica si la persona puede iniciar sesión.
-- LogonName: Nombre utilizado para iniciar sesión.
-- IsExternalLogonProvider: Indica si utiliza un proveedor externo.
-- HashedPassword: Contraseña almacenada de forma cifrada/hash.
-- IsSystemUser: Indica si corresponde a un usuario del sistema.
-- IsEmployee: Indica si la persona es empleado.
-- IsSalesperson: Indica si la persona es vendedor.
-- UserPreferences: Preferencias configuradas para el usuario.
-- PhoneNumber: Número telefónico.
-- FaxNumber: Número de fax.
-- EmailAddress: Correo electrónico.
-- CustomFields: Campos personalizados.
-- OtherLanguages: Otros idiomas que conoce.
-- LastEditedBy: Usuario que realizó la última modificación.
-- ValidFrom: Fecha desde la cual el registro es válido.
-- ValidTo: Fecha hasta la cual el registro es válido.
SELECT *
FROM   dbo.Contactos;


GO
-- 5. dbo.FormasEntrega
-- DeliveryMethodID: Identificador único del método de entrega.
-- DeliveryMethodName: Nombre del método de entrega.
-- LastEditedBy: Usuario que realizó la última modificación.
-- ValidFrom: Fecha desde la cual el registro es válido.
-- ValidTo: Fecha hasta la cual el registro es válido.
SELECT *
FROM   dbo.FormasEntrega;


GO
-- 6. dbo.Ciudade
-- CityID: Identificador único de la ciudad.
-- CityName: Nombre de la ciudad.
-- StateProvinceID: Identificador de la provincia o estado.
-- Location: Coordenadas o ubicación geográfica.
-- LatestRecordedPopulation: Última población registrada.
-- LastEditedBy: Usuario que realizó la última modificación.
-- ValidFrom: Fecha desde la cual el registro es válido.
-- ValidTo: Fecha hasta la cual el registro es válido.
SELECT *
FROM   dbo.Ciudades;