export function saveTextAsFile(text: string, name: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function saveCsv(nombre: string, encabezados: string[], filas: (string | number)[][]): void {
  const escapar = (v: string | number) => `"${String(v).replace(/"/g, "\"\"")}"`;
  const lineas = [encabezados, ...filas].map((f) => f.map(escapar).join(","));
  // BOM para que Excel respete las tildes
  const blob = new Blob(["\uFEFF" + lineas.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}
