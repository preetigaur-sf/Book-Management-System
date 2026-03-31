import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'booklist',
    pathMatch: 'full',
  },

  {
    path: 'booklist',
    loadComponent: () => import('./booklist/booklist').then((m) => m.Booklist),
  },

  {
    path: 'addbook',
    loadComponent: () => import('./addbook/addbook').then((m) => m.AddBook),
  },

  {
    path: 'editbook/:id',
    loadComponent: () => import('./editbook/editbook').then((m) => m.Editbook),
  },
];
