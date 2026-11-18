import { ActualizarLibro } from "../application/usecases/ActualizarLibro";
import { CrearLibro } from "../application/usecases/CrearLibro";
import { EliminarLibro } from "../application/usecases/EliminarLibro";
import { ObtenerLibroPorId } from "../application/usecases/ObtenerLibroPorId";
import { ObtenerLibros } from "../application/usecases/ObtenerLibros";
import type { Libro } from "../domain/entities/Libro";
import type { LibroRepository } from "../domain/ports/LibroRepository";

// Repositorio falso: guarda en un arreglo, sin Supabase ni internet.
class RepositorioEnMemoria implements LibroRepository {
  libros: Libro[] = [];

  async guardar(libro: Libro) {
    this.libros.push(libro);
  }

  async obtenerTodos() {
    return this.libros;
  }

  async obtenerPorId(id: string) {
    return this.libros.find((l) => l.id === id) ?? null;
  }

  async actualizar(libro: Libro) {
    this.libros = this.libros.map((l) => (l.id === libro.id ? libro : l));
  }

  async eliminar(id: string) {
    this.libros = this.libros.filter((l) => l.id !== id);
  }
}

const datosValidos = {
  nombre: "Cien años de soledad",
  descripcion: "Novela clásica sobre la familia Buendía en Macondo.",
  categoria: "Novela",
  ubicacion: "Estante A - Nivel 2",
};

describe("CrearLibro", () => {
  it("guarda un libro válido y le asigna un id", async () => {
    const repo = new RepositorioEnMemoria();
    const resultado = await new CrearLibro(repo).ejecutar(datosValidos);

    expect(resultado.ok).toBe(true);
    expect(repo.libros).toHaveLength(1);
    expect(repo.libros[0].id).not.toBe("");
    expect(repo.libros[0].nombre).toBe("Cien años de soledad");
  });

  it("no guarda si hay campos inválidos y devuelve los errores", async () => {
    const repo = new RepositorioEnMemoria();
    const resultado = await new CrearLibro(repo).ejecutar({
      ...datosValidos,
      nombre: "  ",
      categoria: "",
    });

    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(Object.keys(resultado.errores).sort()).toEqual(["categoria", "nombre"]);
    }
    expect(repo.libros).toHaveLength(0);
  });

  it("elimina espacios sobrantes antes de guardar", async () => {
    const repo = new RepositorioEnMemoria();
    await new CrearLibro(repo).ejecutar({ ...datosValidos, nombre: "  Don Quijote  " });

    expect(repo.libros[0].nombre).toBe("Don Quijote");
  });
});

describe("ObtenerLibros", () => {
  it("devuelve los libros en orden alfabético", async () => {
    const repo = new RepositorioEnMemoria();
    const crear = new CrearLibro(repo);
    await crear.ejecutar({ ...datosValidos, nombre: "Rayuela" });
    await crear.ejecutar({ ...datosValidos, nombre: "Alicia en el país de las maravillas" });

    const libros = await new ObtenerLibros(repo).ejecutar();

    expect(libros.map((l) => l.nombre)).toEqual([
      "Alicia en el país de las maravillas",
      "Rayuela",
    ]);
  });

  it("devuelve una lista vacía si no hay libros", async () => {
    expect(await new ObtenerLibros(new RepositorioEnMemoria()).ejecutar()).toEqual([]);
  });
});

describe("ObtenerLibroPorId", () => {
  it("devuelve el libro si existe y null si no existe", async () => {
    const repo = new RepositorioEnMemoria();
    const creado = await new CrearLibro(repo).ejecutar(datosValidos);
    if (!creado.ok) throw new Error("No se pudo crear");

    const caso = new ObtenerLibroPorId(repo);
    expect((await caso.ejecutar(creado.libro.id))?.nombre).toBe(
      "Cien años de soledad",
    );
    expect(await caso.ejecutar("no-existe")).toBeNull();
  });
});

describe("ActualizarLibro", () => {
  it("cambia los datos del libro y conserva su id", async () => {
    const repo = new RepositorioEnMemoria();
    const creado = await new CrearLibro(repo).ejecutar(datosValidos);
    if (!creado.ok) throw new Error("No se pudo crear");

    const resultado = await new ActualizarLibro(repo).ejecutar(creado.libro.id, {
      ...datosValidos,
      nombre: "  El amor en los tiempos del cólera ",
    });

    expect(resultado.ok).toBe(true);
    expect(repo.libros).toHaveLength(1);
    expect(repo.libros[0].id).toBe(creado.libro.id);
    expect(repo.libros[0].nombre).toBe("El amor en los tiempos del cólera");
  });

  it("no actualiza si los datos son inválidos", async () => {
    const repo = new RepositorioEnMemoria();
    const creado = await new CrearLibro(repo).ejecutar(datosValidos);
    if (!creado.ok) throw new Error("No se pudo crear");

    const resultado = await new ActualizarLibro(repo).ejecutar(creado.libro.id, {
      ...datosValidos,
      ubicacion: "",
    });

    expect(resultado.ok).toBe(false);
    expect(repo.libros[0].ubicacion).toBe("Estante A - Nivel 2");
  });
});

describe("EliminarLibro", () => {
  it("elimina solo el libro indicado", async () => {
    const repo = new RepositorioEnMemoria();
    const crear = new CrearLibro(repo);
    const a = await crear.ejecutar({ ...datosValidos, nombre: "Rayuela" });
    await crear.ejecutar({ ...datosValidos, nombre: "Don Quijote" });
    if (!a.ok) throw new Error("No se pudo crear");

    await new EliminarLibro(repo).ejecutar(a.libro.id);
    expect(repo.libros.map((l) => l.nombre)).toEqual(["Don Quijote"]);
  });
});