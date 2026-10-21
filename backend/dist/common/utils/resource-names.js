export async function adjuntarNombres(shares, files, folders) {
    const idsDe = (tipo) => shares.filter((s) => s.resourceType === tipo).map((s) => s.resourceId);
    const [archivos, carpetas] = await Promise.all([
        files.find({ _id: { $in: idsDe('FILE') } }).select('name'),
        folders.find({ _id: { $in: idsDe('FOLDER') } }).select('name'),
    ]);
    const nombres = new Map([...archivos, ...carpetas].map((d) => [d.id, d.name]));
    return shares.map((s) => ({ ...s.toObject(), resourceName: nombres.get(String(s.resourceId)) ?? null }));
}
//# sourceMappingURL=resource-names.js.map