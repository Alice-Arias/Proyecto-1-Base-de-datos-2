USE WideWorldImporters;
GO

/* 
   MODULO PROVEEDORES
       SP_Proveedores_Listar
       SP_Proveedores_Detalle
       SP_Proveedores_Insertar
       SP_Proveedores_Actualizar
       SP_Proveedores_Eliminar
   TIPOS DE ERROR
       1 = falta un dato obligatorio o el formato es malo
       2 = valor fuera de rango
       3 = un registro relacionado no existe
       4 = duplicado (ya existe un proveedor con ese nombre)
       5 = el cliente no existe
       6 = el cliente tiene registros relacionados (no se puede borrar)
 */


/* =========================================================
   1. LISTAR

   Devuelve la lista de proveedores para la tabla principal.
   Permite filtrar por nombre, categoria y metodo de entrega.
   Los resultados se ordenan por nombre de la A - Z.
   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Proveedores_Listar
    @Nombre NVARCHAR(100) = NULL,
    @Categoria NVARCHAR(100) = NULL,
    @MetodoEntrega NVARCHAR(100) = NULL

AS
BEGIN

    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    SELECT
        p.SupplierID,
        p.SupplierName AS Nombre_Proveedor,
        cat.SupplierCategoryName AS Categoria_Proveedor,
        dm.DeliveryMethodName AS Metodo_Entrega
    FROM dbo.ProveedoresActuales AS p
    INNER JOIN dbo.CategoriaProveedores AS cat ON p.SupplierCategoryID = cat.SupplierCategoryID
    INNER JOIN  dbo.FormasEntrega AS dm  ON p.DeliveryMethodID = dm.DeliveryMethodID

    WHERE
        (@Nombre IS NULL OR p.SupplierName LIKE '%' + @Nombre + '%')
         AND 
        (@Categoria IS NULL OR cat.SupplierCategoryName LIKE '%' + @Categoria + '%')
        AND
        (@MetodoEntrega IS NULL OR dm.DeliveryMethodName LIKE '%' + @MetodoEntrega + '%')

    ORDER BY p.SupplierName ASC;
END
GO

-- ID, Nombre, ID de categoría, ID de contactos, ID de método de entrega, ID de ciudad de entrega
-- ID de código postal, teléfono y fax, sitio web, nombre del banco, número de cuenta y paymentDays
SELECT * FROM Purchasing.Suppliers; 

-- ID de categoría, Nombre de categoría
SELECT * FROM Purchasing.SupplierCategories;

-- ID de contactos
SELECT * FROM Application.People;

-- Métodos de entrega
SELECT * FROM Application.DeliveryMethods;

-- ID de ciudad y nombre
SELECT * FROM Application.Cities;
