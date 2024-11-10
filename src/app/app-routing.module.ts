import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimeListComponent } from './components/anime-list/anime-list.component';
import { AnimeDetailComponent } from './components/anime-detail/anime-detail.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';

const routes: Routes = [
    { path: '', component: AnimeListComponent },
    { path: 'anime/:id', component: AnimeDetailComponent },
    { path: 'test', component: VideoPlayerComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
