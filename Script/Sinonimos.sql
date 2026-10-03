USE WideWorldImporters;
GO

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
GO

CREATE SYNONYM dbo.ProveedoresActuales FOR Purchasing.Suppliers;
GO

CREATE SYNONYM dbo.CategoriaProveedores FOR Purchasing.SupplierCategories;
GO

CREATE SYNONYM dbo.ProductosActuales FOR Warehouse.StockItems;
GO

CREATE SYNONYM dbo.Colores FOR Warehouse.Colors;
GO

CREATE SYNONYM dbo.Empaquetamiento FOR Warehouse.PackageTypes;
GO


