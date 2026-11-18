import { colores } from "@/shared/theme/colores";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.primario },
        headerTintColor: colores.sobrePrimario,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Libros" }} />
      <Stack.Screen name="libro/nuevo" options={{ title: "Nuevo libro" }} />
      <Stack.Screen name="libro/[id]" options={{ title: "Editar libro" }} />
    </Stack>
  );
}