-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-02-2024 a las 02:01:22
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
-- Base de datos: `db - manzanas del cuidado`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manzanas`
--

CREATE TABLE `manzanas` ( 
  `Codigo_manzana` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Localidad` varchar(50) NOT NULL,
  `Dirección` varchar(50) NOT NULL,
  `Codigo_servicio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `manzanas`
--

INSERT INTO `manzanas` (`Codigo_manzana`, `Nombre`, `Localidad`, `Dirección`, `Codigo_servicio`) VALUES
(1, 'Manzana de Bosa', 'Bosa', 'Kra 60 # 22-15', 1),
(2, 'Manzana de Puente Aranda', 'Puente Aranda', 'Kra 22 - 11', 2),
(3, 'Manzana de Ciudad Bolivar', 'Ciudad Bolivar', 'Calle 2 # 2B-11', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manzanas_servicios`
--

CREATE TABLE `manzanas_servicios` (
  `Codigo_manzana` int(11) DEFAULT NULL,
  `Codigo_servicio` int(11) DEFAULT NULL,
  `Fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `Codigo_servicio` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Tipo` varchar(50) NOT NULL,
  `Descripción` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`Codigo_servicio`, `Nombre`, `Tipo`, `Descripción`) VALUES
(1, 'Lavanderia', 'Aseo', 'Se lavan las prendas de las mujeres cuidadoras'),
(2, 'Curso de ajedrez', 'Hobby', 'En este curso aprenderás sobre los fundamentos básicos del ajedrez'),
(3, 'Programación', 'Aprendizaje', 'Acá aprenderás fundamentos básicos para programar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `ID_solicitud` int(11) NOT NULL,
  `Fecha` datetime NOT NULL,
  `ID_Usuario` int(11) DEFAULT NULL,
  `Codigo_servicio` int(11) DEFAULT NULL,
  `Codigo_manzana` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`ID_solicitud`, `Fecha`, `ID_Usuario`, `Codigo_servicio`, `Codigo_manzana`) VALUES
(22, '0000-00-00 00:00:00', 11, 1, NULL),
(23, '0000-00-00 00:00:00', 11, 1, NULL),
(24, '0000-00-00 00:00:00', 11, 3, NULL),
(25, '0000-00-00 00:00:00', 5, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID_Usuario` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `TipoDocumento` enum('cedula de ciudadanía','pasaporte','tarjeta de identidad') NOT NULL,
  `Documento` varchar(50) NOT NULL,
  `Rol` set('Administrador','Usuario') NOT NULL,
  `Codigo_manzana` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`ID_Usuario`, `Nombre`, `TipoDocumento`, `Documento`, `Rol`, `Codigo_manzana`) VALUES
(1, 'Jhonatan Pulido Soler', 'cedula de ciudadanía', '1016947390', 'Administrador', NULL),
(2, 'Carlos', 'tarjeta de identidad', '123', 'Usuario', NULL),
(3, 'Ramiro', 'cedula de ciudadanía', '101010', 'Usuario', NULL),
(4, 'Juan', 'cedula de ciudadanía', '111111', 'Usuario', NULL),
(5, 'Sofia', 'cedula de ciudadanía', '777', 'Usuario', NULL),
(6, 'Laura', 'tarjeta de identidad', '123456', 'Usuario', NULL),    
(7, 'Laura Soler', 'cedula de ciudadanía', '1234567', 'Usuario', NULL),
(8, 'Franciso Perez', 'cedula de ciudadanía', '55', 'Usuario', NULL),
(9, 'Julian', 'tarjeta de identidad', '90', 'Usuario', NULL),
(10, 'Wendy', 'cedula de ciudadanía', '100', 'Usuario', NULL),
(11, 'Julian Mondragon', 'cedula de ciudadanía', '12', 'Usuario', NULL),
(12, 'Kevin Guerrero', 'tarjeta de identidad', '1', 'Usuario', NULL),
(13, 'Vanesa', 'cedula de ciudadanía', '100020003000', 'Usuario', NULL),
(14, 'Mclovin', 'cedula de ciudadanía', 'miami', 'Usuario', NULL),
(15, 'Lapopodelapopo', 'tarjeta de identidad', '1034787778', 'Usuario', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `manzanas`
--
ALTER TABLE `manzanas`
  ADD PRIMARY KEY (`Codigo_manzana`),
  ADD KEY `Codigo_servicio` (`Codigo_servicio`);

--
-- Indices de la tabla `manzanas_servicios`
--
ALTER TABLE `manzanas_servicios`
  ADD KEY `Codigo_manzana` (`Codigo_manzana`),
  ADD KEY `Codigo_servicio` (`Codigo_servicio`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`Codigo_servicio`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`ID_solicitud`),
  ADD KEY `ID_Usuario` (`ID_Usuario`),
  ADD KEY `Codigo_servicio` (`Codigo_servicio`),
  ADD KEY `Codigo_manzana` (`Codigo_manzana`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD KEY `Codigo_manzana` (`Codigo_manzana`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `manzanas`
--
ALTER TABLE `manzanas`
  MODIFY `Codigo_manzana` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `Codigo_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `ID_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `manzanas`
--
ALTER TABLE `manzanas`
  ADD CONSTRAINT `manzanas_ibfk_1` FOREIGN KEY (`Codigo_servicio`) REFERENCES `servicios` (`Codigo_servicio`);

--
-- Filtros para la tabla `manzanas_servicios`
--
ALTER TABLE `manzanas_servicios`
  ADD CONSTRAINT `manzanas_servicios_ibfk_1` FOREIGN KEY (`Codigo_manzana`) REFERENCES `manzanas` (`Codigo_manzana`),
  ADD CONSTRAINT `manzanas_servicios_ibfk_2` FOREIGN KEY (`Codigo_servicio`) REFERENCES `servicios` (`Codigo_servicio`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuarios` (`ID_Usuario`),
  ADD CONSTRAINT `solicitudes_ibfk_2` FOREIGN KEY (`Codigo_servicio`) REFERENCES `servicios` (`Codigo_servicio`),
  ADD CONSTRAINT `solicitudes_ibfk_3` FOREIGN KEY (`Codigo_manzana`) REFERENCES `manzanas` (`Codigo_manzana`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`Codigo_manzana`) REFERENCES `manzanas` (`Codigo_manzana`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
