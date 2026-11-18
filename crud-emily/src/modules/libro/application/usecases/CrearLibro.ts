import type { Libro } from "../../domain/entities/Libro";
import type { LibroRepository } from "../../domain/ports/LibroRepository";
import {
    limpiarDatos,
    validarLibro,
    type DatosLibro,
    type ErroresLibro,
} from "../../domain/rules/validarLibro";

export type ResultadoCrearLibro =
  | { ok: true; libro: Libro }
  | { ok: false; errores: ErroresLibro };

function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export class CrearLibro {
  constructor(private readonly repositorio: LibroRepository) {}

  async ejecutar(datos: DatosLibro): Promise<ResultadoCrearLibro> {
    const limpios = limpiarDatos(datos);

    const errores = validarLibro(limpios);
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores };
    }

    const libro: Libro = { id: generarId(), ...limpios };
    await this.repositorio.guardar(libro);
    return { ok: true, libro };
  }
}