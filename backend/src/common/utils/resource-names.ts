import { Model } from 'mongoose';


export async function adjuntarNombres<T extends { resourceType: string; resourceId: any; toObject(): any }>(
  shares: T[],
  files: Model<any>,
  folders: Model<any>,
) {
  const idsDe = (tipo: string) => shares.filter((s) => s.resourceType === tipo).map((s) => s.resourceId);

  const [archivos, carpetas] = await Promise.all([
    files.find({ _id: { $in: idsDe('FILE') } }).select('name'),
    folders.find({ _id: { $in: idsDe('FOLDER') } }).select('name'),
  ]);

  const nombres = new Map<string, string>([...archivos, ...carpetas].map((d: any) => [d.id as string, d.name as string]));

  return shares.map((s) => ({ ...s.toObject(), resourceName: nombres.get(String(s.resourceId)) ?? null }));
}
