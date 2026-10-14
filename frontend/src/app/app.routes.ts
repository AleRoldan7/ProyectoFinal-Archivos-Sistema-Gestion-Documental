import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component/login.component';
import { PagePrincipal } from '../pages/page-principal/page-principal';

export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: LoginComponent },
    { path: 'page-principal', component: PagePrincipal },


    { path: '**', redirectTo: 'login' }

];
