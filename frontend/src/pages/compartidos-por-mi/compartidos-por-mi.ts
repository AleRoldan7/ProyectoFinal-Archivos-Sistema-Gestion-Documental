import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShareService } from '../../service/share-service/share.service';
import { Permission, Share } from '../../models/sharing/share';
import { ETIQUETA_PERMISO, ETIQUETA_RECURSO, PERMISOS, correoDe, nombreDe } from '../../utils/etiquetas';
import { formatDate } from '../../utils/format';
import { confirmar, exito, fallo } from '../../utils/dialogos';

@Component({
  selector: 'app-compartidos-por-mi',
  imports: [FormsModule],
  templateUrl: './compartidos-por-mi.html',
})
export class CompartidosPorMi implements OnInit {
  private readonly comparticiones = inject(ShareService);

  readonly nombreDe = nombreDe;
  readonly correoDe = correoDe;
  readonly formatDate = formatDate;
  readonly permisos = PERMISOS;
  readonly etiquetaPermiso = ETIQUETA_PERMISO;
  readonly etiquetaRecurso = ETIQUETA_RECURSO;

  items = signal<Share[]>([]);
  cargando = signal(true);
  busqueda = signal('');

  readonly visibles = computed(() => {
    const t = this.busqueda().trim().toLowerCase();
    if (!t) return this.items();
    return this.items().filter((s) => (s.resourceName ?? '').toLowerCase().includes(t) || nombreDe(s.sharedWithId).toLowerCase().includes(t));
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.comparticiones.byMe().subscribe({
      next: (r) => {
        this.items.set(r);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        fallo(e);
      },
    });
  }

  cambiarPermiso(s: Share, permiso: Permission): void {
    this.comparticiones.changePermission(s._id, permiso).subscribe({
      next: () => {
        exito('Permiso actualizado');
        this.cargar();
      },
      error: (e) => {
        fallo(e);
        this.cargar();
      },
    });
  }

  async revocar(s: Share): Promise<void> {
    const ok = await confirmar('Quitar acceso', `${nombreDe(s.sharedWithId)} dejará de acceder a "${s.resourceName ?? 'este recurso'}".`, 'Quitar acceso', true);
    if (!ok) return;
    this.comparticiones.revoke(s._id).subscribe({
      next: () => {
        exito('Acceso revocado');
        this.cargar();
      },
      error: fallo,
    });
  }
}
