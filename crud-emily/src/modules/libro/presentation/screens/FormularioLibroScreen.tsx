import { Boton } from "@/shared/components/Boton";
import { CampoTexto } from "@/shared/components/CampoTexto";
import { colores } from "@/shared/theme/colores";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFormularioLibro } from "../hooks/useFormularioLibro";

type Props = {
  id?: string;
};

export function FormularioLibroScreen({ id }: Props) {
  const { datos, errores, errorGeneral, cargando, guardando, cambiar, guardar } =
    useFormularioLibro(id);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
    >
      <CampoTexto
        etiqueta="Nombre"
        value={datos.nombre}
        onChangeText={(texto) => cambiar("nombre", texto)}
        error={errores.nombre}
        placeholder="Cien años de soledad"
      />
      <CampoTexto
        etiqueta="Descripción"
        value={datos.descripcion}
        onChangeText={(texto) => cambiar("descripcion", texto)}
        error={errores.descripcion}
        placeholder="De qué trata el libro o sinopsis"
        multiline
        numberOfLines={4}
        style={styles.multilinea}
      />
      <CampoTexto
        etiqueta="Categoría"
        value={datos.categoria}
        onChangeText={(texto) => cambiar("categoria", texto)}
        error={errores.categoria}
        placeholder="Novela, ciencia ficción, historia…"
      />
      <CampoTexto
        etiqueta="Ubicación"
        value={datos.ubicacion}
        onChangeText={(texto) => cambiar("ubicacion", texto)}
        error={errores.ubicacion}
        placeholder="Estante A, Biblioteca…"
      />
      {errorGeneral ? <Text style={styles.errorGeneral}>{errorGeneral}</Text> : null}
      <Boton
        titulo={id ? "Guardar cambios" : "Registrar libro"}
        onPress={guardar}
        cargando={guardando}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  contenido: { padding: 16, gap: 16 },
  multilinea: { minHeight: 96, textAlignVertical: "top" },
  errorGeneral: { color: colores.error, fontSize: 14 },
});