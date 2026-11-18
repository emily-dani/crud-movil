import { Boton } from "@/shared/components/Boton";
import { colores } from "@/shared/theme/colores";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import type { Libro } from "../../domain/entities/Libro";
import { LibroCard } from "../components/LibroCard";
import { useLibros } from "../hooks/useLibros";

export function ListaLibrosScreen() {
  const router = useRouter();
  const { libros, cargando, refrescando, error, refrescar, eliminar } = useLibros();

  function confirmarEliminar(libro: Libro) {
    Alert.alert(
      "Eliminar libro",
      `¿Eliminar "${libro.nombre}"? No se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const eliminado = await eliminar(libro.id);
            if (!eliminado) Alert.alert("Error", "No se pudo eliminar el libro.");
          },
        },
      ],
    );
  }

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centro}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={libros}
        keyExtractor={(libro) => libro.id}
        renderItem={({ item }) => (
          <LibroCard
            libro={item}
            onEditar={() =>
              router.push({ pathname: "/libro/[id]", params: { id: item.id } })
            }
            onEliminar={() => confirmarEliminar(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no hay libros registrados.</Text>
        }
        contentContainerStyle={styles.lista}
        refreshing={refrescando}
        onRefresh={refrescar}
      />
      <View style={styles.pie}>
        <Boton
          titulo="Nuevo libro"
          onPress={() => router.push("/libro/nuevo")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  lista: { padding: 16 },
  separador: { height: 12 },
  vacio: { textAlign: "center", color: colores.textoSuave, marginTop: 32 },
  error: { color: colores.error, fontSize: 16, textAlign: "center" },
  pie: { padding: 16 },
});