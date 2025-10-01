-- =========================================
-- Script de datos de prueba (seed.sql)
-- =========================================

-- Insertar empresas
INSERT INTO inventario.empresas (nombre, direccion, contacto)
VALUES
('Tech Solutions S.A.', 'Calle 123, La Habana', 'contacto@techsolutions.com'),
('Market Express', 'Av. Central 456, La Habana', 'ventas@marketexpress.com');

-- Insertar usuarios
INSERT INTO inventario.usuarios (nombre, email, password_hash, rol, id_empresa)
VALUES
('Administrador General', 'admin@techsolutions.com', 'HASH_ADMIN', 'admin', 1),
('Vendedor Juan', 'juan@techsolutions.com', 'HASH_JUAN', 'vendedor', 1),
('Auditor María', 'maria@marketexpress.com', 'HASH_MARIA', 'auditor', 2);

-- Insertar categorías
INSERT INTO inventario.categorias (nombre, descripcion)
VALUES
('Electrónica', 'Dispositivos electrónicos y accesorios'),
('Alimentos', 'Productos de consumo alimenticio');

-- Insertar productos
INSERT INTO inventario.productos (nombre, descripcion, precio, stock, id_categoria, id_empresa)
VALUES
('Laptop Lenovo', 'Laptop de 15 pulgadas con 16GB RAM', 1200.00, 10, 1, 1),
('Mouse Inalámbrico', 'Mouse óptico inalámbrico', 25.50, 50, 1, 1),
('Arroz 1kg', 'Bolsa de arroz de 1 kilogramo', 2.30, 200, 2, 2),
('Aceite Vegetal 1L', 'Botella de aceite vegetal', 3.10, 150, 2, 2);

-- Insertar movimientos de inventario
INSERT INTO inventario.movimientos (id_producto, tipo, cantidad, id_usuario)
VALUES
(1, 'entrada', 10, 1),
(2, 'entrada', 50, 1),
(3, 'entrada', 200, 3),
(4, 'entrada', 150, 3),
(2, 'salida', 5, 2),
(3, 'salida', 20, 3);
