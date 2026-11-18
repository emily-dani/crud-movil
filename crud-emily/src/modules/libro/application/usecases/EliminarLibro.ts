import type { LibroRepository } from "../../domain/ports/LibroRepository";

export class EliminarLibro {
  constructor(private readonly repositorio: LibroRepository) {}

  async ejecutar(id: string): Promise<void> {
    await this.repositorio.eliminar(id);
  }
}