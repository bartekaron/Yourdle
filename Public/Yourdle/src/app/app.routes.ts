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
import { ClassicGameComponent } from './components/classic-game/classic-game.component';
import { QuoteGameComponent } from './components/quote-game/quote-game.component';
import { EmojiGameComponent } from './components/emoji-game/emoji-game.component';
import { PictureGameComponent } from './components/picture-game/picture-game.component';
import { DescriptionGameComponent } from './components/description-game/description-game.component';
import { AdminCategoriesComponent } from './components/admin-categories/admin-categories.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { DescriptionDuelComponent } from './components/description-duel/description-duel.component';
import { PictureDuelComponent } from './components/picture-duel/picture-duel.component';
import { SummaryDuelComponent } from './components/summary-duel/summary-duel.component';
import { QuoteDuelComponent } from './components/quote-duel/quote-duel.component';
import { ClassicDuelComponent } from './components/classic-duel/classic-duel.component';
import { EmojiDuelComponent } from './components/emoji-duel/emoji-duel.component';
// Import any other needed duel components (if they exist)

export const routes: Routes = [
    {
        path: 'admin-felhasznalok', 
        component: AdminUsersComponent, 
        canActivate: [AdminAuthGuard]
    },
    {
        path: 'admin-kategoriak', 
        component: AdminCategoriesComponent, 
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
        path:"restorepass/:userId/:token", component: RestorepassComponent
    },
    {
        path:"kategoria-keszito", component: CategoryCreatorComponent, canActivate:[UserAuthGuard]
    },
    {
        path:"lobby/:roomName", component:LobbyComponent, canActivate:[UserAuthGuard]
    },
    {
        path: 'toplista', 
        component: LeaderboardComponent
    },
    //Játékmódok:
    { path: 'classic-game/:id/:modeIndex', component: ClassicGameComponent },
    { path: 'quote-game/:id/:modeIndex', component: QuoteGameComponent },
    { path: 'emoji-game/:id/:modeIndex', component: EmojiGameComponent },
    { path: 'picture-game/:id/:modeIndex', component: PictureGameComponent },
    { path: 'description-game/:id/:modeIndex', component: DescriptionGameComponent },
    
    // Add dedicated routes for all duel types
    { path: 'description-duel/:roomName', component: DescriptionDuelComponent, canActivate: [UserAuthGuard] },
    { path: 'picture-duel/:roomName', component: PictureDuelComponent, canActivate: [UserAuthGuard] },
    { path: 'summary-duel/:roomName', component: SummaryDuelComponent, canActivate: [UserAuthGuard] },
    { path: 'quote-duel/:roomName', component: QuoteDuelComponent, canActivate: [UserAuthGuard] },
    { path: 'classic-duel/:roomName', component: ClassicDuelComponent, canActivate: [UserAuthGuard] },
    { path: 'emoji-duel/:roomName', component: EmojiDuelComponent, canActivate: [UserAuthGuard] },
];