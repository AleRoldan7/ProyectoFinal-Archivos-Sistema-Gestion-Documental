import Swal from "sweetalert2";
import { errorMessage } from "./http-error";

export async function pedirTexto(titulo: string, valorInicial = "", etiqueta = "Nombre"): Promise<string | null> {
  const r = await Swal.fire({
    title: titulo,
    input: "text",
    inputValue: valorInicial,
    inputLabel: etiqueta,
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    inputValidator: (v) => (v.trim() ? null : "Este campo es obligatorio"),
  });
  return r.isConfirmed ? String(r.value).trim() : null;
}

export async function confirmar(titulo: string, texto = "", textoBoton = "Confirmar", peligro = false): Promise<boolean> {
  const r = await Swal.fire({
    icon: peligro ? "warning" : "question",
    title: titulo,
    text: texto,
    showCancelButton: true,
    confirmButtonText: textoBoton,
    cancelButtonText: "Cancelar",
    confirmButtonColor: peligro ? "#dc2626" : "#1d4ed8",
  });
  return r.isConfirmed;
}

export function exito(mensaje: string): void {
  void Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: mensaje, timer: 2200, showConfirmButton: false });
}

export function fallo(err: unknown): void {
  const texto = typeof err === "string" ? err : errorMessage(err);
  void Swal.fire({ icon: "error", title: "Ups", text: texto });
}
