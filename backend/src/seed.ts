import 'reflect-metadata';
import { Module, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { Connection, Model } from 'mongoose';
import { UserModule } from './users/module/user.module.js';
import { FolderModule } from './folders/module/folder.module.js';
import { FileModule } from './files/module/file.module.js';
import { ActivityModule } from './activity/module/activity.module.js';
import { SharingModule } from './sharing/module/sharing.module.js';
import { TrashModule } from './trash/module/trash.module.js';
import { Permission, ResourceType } from './common/enums/shraing.enum.js';
import { ActionActivity } from './common/enums/action-activity.enum.js';
import { UserService } from './users/service/user-service.service.js';
import { FolderService } from './folders/service/folder-service.service.js';
import { FileService } from './files/service/file-service.service.js';
import { GridFsService } from './files/service/gridfs-service.service.js';
import { ActivityService } from './activity/service/activity.service.js';
import { SharingService } from './sharing/service/sharing.service.js';
import { TrashService } from './trash/service/trash.service.js';
import { FileEntry, FileEntryDocument } from './files/schemas/file.schema.js';
import { Activity, ActivityDocument } from './activity/schemas/activity.schema.js';
import { Rol } from './common/enums/rol.enum.js';



/* ------------------------------------------------------------------ */
/*  Módulo mínimo: solo lo necesario, sin guards ni telemetría         */
/* ------------------------------------------------------------------ */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ uri: config.getOrThrow<string>('MONGO_URI') }),
    }),
    UserModule, FolderModule, FileModule, ActivityModule, SharingModule, TrashModule,
  ],
})
class SeedModule { }

/* ------------------------------------------------------------------ */
/*  Datos de demostración                                              */
/* ------------------------------------------------------------------ */
const CLAVE_DEMO = 'Demo12345';

const USUARIOS_DEMO = [
  { clave: 'ana', firstName: 'Ana', lastName: 'López', email: 'ana@gestor.com' },
  { clave: 'luis', firstName: 'Luis', lastName: 'Pérez', email: 'luis@gestor.com' },
  { clave: 'maria', firstName: 'María', lastName: 'Gómez', email: 'maria@gestor.com' },
];

// Se crean en orden: cada carpeta padre aparece antes que sus hijas
const CARPETAS: Record<string, string[]> = {
  ana: ['Proyectos', 'Proyectos/Compiladores', 'Proyectos/Base de Datos', 'Documentos', 'Documentos/Personal', 'Documentos/Trabajo', 'Universidad'],
  luis: ['Cursos', 'Cursos/Redes', 'Cursos/Sistemas Operativos', 'Notas', 'Respaldo', 'Respaldo/2025'],
  maria: ['Diseño', 'Diseño/Bocetos', 'Diseño/Manuales', 'Investigación', 'Investigación/Artículos', 'Investigación/Tesis', 'Recetas'],
  admin: ['Administración', 'Administración/Informes'],
};

// [carpeta (null = raíz), nombre del archivo]  →  17 + 14 + 13 + 6 (admin) = 50 archivos
const ARCHIVOS: Record<string, [string | null, string][]> = {
  ana: [
    ['Proyectos/Compiladores', 'analizador-lexico.md'], ['Proyectos/Compiladores', 'gramatica-ANTLR.txt'],
    ['Proyectos/Compiladores', 'tabla-de-simbolos.md'],
    ['Proyectos/Base de Datos', 'modelo-entidad-relacion.md'], ['Proyectos/Base de Datos', 'consultas-sql.txt'],
    ['Proyectos/Base de Datos', 'normalizacion.md'], ['Proyectos', 'plan-del-proyecto.md'],
    ['Documentos/Personal', 'lista-de-tareas.txt'], ['Documentos/Personal', 'metas-del-semestre.md'],
    ['Documentos/Trabajo', 'reunion-lunes.md'],
    ['Documentos/Trabajo', 'reunion-viernes.md'], ['Documentos/Trabajo', 'informe-mensual.txt'],
    ['Universidad', 'horario.txt'], ['Universidad', 'resumen-estructuras-de-datos.md'],
    ['Universidad', 'formulario-calculo.txt'], ['Universidad', 'bibliografia.md'],
    [null, 'LEEME.md'],
  ],
  luis: [
    ['Cursos/Redes', 'modelo-osi.md'], ['Cursos/Redes', 'direccionamiento-ip.txt'],
    ['Cursos/Redes', 'practica-subredes.md'], ['Cursos/Sistemas Operativos', 'planificacion-de-procesos.md'],
    ['Cursos/Sistemas Operativos', 'comandos-linux.txt'], ['Cursos/Sistemas Operativos', 'sincronizacion.md'],
    ['Cursos/Sistemas Operativos', 'memoria-virtual.txt'], ['Cursos', 'calendario-de-examenes.txt'],
    ['Notas', 'apuntes-clase-01.md'], ['Notas', 'apuntes-clase-02.md'],
    ['Notas', 'apuntes-clase-03.txt'],
    ['Respaldo/2025', 'configuracion-servidor.txt'], ['Respaldo/2025', 'scripts-utiles.md'],
    [null, 'diario.md'],
  ],
  maria: [
    ['Diseño/Bocetos', 'paleta-de-colores.txt'], ['Diseño/Bocetos', 'ideas-de-logo.md'],
    ['Diseño/Bocetos', 'wireframe-inicio.md'], ['Diseño/Manuales', 'guia-de-marca.md'],
    ['Investigación/Artículos', 'resumen-articulo-1.md'],
    ['Investigación/Artículos', 'resumen-articulo-2.md'], ['Investigación/Artículos', 'referencias.txt'],
    ['Investigación/Tesis', 'indice-tesis.md'], ['Investigación/Tesis', 'cronograma.txt'],
    ['Investigación/Tesis', 'marco-teorico.md'], ['Recetas', 'pan-casero.txt'],
    ['Recetas', 'salsa-de-tomate.md'], [null, 'notas-rapidas.txt'],
  ],
  admin: [
    ['Administración', 'politicas-de-uso.md'], ['Administración', 'usuarios-y-roles.txt'],
    ['Administración/Informes', 'informe-trimestral.md'], ['Administración/Informes', 'metricas-de-uso.txt'],
    [null, 'bienvenida.md'], [null, 'respaldo-semanal.txt'],
  ],
};

// Estas carpetas se usan para demostrar la papelera, así que no se comparten
const CARPETAS_PARA_PAPELERA = ['Universidad', 'Recetas'];

/* ------------------------------------------------------------------ */
/*  Utilidades                                                         */
/* ------------------------------------------------------------------ */
function contenido(nombre: string, semilla: number): string {
  const titulo = nombre.replace(/\.[^.]+$/, '').replace(/-/g, ' ');
  const lineas = Array.from({ length: 4 + ((semilla * 7) % 25) }, (_, k) => `Línea ${k + 1}: contenido de ejemplo para "${titulo}".`);
  return nombre.endsWith('.md')
    ? `# ${titulo}\n\n${lineas.map((l) => `- ${l}`).join('\n')}\n`
    : `${titulo.toUpperCase()}\n\n${lineas.join('\n')}\n`;
}

/** FileService decodifica el nombre como lo hace multer (latin1 -> utf8); se lo entregamos así. */
function comoMulter(nombre: string, texto: string): Express.Multer.File {
  const buffer = Buffer.from(texto, 'utf8');
  return {
    fieldname: 'file', encoding: '7bit', mimetype: 'text/plain',
    originalname: Buffer.from(nombre, 'utf8').toString('latin1'),
    buffer, size: buffer.length,
  } as Express.Multer.File;
}

interface Dueno { clave: string; id: string; nombre: string }
interface CarpetaSeed { id: string; ruta: string; dueno: Dueno }
interface ArchivoSeed { id: string; nombre: string; ruta: string | null; dueno: Dueno; indice: number }
interface ShareSeed { id: string; dueno: Dueno; permiso: Permission; tipo: ResourceType }

/* ------------------------------------------------------------------ */
/*  Programa principal                                                 */
/* ------------------------------------------------------------------ */
async function sembrar() {
  const reiniciar = process.argv.includes('--reset');

  const app = await NestFactory.createApplicationContext(SeedModule, { logger: ['error', 'warn'] });
  const obtener = <T>(tipo: Type<T>) => app.get(tipo, { strict: false });

  const config = obtener(ConfigService);
  const usuarios = obtener(UserService);
  const carpetasSrv = obtener(FolderService);
  const archivosSrv = obtener(FileService);
  const gridFs = obtener(GridFsService);
  const actividad = obtener(ActivityService);
  const compartir = obtener(SharingService);
  const papelera = obtener(TrashService);
  const conexion = app.get<Connection>(getConnectionToken(), { strict: false });
  const modeloArchivos = app.get<Model<FileEntryDocument>>(getModelToken(FileEntry.name), { strict: false });
  const modeloActividad = app.get<Model<ActivityDocument>>(getModelToken(Activity.name), { strict: false });
  const db = conexion.db!;

  const correoAdmin = config.getOrThrow<string>('ADMIN_EMAIL').toLowerCase().trim();

  /* ---------- reinicio opcional ---------- */
  if (reiniciar) {
    console.log('⚠️  --reset: se borran carpetas, archivos, contenido GridFS, comparticiones, actividad y todos los usuarios excepto el administrador.');
    for (const c of ['folders', 'files', 'shares', 'activities', 'file_contents.files', 'file_contents.chunks']) {
      await db.collection(c).deleteMany({});
    }
    await db.collection('users').deleteMany({ email: { $ne: correoAdmin } });
  } else if (await db.collection('users').findOne({ email: USUARIOS_DEMO[0].email })) {
    console.log('Los datos de demostración ya existen. Usa "npm run seed:reset" para volver a generarlos.');
    await app.close();
    return;
  }

  const inicio = new Date(Date.now() - 1000);

  /* ---------- 1. usuarios ---------- */
  const admin = await usuarios.findByEmailWithPassword(correoAdmin);
  if (!admin) throw new Error('No existe el usuario administrador. Revisa las variables ADMIN_* del .env y arranca el backend una vez.');

  const duenos: Dueno[] = [];
  for (const u of USUARIOS_DEMO) {
    const creado = await usuarios.create({ firstName: u.firstName, lastName: u.lastName, email: u.email, password: CLAVE_DEMO, rol: Rol.USUARIO });
    duenos.push({ clave: u.clave, id: creado.id, nombre: `${u.firstName} ${u.lastName}` });
  }
  const adminDueno: Dueno = { clave: 'admin', id: admin.id, nombre: 'Administrador' };
  const todosLosUsuarios = [...duenos, adminDueno];
  const participantes = todosLosUsuarios; // el administrador del .env también tiene carpetas, archivos y comparticiones propias

  for (const u of todosLosUsuarios) await actividad.register(u.id, ActionActivity.LOGIN, 'USER', u.id);

  /* ---------- 2. carpetas ---------- */
  const carpetas: CarpetaSeed[] = [];
  const carpetaPorRuta = new Map<string, CarpetaSeed>(); // clave: "usuario|ruta"
  for (const d of participantes) {
    for (const ruta of CARPETAS[d.clave]) {
      const partes = ruta.split('/');
      const padre = partes.length > 1 ? carpetaPorRuta.get(`${d.clave}|${partes.slice(0, -1).join('/')}`) : undefined;
      const creada = await carpetasSrv.create(d.id, { name: partes[partes.length - 1], parentId: padre?.id });
      const registro: CarpetaSeed = { id: creada.id, ruta, dueno: d };
      carpetas.push(registro);
      carpetaPorRuta.set(`${d.clave}|${ruta}`, registro);
      await actividad.register(d.id, ActionActivity.CREATE_FOLDER, 'FOLDER', creada.id, creada.name);
    }
  }
  for (const u of todosLosUsuarios) await actividad.register(u.id, ActionActivity.LOGIN, 'USER', u.id);

  /* ---------- 3. archivos ---------- */
  const archivos: ArchivoSeed[] = [];
  let contador = 0;
  for (const d of participantes) {
    for (const [ruta, nombre] of ARCHIVOS[d.clave]) {
      const carpeta = ruta ? carpetaPorRuta.get(`${d.clave}|${ruta}`) : undefined;
      const subido = await archivosSrv.upload(d.id, carpeta?.id, comoMulter(nombre, contenido(nombre, contador)));
      archivos.push({ id: subido.id, nombre: subido.name, ruta, dueno: d, indice: contador });
      await actividad.register(d.id, ActionActivity.UPLOAD_FILE, 'FILE', subido.id, subido.name);
      contador++;
    }
  }
  const actividadesDeCreacion = await modeloActividad.countDocuments({ createdAt: { $gte: inicio } });

  /* ---------- 4. comparticiones (≥ 20) ---------- */
  const esDePapeleraDemo = (a: ArchivoSeed) => !!a.ruta && CARPETAS_PARA_PAPELERA.some((c) => a.ruta === c);
  // archivos que se enviarán uno a uno a la papelera: no se comparten
  const archivosParaPapelera = archivos.filter((a, i) => i % 6 === 5 && !esDePapeleraDemo(a)).slice(0, 8);
  const idsPapelera = new Set(archivosParaPapelera.map((a) => a.id));
  const compartibles = archivos.filter((a) => !esDePapeleraDemo(a) && !idsPapelera.has(a.id));

  const permisos = [Permission.READ, Permission.COMMENT, Permission.EDIT];
  const compartidosFile = new Map<string, Dueno>(); // archivo -> primera persona con quien se compartió
  const reales: ShareSeed[] = [];

  let consecutivo = 0;
  for (const d of participantes) {
    const destinatarios = todosLosUsuarios.filter((u) => u.id !== d.id);
    const propios = compartibles.filter((a) => a.dueno.id === d.id);

    for (const [k, archivo] of propios.entries()) {
      if (k % 2 !== 0) continue; // se comparte aproximadamente la mitad de los archivos
      const receptores = [destinatarios[k % destinatarios.length]];
      if (k % 4 === 0) receptores.push(destinatarios[(k + 1) % destinatarios.length]); // algunos con dos personas

      for (const para of receptores) {
        const permiso = permisos[consecutivo++ % permisos.length];
        const s = await compartir.share(d.id, { resourceType: ResourceType.FILE, resourceId: archivo.id, userId: para.id, permission: permiso });
        reales.push({ id: s.id, dueno: d, permiso, tipo: ResourceType.FILE });
        if (!compartidosFile.has(archivo.id)) compartidosFile.set(archivo.id, para);
      }
    }
  }

  // 2 carpetas por usuario, compartidas con los otros
  for (const d of participantes) {
    const destinatarios = todosLosUsuarios.filter((u) => u.id !== d.id);
    const candidatas = carpetas.filter((c) => c.dueno.id === d.id && !c.ruta.includes('/') && !CARPETAS_PARA_PAPELERA.includes(c.ruta)).slice(0, 2);
    for (const [i, c] of candidatas.entries()) {
      const para = destinatarios[i % destinatarios.length];
      const permiso = permisos[i % permisos.length];
      const s = await compartir.share(d.id, { resourceType: ResourceType.FOLDER, resourceId: c.id, userId: para.id, permission: permiso });
      reales.push({ id: s.id, dueno: d, permiso, tipo: ResourceType.FOLDER });
    }
  }
  for (const u of todosLosUsuarios) await actividad.register(u.id, ActionActivity.LOGIN, 'USER', u.id);

  // algunos cambios de permiso y revocaciones
  const aEditor = reales.filter((s) => s.permiso === Permission.READ).slice(0, 4);
  for (const s of aEditor) {
    await compartir.changePermission(s.dueno.id, s.id, { permission: Permission.EDIT });
    s.permiso = Permission.EDIT;
  }
  const revocadas = reales.splice(5, 3);
  for (const s of revocadas) await compartir.revoke(s.dueno.id, s.id);

  /* ---------- 5. operaciones variadas (descargas, ediciones, renombres, movimientos) ---------- */
  for (let i = 0; i < 30; i++) {
    const a = archivos[(i * 7) % archivos.length];
    await actividad.register(a.dueno.id, ActionActivity.DOWNLOAD_FILE, 'FILE', a.id, a.nombre);
  }
  // descargas hechas por quienes recibieron archivos
  for (const [archivoId, para] of [...compartidosFile.entries()].slice(0, 8)) {
    const a = archivos.find((x) => x.id === archivoId)!;
    await actividad.register(para.id, ActionActivity.DOWNLOAD_FILE, 'FILE', a.id, a.nombre);
  }

  // ediciones reales del contenido
  for (let i = 0; i < 8; i++) {
    const a = archivos[(i * 6 + 1) % archivos.length];
    const doc = await modeloArchivos.findById(a.id);
    if (!doc) continue;
    const nuevo = Buffer.from(contenido(a.nombre, a.indice) + '\nSección agregada durante la edición.\n', 'utf8');
    const nuevoId = await gridFs.upload(nuevo, doc.name, doc.mimeType);
    const viejoId = doc.gridFsId;
    doc.gridFsId = nuevoId;
    doc.size = nuevo.length;
    await doc.save();
    await gridFs.remove(viejoId);
    await actividad.register(a.dueno.id, ActionActivity.EDIT_FILE, 'FILE', a.id, doc.name);
  }

  // renombres de archivos (conservan la extensión)
  for (const a of archivos.filter((x) => x.indice % 11 === 3).slice(0, 4)) {
    const nuevoNombre = a.nombre.replace(/(\.[^.]+)$/, '-v2$1');
    const r = await archivosSrv.rename(a.dueno.id, a.id, nuevoNombre);
    a.nombre = r.name;
    await actividad.register(a.dueno.id, ActionActivity.RENAME_FILE, 'FILE', a.id, r.name);
  }

  // archivos movidos a otra carpeta del mismo dueño
  for (const d of participantes) {
    const destino = carpetas.find((c) => c.dueno.id === d.id && !c.ruta.includes('/') && !CARPETAS_PARA_PAPELERA.includes(c.ruta));
    const origen = archivos.find((a) => a.dueno.id === d.id && a.ruta === null && !idsPapelera.has(a.id));
    if (!destino || !origen) continue;
    const m = await archivosSrv.move(d.id, origen.id, destino.id);
    await actividad.register(d.id, ActionActivity.MOVE_FILE, 'FILE', origen.id, m.name);
  }

  // carpetas: un renombre y un movimiento
  const aRenombrar = carpetaPorRuta.get('luis|Notas');
  if (aRenombrar) {
    const r = await carpetasSrv.rename(aRenombrar.dueno.id, aRenombrar.id, 'Apuntes');
    await actividad.register(aRenombrar.dueno.id, ActionActivity.RENAME_FOLDER, 'FOLDER', aRenombrar.id, r.name);
  }
  const aMover = carpetaPorRuta.get('ana|Documentos/Trabajo');
  const nuevoPadre = carpetaPorRuta.get('ana|Proyectos');
  if (aMover && nuevoPadre) {
    const m = await carpetasSrv.move(aMover.dueno.id, aMover.id, nuevoPadre.id);
    await actividad.register(aMover.dueno.id, ActionActivity.MOVE_FOLDER, 'FOLDER', aMover.id, m.name);
  }
  for (const u of todosLosUsuarios) await actividad.register(u.id, ActionActivity.LOGIN, 'USER', u.id);

  /* ---------- 6. papelera ---------- */
  for (const a of archivosParaPapelera) await papelera.sendFile(a.dueno.id, a.id);
  for (const ruta of ['ana|Universidad', 'maria|Recetas']) {
    const c = carpetaPorRuta.get(ruta)!;
    await papelera.sendFolder(c.dueno.id, c.id);
  }
  // restaurar una carpeta y un archivo
  await papelera.restoredFolder(carpetaPorRuta.get('maria|Recetas')!.dueno.id, carpetaPorRuta.get('maria|Recetas')!.id);
  const [aRestaurar] = archivosParaPapelera;
  await papelera.restoredFile(aRestaurar.dueno.id, aRestaurar.id);

  // eliminación definitiva: se usa un archivo temporal para que los 50 archivos de arriba queden intactos
  const temporal = await archivosSrv.upload(duenos[0].id, undefined, comoMulter('borrador-temporal.txt', 'Archivo creado solo para demostrar la eliminación definitiva.\n'));
  await actividad.register(duenos[0].id, ActionActivity.UPLOAD_FILE, 'FILE', temporal.id, temporal.name);
  await papelera.sendFile(duenos[0].id, temporal.id);
  await papelera.deleteFile(duenos[0].id, temporal.id);

  /* ---------- 7. fechas repartidas en los últimos 40 días ---------- */
  const DIA = 86_400_000;
  const ahora = Date.now();
  const actividades = await modeloActividad.find({ createdAt: { $gte: inicio } }).sort({ _id: 1 }).select('_id actionActivity resourceId');
  const fechaDeRecurso = new Map<string, Date>();

  const operaciones = actividades.map((a, i) => {
    // creación (usuarios, carpetas, archivos) entre hace 40 y 20 días; el resto, entre hace 20 días y hoy
    const enCreacion = i < actividadesDeCreacion;
    const desde = enCreacion ? ahora - 40 * DIA : ahora - 20 * DIA;
    const hasta = enCreacion ? ahora - 20 * DIA : ahora - 3_600_000;
    const total = enCreacion ? actividadesDeCreacion : actividades.length - actividadesDeCreacion;
    const posicion = enCreacion ? i : i - actividadesDeCreacion;
    const fecha = new Date(desde + (posicion / Math.max(total, 1)) * (hasta - desde));

    if ((a.actionActivity === ActionActivity.UPLOAD_FILE || a.actionActivity === ActionActivity.CREATE_FOLDER) && a.resourceId) {
      fechaDeRecurso.set(String(a.resourceId), fecha);
    }
    return { updateOne: { filter: { _id: a._id }, update: { $set: { createdAt: fecha, updatedAt: fecha } } } };
  });
  if (operaciones.length) await modeloActividad.collection.bulkWrite(operaciones);

  const idsConFecha = (ids: string[]) => ids.filter((id) => fechaDeRecurso.has(id));
  const fechasArchivos = idsConFecha(archivos.map((a) => a.id)).map((id) => ({
    updateOne: { filter: { _id: new Types.ObjectId(id) }, update: { $set: { createdAt: fechaDeRecurso.get(id), updatedAt: fechaDeRecurso.get(id) } } },
  }));
  if (fechasArchivos.length) await modeloArchivos.collection.bulkWrite(fechasArchivos);

  const fechasCarpetas = idsConFecha(carpetas.map((c) => c.id)).map((id) => ({
    updateOne: { filter: { _id: new Types.ObjectId(id) }, update: { $set: { createdAt: fechaDeRecurso.get(id), updatedAt: fechaDeRecurso.get(id) } } },
  }));
  if (fechasCarpetas.length) await db.collection('folders').bulkWrite(fechasCarpetas);

  await db.collection('users').updateMany(
    { email: { $in: USUARIOS_DEMO.map((u) => u.email) } },
    { $set: { createdAt: new Date(ahora - 41 * DIA), updatedAt: new Date(ahora - 41 * DIA) } },
  );

  /* ---------- resumen ---------- */
  const [nUsuarios, nCarpetas, nArchivos, nShares, nPapeleraA, nPapeleraC, nActividad] = await Promise.all([
    db.collection('users').countDocuments(),
    db.collection('folders').countDocuments({ deletedAt: null }),
    db.collection('files').countDocuments({ deletedAt: null }),
    db.collection('shares').countDocuments(),
    db.collection('files').countDocuments({ deletedAt: { $ne: null } }),
    db.collection('folders').countDocuments({ deletedAt: { $ne: null } }),
    db.collection('activities').countDocuments(),
  ]);

  console.log('\n✅ Datos de demostración cargados');
  console.log(`   Usuarios:               ${nUsuarios} (administrador + ${duenos.length} de demostración)`);
  console.log(`   Carpetas activas:       ${nCarpetas}`);
  console.log(`   Archivos activos:       ${nArchivos}  (+ ${nPapeleraA} archivos y ${nPapeleraC} carpetas en la papelera)`);
  console.log(`   Comparticiones:         ${nShares}`);
  console.log(`   Registros de actividad: ${nActividad}`);
  console.log(`\n   Cuentas de prueba (contraseña ${CLAVE_DEMO}):`);
  for (const u of USUARIOS_DEMO) console.log(`     - ${u.email}`);
  console.log(`     - ${correoAdmin} (administrador, con la contraseña de tu .env)\n`);

  await app.close();
}

sembrar().catch((e) => {
  console.error('❌ Error al cargar los datos de demostración:', e);
  process.exit(1);
});