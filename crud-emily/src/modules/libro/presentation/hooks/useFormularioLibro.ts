import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { actualizarLibro, crearLibro, obtenerLibroPorId } from "../../composicion";
import type { DatosLibro, ErroresLibro } from "../../domain/rules/validarLibro";

const DATOS_VACIOS: DatosLibro = {
  nombre: "",
  descripcion: "",
  categoria: "",
  ubicacion: "",
};

// Sin id = crear un libro nuevo. Con id = editar el libro que ya existe.
export function useFormularioLibro(id?: string) {
  const router = useRouter();
  const [datos, setDatos] = useState<DatosLibro>(DATOS_VACIOS);
  const [errores, setErrores] = useState<ErroresLibro>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [cargando, setCargando] = useState(id !== undefined);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (id === undefined) return;
    obtenerLibroPorId
      .ejecutar(id)
      .then((libro) => {
        if (libro) {
          setDatos({
            nombre: libro.nombre,
            descripcion: libro.descripcion,
            categoria: libro.categoria,
            ubicacion: libro.ubicacion,
          });
        } else {
          setErrorGeneral("Este libro ya no existe.");
        }
      })
      .catch(() => setErrorGeneral("No se pudo cargar el libro."))
      .finally(() => setCargando(false));
  }, [id]);

  function cambiar(campo: keyof DatosLibro, valor: string) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function guardar() {
    setGuardando(true);
    setErrorGeneral(null);
    try {
      const resultado =
        id === undefined
          ? await crearLibro.ejecutar(datos)
          : await actualizarLibro.ejecutar(id, datos);

      if (!resultado.ok) {
        setErrores(resultado.errores);
        return;
      }
      router.back();
    } catch {
      setErrorGeneral("No se pudo guardar. Revisa tu internet e inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return { datos, errores, errorGeneral, cargando, guardando, cambiar, guardar };
}