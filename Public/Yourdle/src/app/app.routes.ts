import { Routes } from '@angular/router';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { LandingComponent } from './components/landing/landing.component';
import { SingleplayerComponent } from './components/singleplayer/singleplayer.component';
import { DuelComponent } from './components/duel/duel.component';
import { UserAuthGuard } from './guards/user-auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { RestorepassComponent } from './components/restorepass/restorepass.component';
import { CategoryCreatorComponent } from './components/category-creator/category-creator.component';
import { LobbyComponent } from './components/lobby/lobby.component';

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
    },
    {
        path:"restorepass/:userId", component: RestorepassComponent
    },
    {
        path:"kategoria-keszito", component: CategoryCreatorComponent, canActivate:[UserAuthGuard]
    },
    {
        path:"lobby/:roomname", component:LobbyComponent, canActivate:[UserAuthGuard]
    }
];