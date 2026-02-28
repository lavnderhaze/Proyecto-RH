USE Proyecto_RH;
GO

-- =====================================
-- Tabla: Colaboradores
-- =====================================
IF OBJECT_ID('Colaboradores', 'U') IS NULL
BEGIN
    CREATE TABLE Colaboradores (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Codigo NVARCHAR(20) NOT NULL UNIQUE,
        Nombre NVARCHAR(100) NOT NULL,
        ApellidoPaterno NVARCHAR(100),
        ApellidoMaterno NVARCHAR(100),
        NombreCompleto AS (Nombre + ' ' + ISNULL(ApellidoPaterno,'') + ' ' + ISNULL(ApellidoMaterno,'')),
        FechaIngreso DATE,
        Departamento NVARCHAR(100),
        Puesto NVARCHAR(100),
        Activo BIT DEFAULT 1,
        FechaCreacion DATETIME DEFAULT GETDATE()
    );
END
GO

-- =====================================
-- Tabla: FormatosGenerados
-- =====================================
IF OBJECT_ID('FormatosGenerados', 'U') IS NULL
BEGIN
    CREATE TABLE FormatosGenerados (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ColaboradorId INT NOT NULL,
        TipoFormato NVARCHAR(50) NOT NULL,
        FechaEfectividad DATE,
        Observaciones NVARCHAR(MAX),
        FechaCreacion DATETIME DEFAULT GETDATE(),

        CONSTRAINT FK_Formatos_Colaborador
            FOREIGN KEY (ColaboradorId)
            REFERENCES Colaboradores(Id)
            ON DELETE CASCADE
    );
END
GO