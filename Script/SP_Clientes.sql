USE WideWorldImporters;
GO

CREATE OR ALTER PROCEDURE dbo.SP_Clientes_Listar
    @Nombre NVARCHAR(100) = NULL,
    @Categoria NVARCHAR(100) = NULL,
    @MetodoEntrega NVARCHAR(100) = NULL
AS
BEGIN

    SELECT
        c.CustomerID,
        c.CustomerName AS Nombre_Cliente,
        cat.CustomerCategoryName AS Categoria_Cliente,
        dm.DeliveryMethodName AS Metodo_Entrega

    FROM dbo.ClientesActuales AS c

    INNER JOIN dbo.TiposCliente AS cat  ON c.CustomerCategoryID = cat.CustomerCategoryID

    LEFT JOIN dbo.FormasEntrega AS dm  ON c.DeliveryMethodID = dm.DeliveryMethodID

    WHERE
        (@Nombre IS NULL OR c.CustomerName LIKE '%' + @Nombre + '%')
        AND
       (@Categoria IS NULL OR cat.CustomerCategoryName LIKE '%' + @Categoria + '%')
       AND 
       (@MetodoEntrega IS NULL OR dm.DeliveryMethodName LIKE '%' + @MetodoEntrega + '%')

    ORDER BY c.CustomerName ASC;
END
GO

-- SP_Clientes_Detalle
-- Muestra toda la información de un cliente específico.
-- Recibe como parámetro el CustomerID.


CREATE OR ALTER PROCEDURE dbo.SP_Clientes_Detalle
    @CustomerID VARCHAR(MAX)
AS
BEGIN

    SELECT
        c.CustomerName AS Nombre_Cliente,
        cat.CustomerCategoryName AS Categoria,
        bg.BuyingGroupName AS Grupo_Compra,
        p1.FullName AS Contacto_Primario,
        p2.FullName AS Contacto_Alternativo,
        bc.CustomerName AS Cliente_Por_Facturar,
        dm.DeliveryMethodName AS Metodo_Entrega,
        ciu.CityName AS Ciudad_Entrega,
        c.DeliveryPostalCode AS Codigo_Postal,
        c.PhoneNumber AS Telefono,
        c.FaxNumber AS Fax,
        c.WebsiteURL AS SitioWeb,
        c.PaymentDays AS Dias_De_Gracia,
        c.WebsiteURL AS Sitio_Web, 
        c.DeliveryAddressLine1 AS Direccion_Entrega1,
        c.DeliveryAddressLine2 AS Direccion_Entrega2,
        c.PostalAddressLine1 AS Direccion_Postal1,
        c.PostalAddressLine2 AS Direccion_Postal2,
        c.DeliveryLocation.Lat AS Latitud,
        c.DeliveryLocation.Long AS Longitud

    FROM dbo.ClientesActuales AS c

    INNER JOIN dbo.TiposCliente AS cat   ON c.CustomerCategoryID = cat.CustomerCategoryID

    LEFT JOIN dbo.GruposCompradores AS bg  ON c.BuyingGroupID = bg.BuyingGroupID

    LEFT JOIN dbo.Contactos AS p1 ON c.PrimaryContactPersonID = p1.PersonID

    LEFT JOIN dbo.Contactos AS p2 ON c.AlternateContactPersonID = p2.PersonID

    LEFT JOIN dbo.ClientesActuales AS bc ON c.BillToCustomerID = bc.CustomerID

    LEFT JOIN dbo.FormasEntrega AS dm ON c.DeliveryMethodID = dm.DeliveryMethodID

    LEFT JOIN dbo.Ciudades AS ciu ON c.DeliveryCityID = ciu.CityID

    WHERE c.CustomerID 
    IN 
    ( 
       SELECT value FROM STRING_SPLIT(@CustomerID, ',')
    );

END
GO
