import type { Libro } from "../../domain/entities/Libro";
import type { LibroRepository } from "../../domain/ports/LibroRepository";

export class ObtenerLibroPorId {
  constructor(private readonly repositorio: LibroRepository) {}

  async ejecutar(id: string): Promise<Libro | null> {
    return this.repositorio.obtenerPorId(id);
  }
}