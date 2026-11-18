import { supabase } from "@/core/supabase/cliente";
import type { Libro } from "../../domain/entities/Libro";
import type { LibroRepository } from "../../domain/ports/LibroRepository";

const TABLA = "libro";

// Así se ve una fila de la tabla en Supabase.
type FilaLibro = {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
};

function aEntidad(fila: FilaLibro): Libro {
  return {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    categoria: fila.categoria,
    ubicacion: fila.ubicacion,
  };
}

function aFila(libro: Libro): FilaLibro {
  return {
    id: libro.id,
    nombre: libro.nombre,
    descripcion: libro.descripcion,
    categoria: libro.categoria,
    ubicacion: libro.ubicacion,
  };
}

export class LibroRepositorySupabase implements LibroRepository {
  async obtenerTodos(): Promise<Libro[]> {
    const { data, error } = await supabase.from(TABLA).select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(aEntidad);
  }

  async obtenerPorId(id: string): Promise<Libro | null> {
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? aEntidad(data) : null;
  }

  async guardar(libro: Libro): Promise<void> {
    const { error } = await supabase.from(TABLA).insert(aFila(libro));
    if (error) throw new Error(error.message);
  }

  async actualizar(libro: Libro): Promise<void> {
    // .select("id") devuelve las filas realmente modificadas.
    const { data, error } = await supabase
      .from(TABLA)
      .update(aFila(libro))
      .eq("id", libro.id)
      .select("id");

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error(
        "No se actualizó ninguna fila: el libro no existe o falta la política RLS.",
      );
    }
  }

  async eliminar(id: string): Promise<void> {
    const { data, error } = await supabase
      .from(TABLA)
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error(
        "No se eliminó ninguna fila: el libro no existe o falta la política RLS.",
      );
    }
  }
}