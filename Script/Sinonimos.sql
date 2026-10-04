USE WideWorldImporters;
GO

CREATE SYNONYM dbo.ClientesActuales FOR Sales.Customers;
GO

CREATE SYNONYM dbo.TiposCliente FOR Sales.CustomerCategories;
GO

CREATE SYNONYM dbo.GruposCompradores FOR Sales.BuyingGroups;
GO

CREATE SYNONYM dbo.DetallesPedido FOR Sales.OrderLines;
GO

CREATE SYNONYM dbo.Pedidos FOR Sales.Orders;
GO

CREATE SYNONYM dbo.DetallesFactura FOR Sales.InvoiceLines;
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

CREATE SYNONYM dbo.TransaccionesProveedores FOR Purchasing.SupplierTransactions;
GO

CREATE SYNONYM dbo.OrdenesCompra FOR Purchasing.PurchaseOrders;
GO

CREATE SYNONYM dbo.ProductosActuales FOR Warehouse.StockItems;
GO

CREATE SYNONYM dbo.ProductosInventario FOR Warehouse.StockItemHoldings;
GO

CREATE SYNONYM dbo.GruposInventario FOR Warehouse.StockGroups;
GO

CREATE SYNONYM dbo.ItemGrupos FOR Warehouse.StockItemStockGroups;
GO

CREATE SYNONYM dbo.ColoresProductos FOR Warehouse.Colors;
GO

CREATE SYNONYM dbo.EmpaquetamientoInventario FOR Warehouse.PackageTypes;
GO

CREATE SYNONYM dbo.ProductosTransacciones FOR Warehouse.StockItemTransactions;
GO

CREATE SYNONYM dbo.Facturas FOR Sales.Invoices;
GO

CREATE SYNONYM dbo.DetalleFacturas FOR Sales.InvoiceLines;
GO