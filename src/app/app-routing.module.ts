import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login', // Page de connexion
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home', // Page d'accueil
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'sign-in', // Page d'inscription
    loadChildren: () =>
      import('./sign-in/sign-in.module').then((m) => m.SignInPageModule),
  },
  {
    path: 'maps',
    loadChildren: () =>
      import('./maps/maps.module').then((m) => m.MapsPageModule),
  },
  {
    path: 'forum',
    loadChildren: () =>
      import('./forum/forum.module').then((m) => m.ForumPageModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./about/about.module').then((m) => m.AboutPageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'checklist',
    loadChildren: () =>
      import('./checklist/checklist.module').then((m) => m.ChecklistPageModule),
  },
  {
    path: 'helppage',
    loadChildren: () =>
      import('./helppage/helppage.module').then((m) => m.HelppagePageModule),
  },


  /*{*/
    /*path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },*/
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: 'leaderboard',
    loadChildren: () =>
      import('./leaderboard/leaderboard.module').then(
        (m) => m.LeaderboardPageModule
      ),
  },
  /*{
    path: 'verify-email',
    loadChildren: () =>
      import('./verify-email/verify-email.module').then(
        (m) => m.VerifyEmailPageModule
      ),
  },*/
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module').then( m => m.AdminDashboardPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'task-create',
    loadChildren: () => import('./task-create/task-create.module').then( m => m.TaskCreatePageModule)
  },
  /*{
    path: 'forum-feed-detail',
    loadChildren: () => import('./forum-feed-detail/forum-feed-detail.module').then( m => m.ForumFeedDetailPageModule)
  },*/
  {
    path: 'forum-feed-detail/:id',
    loadChildren: () => import('./forum-feed-detail/forum-feed-detail.module').then(m => m.ForumFeedDetailPageModule)
  },
  {
    path: 'missions',
    loadChildren: () => import('./missions/missions.module').then( m => m.MissionsPageModule)
  },
  {
    path: 'validate-missions',
    loadChildren: () => import('./validate-missions/validate-missions.module').then( m => m.ValidateMissionsPageModule)
  },
  {
    path: 'my-submissions',
    loadChildren: () => import('./my-submissions/my-submissions.module').then( m => m.MySubmissionsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
