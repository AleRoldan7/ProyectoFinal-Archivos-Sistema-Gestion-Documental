import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" (click)="cerrar.emit()">
      <div class="flex max-h-[90vh] w-full flex-col rounded-xl bg-white shadow-xl" [class]="ancho()" (click)="$event.stopPropagation()">
        <header class="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 class="truncate text-lg font-semibold text-slate-800">{{ titulo() }}</h2>
          <button type="button" class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label="Cerrar" (click)="cerrar.emit()">✕</button>
        </header>
        <div class="overflow-auto p-5">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class ModalComponent {
  titulo = input.required<string>();
  ancho = input('max-w-lg');
  cerrar = output<void>();
}
