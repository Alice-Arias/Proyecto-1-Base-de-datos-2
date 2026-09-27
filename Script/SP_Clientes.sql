USE WideWorldImporters;


GO
-- ============================================================
-- SP: SP_Clientes_Listar
-- Objetivo: Mostrar la lista de clientes con filtros opcionales.
-- Si no se manda ningun parametro, trae TODOS los clientes.
-- Los filtros son acumulativos (se pueden combinar entre si).
-- ============================================================
CREATE OR ALTER PROCEDURE dbo.SP_Clientes_Detalle
@CustomerID INT
AS
BEGIN
    SELECT c.CustomerName,
           cat.CustomerCategoryName AS Categoria,
           bg.BuyingGroupName AS GrupoCompra,
           p1.FullName AS ContactoPrimario,
           p2.FullName AS ContactoAlternativo,
           bc.CustomerName AS ClientePorFacturar,
           dm.DeliveryMethodName AS MetodoEntrega,
           ciu.CityName AS CiudadEntrega,
           c.DeliveryPostalCode AS CodigoPostal,
           c.PhoneNumber AS Telefono,
           c.FaxNumber AS Fax,
           c.PaymentDays AS DiasDeGracia,
           c.WebsiteURL AS SitioWeb,
           c.DeliveryAddressLine1 AS DireccionEntrega1,
           c.DeliveryAddressLine2 AS DireccionEntrega2,
           c.PostalAddressLine1 AS DireccionPostal1,
           c.PostalAddressLine2 AS DireccionPostal2,
           c.DeliveryLocation.Lat AS Latitud,
           c.DeliveryLocation.Long AS Longitud
    FROM   dbo.ClientesActuales AS c
           INNER JOIN
           dbo.TiposCliente AS cat
           ON c.CustomerCategoryID = cat.CustomerCategoryID
           LEFT OUTER JOIN
           dbo.GruposCompradores AS bg
           ON c.BuyingGroupID = bg.BuyingGroupID
           LEFT OUTER JOIN
           dbo.Contactos AS p1
           ON c.PrimaryContactPersonID = p1.PersonID
           LEFT OUTER JOIN
           dbo.Contactos AS p2
           ON c.AlternateContactPersonID = p2.PersonID
           LEFT OUTER JOIN
           dbo.ClientesActuales AS bc
           ON c.BillToCustomerID = bc.CustomerID
           LEFT OUTER JOIN
           dbo.FormasEntrega AS dm
           ON c.DeliveryMethodID = dm.DeliveryMethodID
           LEFT OUTER JOIN
           dbo.Ciudades AS ciu
           ON c.DeliveryCityID = ciu.CityID
    WHERE  c.CustomerID = @CustomerID;
END


GO
EXECUTE dbo.SP_Clientes_Detalle @CustomerID = 2;