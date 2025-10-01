-- =========================================
-- Script DDL: Inventario Web
-- Base de datos: PostgreSQL
-- =========================================

-- Crear esquema (opcional, para organización)
CREATE SCHEMA IF NOT EXISTS inventario;

-- =========================
-- Tabla: Empresas
-- =========================
CREATE TABLE inventario.empresas (
    id_empresa SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    contacto VARCHAR(100)
);

-- =========================
-- Tabla: Usuarios
-- =========================
CREATE TABLE inventario.usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin','vendedor','auditor')),
    id_empresa INT REFERENCES inventario.empresas(id_empresa) ON DELETE CASCADE
);

-- =========================
-- Tabla: Categorías
-- =========================
CREATE TABLE inventario.categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- =========================
-- Tabla: Productos
-- =========================
CREATE TABLE inventario.productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    id_categoria INT REFERENCES inventario.categorias(id_categoria) ON DELETE SET NULL,
    id_empresa INT REFERENCES inventario.empresas(id_empresa) ON DELETE CASCADE
);

-- =========================
-- Tabla: Movimientos de Inventario
-- =========================
CREATE TABLE inventario.movimientos (
    id_movimiento SERIAL PRIMARY KEY,
    id_producto INT NOT NULL REFERENCES inventario.productos(id_producto) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada','salida','ajuste')),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),
    id_usuario INT REFERENCES inventario.usuarios(id_usuario) ON DELETE SET NULL
);

-- =========================
-- Índices útiles
-- =========================
CREATE INDEX idx_productos_nombre ON inventario.productos(nombre);
CREATE INDEX idx_movimientos_fecha ON inventario.movimientos(fecha);
