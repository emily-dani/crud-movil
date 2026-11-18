import type { Libro } from "../entities/Libro";

/** Lo que escribe el usuario: todo el libro menos el id (lo genera el sistema). */
export type DatosLibro = Omit<Libro, "id">;

/** Un mensaje de error por campo; si el campo está bien, no aparece. */
export type ErroresLibro = Partial<Record<keyof DatosLibro, string>>;

export function validarLibro(datos: DatosLibro): ErroresLibro {
  const errores: ErroresLibro = {};

  if (datos.nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 caracteres.";
  }
  if (datos.descripcion.trim().length < 10) {
    errores.descripcion = "La descripción debe tener al menos 10 caracteres.";
  }
  if (datos.categoria.trim().length === 0) {
    errores.categoria = "Escribe una categoría (por ejemplo: Novela).";
  }
  if (datos.ubicacion.trim().length === 0) {
    errores.ubicacion = "Escribe la ubicación del libro.";
  }

  return errores;
}

/** Quita los espacios sobrantes al inicio y al final de cada campo. */
export function limpiarDatos(datos: DatosLibro): DatosLibro {
  return {
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    categoria: datos.categoria.trim(),
    ubicacion: datos.ubicacion.trim(),
  };
}