import { colores } from "@/shared/theme/colores";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Libro } from "../../domain/entities/Libro";

type Props = {
  libro: Libro;
  onEditar: () => void;
  onEliminar: () => void;
};

export function LibroCard({ libro, onEditar, onEliminar }: Props) {
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.categoria}>{libro.categoria}</Text>
      <Text style={styles.nombre}>{libro.nombre}</Text>
      <Text style={styles.ubicacion}>{libro.ubicacion}</Text>
      <Text style={styles.descripcion}>{libro.descripcion}</Text>

      <View style={styles.acciones}>
        <Pressable onPress={onEditar} hitSlop={8}>
          <Text style={styles.accion}>Editar</Text>
        </Pressable>
        <Pressable onPress={onEliminar} hitSlop={8}>
          <Text style={[styles.accion, styles.peligro]}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 16,
    gap: 4,
  },
  categoria: {
    fontSize: 12,
    fontWeight: "700",
    color: colores.primario,
    textTransform: "uppercase",
  },
  nombre: { fontSize: 18, fontWeight: "700", color: colores.texto },
  ubicacion: { fontSize: 14, color: colores.textoSuave },
  descripcion: { fontSize: 15, color: colores.texto, marginTop: 4 },
  acciones: { flexDirection: "row", gap: 24, marginTop: 12 },
  accion: { fontSize: 15, fontWeight: "700", color: colores.primario },
  peligro: { color: colores.error },
});