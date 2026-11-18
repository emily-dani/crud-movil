import type { Libro } from "../../domain/entities/Libro";
import type { LibroRepository } from "../../domain/ports/LibroRepository";

export class ObtenerLibros {
  constructor(private readonly repositorio: LibroRepository) {}

  async ejecutar(): Promise<Libro[]> {
    const libros = await this.repositorio.obtenerTodos();
    return [...libros].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }
}