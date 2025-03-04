import { Routes } from '@angular/router';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { LandingComponent } from './components/landing/landing.component';
import { SingleplayerComponent } from './components/singleplayer/singleplayer.component';
import { DuelComponent } from './components/duel/duel.component';
import { UserAuthGuard } from './guards/user-auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';

export const routes: Routes = [
    {
        path: 'admin-felhasznalok', 
        component: AdminUsersComponent, 
        canActivate: [AdminAuthGuard]
    },
    {
        path: '', 
        component: LandingComponent
    },
    {
        path: 'egyjatekos', 
        component: SingleplayerComponent
    },
    {
        path: 'parbaj', 
        component: DuelComponent, 
        canActivate: [UserAuthGuard]
    }
];