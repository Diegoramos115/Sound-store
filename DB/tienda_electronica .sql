-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-11-2024 a las 04:41:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda_electronica`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_ordenes`
--

CREATE TABLE `detalles_ordenes` (
  `id` int(11) NOT NULL,
  `orden_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles_ordenes`
--

INSERT INTO `detalles_ordenes` (`id`, `orden_id`, `producto_id`, `cantidad`, `precio`) VALUES
(5, 3, 119, 1, 849.99),
(6, 3, 120, 1, 699.99),
(7, 3, 118, 1, 1299.99),
(8, 3, 117, 1, 599.99),
(9, 4, 136, 1, 2999.99),
(10, 4, 134, 1, 1599.99),
(11, 4, 135, 1, 999.99),
(12, 4, 133, 1, 1399.99);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes`
--

CREATE TABLE `ordenes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `estado` enum('pendiente','completada','cancelada') DEFAULT 'pendiente',
  `monto_total` decimal(10,2) NOT NULL,
  `actualizado_en` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenes`
--

INSERT INTO `ordenes` (`id`, `usuario_id`, `estado`, `monto_total`, `actualizado_en`) VALUES
(3, 8, 'pendiente', 3449.96, '2024-11-19 22:35:39'),
(4, 9, 'pendiente', 6999.96, '2024-11-19 22:36:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `ubicacion_imagen` varchar(255) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `ubicacion_imagen`, `categoria`) VALUES
(117, 'Trompeta Yamaha', 'Una trompeta de alta calidad adecuada para profesionales y estudiantes.', 599.99, 10, 'Imagenes\\Trompeta Yamaha.jpg', 'viento'),
(118, 'Saxofón Alto Selmer', 'Un saxofón alto con un sonido rico y cálido.', 1299.99, 5, 'Imagenes\\Saxofón Alto Selmer.jpg', 'viento'),
(119, 'Clarinete Buffet Crampon', 'Clarinete en si bemol ideal para músicos avanzados.', 849.99, 8, 'Imagenes\\Clarinete Buffet Crampon.jpg', 'viento'),
(120, 'Flauta Traversa Pearl', 'Flauta travesera de plata esterlina para un sonido claro y brillante.', 699.99, 12, 'Imagenes\\Flauta Traversa Pearl.jpg', 'viento'),
(121, 'Oboe Marigaux', 'Oboe de madera de gran calidad, perfecto para orquestas.', 2699.99, 3, 'Imagenes\\Oboe Marigaux.jpg', 'viento'),
(122, 'Violín Stradivarius Replica', 'Réplica de un violín Stradivarius con un sonido excepcional.', 1599.99, 2, 'Imagenes\\Violín Stradivarius Replica.jpg', 'cuerda'),
(123, 'Guitarra Acústica Martin', 'Guitarra acústica con un tono cálido y resonante.', 1199.99, 7, 'Imagenes\\Guitarra Acústica Martin.jpg', 'cuerda'),
(124, 'Violonchelo Yamaha', 'Violonchelo con un sonido profundo y resonante.', 1799.99, 4, 'Imagenes\\Violonchelo Yamaha.jpg', 'cuerda'),
(125, 'Arpa Lyon & Healy', 'Arpa de pedales con un diseño elegante y un sonido magnífico.', 9999.99, 1, 'Imagenes\\Arpa Lyon & Healy.jpg', 'cuerda'),
(126, 'Contrabajo Stentor', 'Contrabajo adecuado para estudiantes y profesionales.', 2499.99, 3, 'Imagenes\\Contrabajo Stentor.jpg', 'cuerda'),
(127, 'Batería Pearl', 'Set completo de batería para todos los niveles de habilidad.', 799.99, 6, 'Imagenes\\Batería Pearl.jpg', 'percusion'),
(128, 'Cajón Flamenco Meinl', 'Cajón flamenco con un sonido nítido y claro.', 149.99, 10, 'Imagenes\\Cajón Flamenco Meinl.jpg', 'percusion'),
(129, 'Timbal LP', 'Timbal de alta calidad con un sonido fuerte y resonante.', 399.99, 5, 'Imagenes\\Timbal LP.jpg', 'percusion'),
(130, 'Xilófono Yamaha', 'Xilófono de madera con un sonido brillante y claro.', 499.99, 8, 'Imagenes\\Xilófono Yamaha.jpg', 'percusion'),
(131, 'Bongos Meinl', 'Bongos con un diseño tradicional y un sonido auténtico.', 199.99, 9, 'Imagenes\\Bongos Meinl.jpg', 'percusion'),
(132, 'Piano de Cola Steinway & Sons', 'Piano de cola con un sonido inigualable, perfecto para conciertos.', 99999.99, 1, 'Imagenes\\Piano de Cola Steinway & Sons.jpg', 'destacados'),
(133, 'Guitarra Eléctrica Fender Stratocaster', 'Guitarra eléctrica icónica utilizada por los mejores guitarristas.', 1399.99, 6, 'Imagenes\\Guitarra Eléctrica Fender Stratocaster.jpg', 'destacados'),
(134, 'Saxofón Tenor Yamaha', 'Saxofón tenor con un sonido cálido y suave.', 1599.99, 4, 'Imagenes\\Saxofón Tenor Yamaha.jpg', 'destacados'),
(135, 'Violín Eléctrico Yamaha', 'Violín eléctrico con una amplia gama de sonidos.', 999.99, 5, 'Imagenes\\Violín Eléctrico Yamaha.jpg', 'destacados'),
(136, 'Teclado Roland Fantom', 'Teclado electrónico con una vasta variedad de sonidos y efectos.', 2999.99, 2, 'Imagenes\\Teclado Roland Fantom.jpg', 'especial');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones`
--

CREATE TABLE `sesiones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `rol` enum('cliente','administrador') DEFAULT 'cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `correo`, `contrasena`, `nombre_completo`, `telefono`, `direccion`, `rol`) VALUES
(1, 'admin', 'admin@ejemplo.com', 'admin123', 'Usuario Administrador', NULL, NULL, 'administrador'),
(8, 'Alejo', 'alejo@admin.com', 'admin', 'Diego Alejandro Ramos Morales', NULL, 'Cll 2a #18a-37', 'administrador'),
(9, 'Carlos', 'carlos@cliente.com', 'carlos', 'carlos rodriguez', '3112511593', 'cll 72csur #48-10', 'cliente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalles_ordenes`
--
ALTER TABLE `detalles_ordenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orden_id` (`orden_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalles_ordenes`
--
ALTER TABLE `detalles_ordenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles_ordenes`
--
ALTER TABLE `detalles_ordenes`
  ADD CONSTRAINT `detalles_ordenes_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalles_ordenes_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
