import { FormularioLibroScreen } from "@/modules/libro/presentation/screens/FormularioLibroScreen";
import { useLocalSearchParams } from "expo-router";

export default function EditarLibro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FormularioLibroScreen id={id} />;
}