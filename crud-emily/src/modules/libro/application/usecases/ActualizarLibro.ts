import type { Libro } from "../../domain/entities/Libro";
import type { LibroRepository } from "../../domain/ports/LibroRepository";
import {
    limpiarDatos,
    validarLibro,
    type DatosLibro,
    type ErroresLibro,
} from "../../domain/rules/validarLibro";

export type ResultadoActualizarLibro =
  | { ok: true; libro: Libro }
  | { ok: false; errores: ErroresLibro };

export class ActualizarLibro {
  constructor(private readonly repositorio: LibroRepository) {}

  async ejecutar(id: string, datos: DatosLibro): Promise<ResultadoActualizarLibro> {
    const limpios = limpiarDatos(datos);

    const errores = validarLibro(limpios);
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores };
    }

    const libro: Libro = { id, ...limpios };
    await this.repositorio.actualizar(libro);
    return { ok: true, libro };
  }
}