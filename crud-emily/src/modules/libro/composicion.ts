import { ActualizarLibro } from "./application/usecases/ActualizarLibro";
import { CrearLibro } from "./application/usecases/CrearLibro";
import { EliminarLibro } from "./application/usecases/EliminarLibro";
import { ObtenerLibroPorId } from "./application/usecases/ObtenerLibroPorId";
import { ObtenerLibros } from "./application/usecases/ObtenerLibros";
import { LibroRepositorySupabase } from "./infrastructure/repositories/LibroRepositorySupabase";

// Único lugar donde se decide qué implementación concreta se usa.
const repositorio = new LibroRepositorySupabase();

export const crearLibro = new CrearLibro(repositorio);
export const obtenerLibros = new ObtenerLibros(repositorio);
export const obtenerLibroPorId = new ObtenerLibroPorId(repositorio);
export const actualizarLibro = new ActualizarLibro(repositorio);
export const eliminarLibro = new EliminarLibro(repositorio);