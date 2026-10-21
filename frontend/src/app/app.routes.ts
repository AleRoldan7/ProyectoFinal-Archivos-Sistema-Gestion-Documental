import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component/login.component';
import { LayoutComponent } from '../components/layout/layout';
import { authGuard } from '../guard/auth.guard';
import { roleGuard } from '../guard/role.guard';

export const routes: Routes = [

    { path: '', redirectTo: 'drive', pathMatch: 'full' },

    { path: 'login', component: LoginComponent },

    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'drive', loadComponent: () => import('../pages/mi-unidad/mi-unidad').then((m) => m.MiUnidad) },
            { path: 'drive/:folderId', loadComponent: () => import('../pages/mi-unidad/mi-unidad').then((m) => m.MiUnidad) },
            { path: 'compartidos-conmigo', loadComponent: () => import('../pages/compartidos-conmigo/compartidos-conmigo').then((m) => m.CompartidosConmigo) },
            { path: 'compartidos-por-mi', loadComponent: () => import('../pages/compartidos-por-mi/compartidos-por-mi').then((m) => m.CompartidosPorMi) },
            { path: 'papelera', loadComponent: () => import('../pages/papelera/papelera').then((m) => m.Papelera) },
            { path: 'actividad', loadComponent: () => import('../pages/actividad/actividad').then((m) => m.Actividad) },
            { path: 'reportes', loadComponent: () => import('../pages/reportes/reportes').then((m) => m.Reportes) },
            {
                path: 'usuarios',
                canActivate: [roleGuard(['ADMIN'])],
                loadComponent: () => import('../pages/usuarios/usuarios').then((m) => m.Usuarios),
            },
        ],
    },

    { path: '**', redirectTo: 'drive' }

];
