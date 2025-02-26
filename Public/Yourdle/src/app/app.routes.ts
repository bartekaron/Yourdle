import { Routes } from '@angular/router';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { LandingComponent } from './components/landing/landing.component';

export const routes: Routes = [
    {
        path: 'admin-felhasznalok', component: AdminUsersComponent
    },
    {
        path: '', component: LandingComponent
    }

];
