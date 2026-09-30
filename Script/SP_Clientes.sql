USE WideWorldImporters;
GO

/* 
   MODULO CLIENTES  
      SP_Clientes_Listar      
      SP_Clientes_Detalle     
      SP_Clientes_Insertar    
      SP_Clientes_Actualizar  
      SP_Clientes_Eliminar    

   TIPOS DE ERROR 
     1 = falta un dato obligatorio o el formato es malo
     2 = valor fuera de rango
     3 = un registro relacionado no existe 
     4 = duplicado (ya existe un cliente con ese nombre)
     5 = el cliente no existe
     6 = el cliente tiene registros relacionados (no se puede borrar)
 */



-- 1. LISTAR
-- devuelve la lista de clientes para la tabla principal, tres filtros 
-- ID, nombre, categoria y metodo de entrega de cada cliente, ordenados por nombre de la A a la Z.
CREATE OR ALTER PROCEDURE dbo.SP_Clientes_Listar
    @Nombre   NVARCHAR(100) = NULL,
    @Categoria  NVARCHAR(100) = NULL,
    @MetodoEntrega NVARCHAR(100) = NULL
AS
BEGIN
    SELECT
        c.CustomerID,
        c.CustomerName  AS Nombre_Cliente,
        cat.CustomerCategoryName AS Categoria_Cliente,
        dm.DeliveryMethodName  AS Metodo_Entrega
    FROM dbo.ClientesActuales AS c
    INNER JOIN dbo.TiposCliente AS cat ON c.CustomerCategoryID = cat.CustomerCategoryID
    LEFT JOIN dbo.FormasEntrega AS dm ON c.DeliveryMethodID = dm.DeliveryMethodID
    -- Los tres se unen con AND, por eso son acumulativos.
    WHERE
        (@Nombre IS NULL OR c.CustomerName LIKE '%' + @Nombre + '%')  AND
        (@Categoria IS NULL OR cat.CustomerCategoryName LIKE '%' + @Categoria + '%') AND
        (@MetodoEntrega IS NULL OR dm.DeliveryMethodName LIKE '%' + @MetodoEntrega + '%')

    ORDER BY c.CustomerName ASC;
END
GO



-- 2. DETALLE
-- devuelve toda la informacion de cliente (detalle).
-- recibe el ID del cliente.
-- da:datos generales, contactos, cliente por facturar, direcciones
-- y coordenadas para el mapa. Tambien devuelve los IDs de cada
-- relacion para poder editar.
CREATE OR ALTER PROCEDURE dbo.SP_Clientes_Detalle
    @CustomerID INT
AS
BEGIN
    SELECT
        c.CustomerID,
        c.CustomerName  AS Nombre_Cliente,
        c.CustomerCategoryID AS Categoria_ID,
        cat.CustomerCategoryName AS Categoria,
        c.BuyingGroupID   AS Grupo_Compra_ID,
        bg.BuyingGroupName AS Grupo_Compra,
        c.PrimaryContactPersonID  AS Contacto_Primario_ID,
        p1.FullName  AS Contacto_Primario,
        c.AlternateContactPersonID AS Contacto_Alternativo_ID,
        p2.FullName   AS Contacto_Alternativo,
        c.BillToCustomerID   AS Cliente_Por_Facturar_ID,
        bc.CustomerName  AS Cliente_Por_Facturar,
        c.DeliveryMethodID  AS Metodo_Entrega_ID,
        dm.DeliveryMethodName  AS Metodo_Entrega,
        c.DeliveryCityID   AS Ciudad_Entrega_ID,
        ciu.CityName   AS Ciudad_Entrega,
        c.DeliveryPostalCode  AS Codigo_Postal,
        c.PhoneNumber    AS Telefono,
        c.FaxNumber   AS Fax,
        c.WebsiteURL AS Sitio_Web,
        c.PaymentDays  AS Dias_De_Gracia,
        c.CreditLimit  AS Limite_Credito,
        c.StandardDiscountPercentage AS Descuento,
        c.DeliveryAddressLine1 AS Direccion_Entrega1,
        c.DeliveryAddressLine2 AS Direccion_Entrega2,
        c.PostalAddressLine1 AS Direccion_Postal1,
        c.PostalAddressLine2 AS Direccion_Postal2,
        c.DeliveryLocation.Lat AS Latitud,
        c.DeliveryLocation.Long AS Longitud

    FROM dbo.ClientesActuales AS c
    INNER JOIN dbo.TiposCliente AS cat  ON c.CustomerCategoryID = cat.CustomerCategoryID
    LEFT JOIN  dbo.GruposCompradores AS bg ON c.BuyingGroupID = bg.BuyingGroupID
    LEFT JOIN  dbo.Contactos AS p1 ON c.PrimaryContactPersonID = p1.PersonID
    LEFT JOIN  dbo.Contactos AS p2 ON c.AlternateContactPersonID = p2.PersonID
    LEFT JOIN  dbo.ClientesActuales AS bc ON c.BillToCustomerID = bc.CustomerID
    LEFT JOIN  dbo.FormasEntrega AS dm  ON c.DeliveryMethodID = dm.DeliveryMethodID
    LEFT JOIN  dbo.Ciudades AS ciu   ON c.DeliveryCityID = ciu.CityID
    WHERE c.CustomerID = @CustomerID;
END
GO


-- 3. INSERTAR
-- el CustomerID (numero) que la base le asigno al cliente nuevo.
CREATE OR ALTER PROCEDURE dbo.SP_Clientes_Insertar
    @Nombre   NVARCHAR(100),
    @CategoriaID  INT,
    @GrupoCompraID  INT = NULL,
    @ContactoPrimarioID  INT,
    @ContactoAlternativoID INT  = NULL,
    @ClienteFacturarID INT  = NULL,   -- si va vacio, se factura a si mismo
    @MetodoEntregaID  INT,
    @CiudadEntregaID INT,
    @LimiteCredito  DECIMAL(18,2) = NULL,
    @Descuento DECIMAL(18,3) = 0,
    @DiasGracia  INT           = 7,
    @Telefono  NVARCHAR(20),
    @Fax   NVARCHAR(20)  = '',
    @SitioWeb   NVARCHAR(256) = '',
    @DireccionEntrega1  NVARCHAR(60),
    @DireccionEntrega2  NVARCHAR(60)  = NULL,
    @CodigoPostal  NVARCHAR(10),
    @DireccionPostal1  NVARCHAR(60),
    @DireccionPostal2  NVARCHAR(60)  = NULL,
    @UsuarioID  INT  = 1
AS
BEGIN

    -- si vienen sin valor los dejamos como texto vacio ('').
    IF @Fax IS NULL SET @Fax = '';
    IF @SitioWeb IS NULL SET @SitioWeb = '';

    IF @Nombre IS NULL OR @Nombre = ''
    BEGIN
        RAISERROR('El nombre del cliente es obligatorio.', 16, 1);
        RETURN;
    END

    IF @CategoriaID IS NULL
    BEGIN
        RAISERROR('La categoria es obligatoria.', 16, 1);
        RETURN;
    END

    IF @ContactoPrimarioID IS NULL
    BEGIN
        RAISERROR('El contacto primario es obligatorio.', 16, 1);
        RETURN;
    END

    IF @MetodoEntregaID IS NULL
    BEGIN
        RAISERROR('El metodo de entrega es obligatorio.', 16, 1);
        RETURN;
    END

    IF @CiudadEntregaID IS NULL
    BEGIN
        RAISERROR('La ciudad de entrega es obligatoria.', 16, 1);
        RETURN;
    END

    IF @Telefono IS NULL OR @Telefono = ''
    BEGIN
        RAISERROR('El telefono es obligatorio.', 16, 1);
        RETURN;
    END

    IF @DireccionEntrega1 IS NULL OR @DireccionEntrega1 = ''
    BEGIN
        RAISERROR('La direccion de entrega es obligatoria.', 16, 1);
        RETURN;
    END

    IF @CodigoPostal IS NULL OR @CodigoPostal = ''
    BEGIN
        RAISERROR('El codigo postal es obligatorio.', 16, 1);
        RETURN;
    END

    IF @DireccionPostal1 IS NULL OR @DireccionPostal1 = ''
    BEGIN
        RAISERROR('La direccion postal es obligatoria.', 16, 1);
        RETURN;
    END

    IF @SitioWeb <> '' AND @SitioWeb NOT LIKE 'http%'
    BEGIN
        RAISERROR('El sitio web debe empezar con http', 16, 1);
        RETURN;
    END

    IF @Descuento < 0 OR @Descuento > 100
    BEGIN
        RAISERROR('El descuento debe estar entre 0 y 100.', 16, 2);
        RETURN;
    END

    IF @DiasGracia < 0 OR @DiasGracia > 365
    BEGIN
        RAISERROR('Los dias de gracia deben estar entre 0 y 365.', 16, 2);
        RETURN;
    END

    IF @LimiteCredito IS NOT NULL AND @LimiteCredito < 0
    BEGIN
        RAISERROR('El limite de credito no puede ser negativo.', 16, 2);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.TiposCliente 
        WHERE CustomerCategoryID = @CategoriaID
        )
    BEGIN
        RAISERROR('La categoria indicada no existe.', 16, 3);
        RETURN;
    END

    IF @GrupoCompraID IS NOT NULL
       AND NOT EXISTS (
        SELECT 1 
        FROM dbo.GruposCompradores 
        WHERE BuyingGroupID = @GrupoCompraID
        )
    BEGIN
        RAISERROR('El grupo de compra indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.Contactos
         WHERE PersonID = @ContactoPrimarioID
         )
    BEGIN
        RAISERROR('El contacto primario indicado no existe.', 16, 3);
        RETURN;
    END

    IF @ContactoAlternativoID IS NOT NULL
       AND NOT EXISTS (
        SELECT 1 
        FROM dbo.Contactos 
        WHERE PersonID = @ContactoAlternativoID
        )
    BEGIN
        RAISERROR('El contacto alternativo indicado no existe.', 16, 3);
        RETURN;
    END

    IF @ClienteFacturarID IS NOT NULL
       AND NOT EXISTS (
        SELECT 1 
        FROM dbo.ClientesActuales
         WHERE CustomerID = @ClienteFacturarID
         )
    BEGIN
        RAISERROR('El cliente por facturar indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.FormasEntrega
         WHERE DeliveryMethodID = @MetodoEntregaID
         )
    BEGIN
        RAISERROR('El metodo de entrega indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Ciudades 
        WHERE CityID = @CiudadEntregaID
        )
    BEGIN
        RAISERROR('La ciudad de entrega indicada no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.Contactos 
        WHERE PersonID = @UsuarioID
        )
    BEGIN
        RAISERROR('El usuario que registra no existe.', 16, 3);
        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM dbo.ClientesActuales 
        WHERE CustomerName = @Nombre
        )
    BEGIN
        RAISERROR('Ya existe un cliente con ese nombre.', 16, 4);
        RETURN;
    END

    -- La columna CustomerID la llena la base de datos sola 
    DECLARE @FacturarA INT;
    SET @FacturarA = @ClienteFacturarID;
    IF @FacturarA IS NULL SET @FacturarA = 1;

    INSERT INTO dbo.ClientesActuales
    (
        CustomerName, BillToCustomerID, CustomerCategoryID, BuyingGroupID, PrimaryContactPersonID, AlternateContactPersonID, DeliveryMethodID,
        DeliveryCityID, PostalCityID, CreditLimit, AccountOpenedDate,
        StandardDiscountPercentage, IsStatementSent, IsOnCreditHold, PaymentDays,  PhoneNumber, FaxNumber, WebsiteURL,
        DeliveryAddressLine1, DeliveryAddressLine2, DeliveryPostalCode, PostalAddressLine1, PostalAddressLine2, PostalPostalCode, LastEditedBy
    )
    VALUES
    (
        @Nombre, @FacturarA, @CategoriaID, @GrupoCompraID,
        @ContactoPrimarioID, @ContactoAlternativoID, @MetodoEntregaID,
        @CiudadEntregaID, @CiudadEntregaID, @LimiteCredito, GETDATE(),
        @Descuento, 0, 0, @DiasGracia,
        @Telefono, @Fax, @SitioWeb,
        @DireccionEntrega1, @DireccionEntrega2, @CodigoPostal,
        @DireccionPostal1, @DireccionPostal2, @CodigoPostal, @UsuarioID
    );

    DECLARE @NuevoID INT;
    SELECT @NuevoID = CustomerID
    FROM dbo.ClientesActuales
    WHERE CustomerName = @Nombre;

    -- Si no eligieron cliente por facturar, se factura a si mismo
    IF @ClienteFacturarID IS NULL
    BEGIN
        UPDATE dbo.ClientesActuales
        SET BillToCustomerID = @NuevoID
        WHERE CustomerID = @NuevoID;
    END

    SELECT @NuevoID AS CustomerID;
END
GO



-- 4. ACTUALIZAR
-- modifica los datos de un cliente que ya existe.
CREATE OR ALTER PROCEDURE dbo.SP_Clientes_Actualizar
    @CustomerID            INT,
    @Nombre                NVARCHAR(100),
    @CategoriaID           INT,
    @GrupoCompraID         INT  = NULL,
    @ContactoPrimarioID    INT,
    @ContactoAlternativoID INT  = NULL,
    @ClienteFacturarID     INT = NULL,   
    @MetodoEntregaID       INT,
    @CiudadEntregaID       INT,
    @LimiteCredito         DECIMAL(18,2) = NULL,
    @Descuento             DECIMAL(18,3) = 0,
    @DiasGracia            INT  = 7,
    @Telefono              NVARCHAR(20),
    @Fax                   NVARCHAR(20)  = '',
    @SitioWeb              NVARCHAR(256) = '',
    @DireccionEntrega1     NVARCHAR(60),
    @DireccionEntrega2     NVARCHAR(60)  = NULL,
    @CodigoPostal          NVARCHAR(10),
    @DireccionPostal1      NVARCHAR(60),
    @DireccionPostal2      NVARCHAR(60)  = NULL,
    @UsuarioID             INT  = 1
AS
BEGIN

    IF @Fax IS NULL      SET @Fax = '';
    IF @SitioWeb IS NULL SET @SitioWeb = '';

    IF @CustomerID IS NULL
    BEGIN
        RAISERROR('El CustomerID es obligatorio.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.ClientesActuales 
        WHERE CustomerID = @CustomerID
        )
    BEGIN
        RAISERROR('El cliente que intenta actualizar no existe.', 16, 5);
        RETURN;
    END

    IF @Nombre IS NULL OR @Nombre = ''
    BEGIN
        RAISERROR('El nombre del cliente es obligatorio.', 16, 1);
        RETURN;
    END

    IF @CategoriaID IS NULL
    BEGIN
        RAISERROR('La categoria es obligatoria.', 16, 1);
        RETURN;
    END

    IF @ContactoPrimarioID IS NULL
    BEGIN
        RAISERROR('El contacto primario es obligatorio.', 16, 1);
        RETURN;
    END

    IF @MetodoEntregaID IS NULL
    BEGIN
        RAISERROR('El metodo de entrega es obligatorio.', 16, 1);
        RETURN;
    END

    IF @CiudadEntregaID IS NULL
    BEGIN
        RAISERROR('La ciudad de entrega es obligatoria.', 16, 1);
        RETURN;
    END

    IF @Telefono IS NULL OR @Telefono = ''
    BEGIN
        RAISERROR('El telefono es obligatorio.', 16, 1);
        RETURN;
    END

    IF @DireccionEntrega1 IS NULL OR @DireccionEntrega1 = ''
    BEGIN
        RAISERROR('La direccion de entrega es obligatoria.', 16, 1);
        RETURN;
    END

    IF @CodigoPostal IS NULL OR @CodigoPostal = ''
    BEGIN
        RAISERROR('El codigo postal es obligatorio.', 16, 1);
        RETURN;
    END

    IF @DireccionPostal1 IS NULL OR @DireccionPostal1 = ''
    BEGIN
        RAISERROR('La direccion postal es obligatoria.', 16, 1);
        RETURN;
    END

    IF @SitioWeb <> '' AND @SitioWeb NOT LIKE 'http%'
    BEGIN
        RAISERROR('El sitio web debe empezar con http', 16, 1);
        RETURN;
    END

    IF @Descuento < 0 OR @Descuento > 100
    BEGIN
        RAISERROR('El descuento debe estar entre 0 y 100.', 16, 2);
        RETURN;
    END

    IF @DiasGracia < 0 OR @DiasGracia > 365
    BEGIN
        RAISERROR('Los dias de gracia deben estar entre 0 y 365.', 16, 2);
        RETURN;
    END

    IF @LimiteCredito IS NOT NULL AND @LimiteCredito < 0
    BEGIN
        RAISERROR('El limite de credito no puede ser negativo.', 16, 2);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.TiposCliente 
        WHERE CustomerCategoryID = @CategoriaID
        )
    BEGIN
        RAISERROR('La categoria indicada no existe.', 16, 3);
        RETURN;
    END

    IF @GrupoCompraID IS NOT NULL
       AND NOT EXISTS (
        SELECT 1 
        FROM dbo.GruposCompradores 
        WHERE BuyingGroupID = @GrupoCompraID
        )
    BEGIN
        RAISERROR('El grupo de compra indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.Contactos
        WHERE PersonID = @ContactoPrimarioID
        )
    BEGIN
        RAISERROR('El contacto primario indicado no existe.', 16, 3);
        RETURN;
    END

    IF @ContactoAlternativoID IS NOT NULL
       AND NOT EXISTS (
        SELECT 1 
        FROM dbo.Contactos 
        WHERE PersonID = @ContactoAlternativoID
        )
    BEGIN
        RAISERROR('El contacto alternativo indicado no existe.', 16, 3);
        RETURN;
    END

    IF @ClienteFacturarID IS NOT NULL
       AND NOT EXISTS (
        SELECT 1 
        FROM dbo.ClientesActuales 
        WHERE CustomerID = @ClienteFacturarID)
    BEGIN
        RAISERROR('El cliente por facturar indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.FormasEntrega 
        WHERE DeliveryMethodID = @MetodoEntregaID
        )
    BEGIN
        RAISERROR('El metodo de entrega indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.Ciudades 
        WHERE CityID = @CiudadEntregaID
        )
    BEGIN
        RAISERROR('La ciudad de entrega indicada no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.Contactos 
        WHERE PersonID = @UsuarioID
        )
    BEGIN
        RAISERROR('El usuario que edita no existe.', 16, 3);
        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM dbo.ClientesActuales
        WHERE CustomerName = @Nombre AND CustomerID <> @CustomerID)
    BEGIN
        RAISERROR('Ya existe otro cliente con ese nombre.', 16, 4);
        RETURN;
    END

    --  si todo esta bien, se actualizan los datos
    IF @ClienteFacturarID IS NULL SET @ClienteFacturarID = @CustomerID;

    UPDATE dbo.ClientesActuales
    SET CustomerName               = @Nombre,
        BillToCustomerID           = @ClienteFacturarID,
        CustomerCategoryID         = @CategoriaID,
        BuyingGroupID              = @GrupoCompraID,
        PrimaryContactPersonID     = @ContactoPrimarioID,
        AlternateContactPersonID   = @ContactoAlternativoID,
        DeliveryMethodID           = @MetodoEntregaID,
        DeliveryCityID             = @CiudadEntregaID,
        PostalCityID               = @CiudadEntregaID,
        CreditLimit                = @LimiteCredito,
        StandardDiscountPercentage = @Descuento,
        PaymentDays                = @DiasGracia,
        PhoneNumber                = @Telefono,
        FaxNumber                  = @Fax,
        WebsiteURL                 = @SitioWeb,
        DeliveryAddressLine1       = @DireccionEntrega1,
        DeliveryAddressLine2       = @DireccionEntrega2,
        DeliveryPostalCode         = @CodigoPostal,
        PostalAddressLine1         = @DireccionPostal1,
        PostalAddressLine2         = @DireccionPostal2,
        PostalPostalCode           = @CodigoPostal,
        LastEditedBy               = @UsuarioID
    WHERE CustomerID = @CustomerID;

    SELECT @CustomerID AS CustomerID;
END
GO



-- 5. ELIMINAR
-- borra un cliente, pero solo si no tiene historial.
-- e protege el historial: un cliente con ordenes, facturas, etc
--  no se puede borrar porque se perderia informacion.
CREATE OR ALTER PROCEDURE dbo.SP_Clientes_Eliminar
    @CustomerID INT
AS
BEGIN

    IF @CustomerID IS NULL
    BEGIN
        RAISERROR('El CustomerID es obligatorio.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.ClientesActuales 
        WHERE CustomerID = @CustomerID)
    BEGIN
        RAISERROR('El cliente que intenta eliminar no existe.', 16, 5);
        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM Sales.Orders 
        WHERE CustomerID = @CustomerID)
    BEGIN
        RAISERROR('No se puede eliminar: el cliente tiene ordenes.', 16, 6);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM Sales.Invoices
               WHERE CustomerID = @CustomerID OR BillToCustomerID = @CustomerID)
    BEGIN
        RAISERROR('No se puede eliminar: el cliente tiene facturas.', 16, 6);
        RETURN;
    END

    IF EXISTS (SELECT 1 
            FROM Sales.CustomerTransactions 
            WHERE CustomerID = @CustomerID)
    BEGIN
        RAISERROR('No se puede eliminar: el cliente tiene transacciones.', 16, 6);
        RETURN;
    END

    IF EXISTS (SELECT 1 
                FROM Sales.SpecialDeals 
                WHERE CustomerID = @CustomerID)
    BEGIN
        RAISERROR('No se puede eliminar: el cliente tiene ofertas especiales.', 16, 6);
        RETURN;
    END

    IF EXISTS (SELECT 1
             FROM Warehouse.StockItemTransactions
             WHERE CustomerID = @CustomerID)
    BEGIN
        RAISERROR('No se puede eliminar: el cliente tiene movimientos de inventario.', 16, 6);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM dbo.ClientesActuales
               WHERE BillToCustomerID = @CustomerID AND CustomerID <> @CustomerID)
    BEGIN
        RAISERROR('No se puede eliminar: otros clientes se facturan a este cliente.', 16, 6);
        RETURN;
    END

    DELETE FROM dbo.ClientesActuales
    WHERE CustomerID = @CustomerID;

    SELECT @CustomerID AS CustomerID_Eliminado;
END
GO