import type { Libro } from "../entities/Libro";

export interface LibroRepository {
  guardar(libro: Libro): Promise<void>;
  obtenerTodos(): Promise<Libro[]>;
  obtenerPorId(id: string): Promise<Libro | null>;
  actualizar(libro: Libro): Promise<void>;
  eliminar(id: string): Promise<void>;
}