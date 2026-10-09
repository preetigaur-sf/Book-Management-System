import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home').then(m => m.Home)
  },
  {
    path: 'addbook',
    loadComponent: () =>
      import('./addbook/addbook').then(m => m.Addbook)
  },
  {
    path: 'booklist',
    loadComponent: () =>
      import('./booklist/booklist').then(m => m.Booklist)
  }
];