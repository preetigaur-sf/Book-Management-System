import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { Dashboard } from './features/dashboard/dashboard/dashboard';

import { ProductList } from './features/products/product-list/product-list';
import { ProductDetail } from './features/products/product-detail/product-detail';

import { Wishlist } from './features/wishlist/wishlist/wishlist';
import { Cart } from './features/cart/cart/cart';

import { authGuard } from './core/guards/auth-guard';

import { AdminLayout } from './features/admin/admin-layout/admin-layout';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { AdminProducts } from './features/admin/admin-products/admin-products';
import { AddProduct } from './features/admin/add-product/add-product';
import { EditProduct } from './features/admin/edit-product/edit-product';

import { AdminCategories } from './features/admin/admin-categories/admin-categories';
import { AddCategory } from './features/admin/add-category/add-category';
import { EditCategory } from './features/admin/edit-category/edit-category';

import { AdminBrands } from './features/admin/admin-brands/admin-brands';
import { AddBrand } from './features/admin/add-brand/add-brand';
import { EditBrand } from './features/admin/edit-brand/edit-brand';

import { AdminOrders } from './features/admin/admin-orders/admin-orders';
import { EditOrder } from './features/admin/edit-order/edit-order';

import { AdminUsers } from './features/admin/admin-users/admin-users';
import { EditUser } from './features/admin/edit-user/edit-user';

import { AdminReviews } from './features/admin/admin-review/admin-review';
import { EditReview } from './features/admin/edit-review/edit-review';
import { MyOrder } from './features/my-orders/my-order';
import { Chat } from './features/chat/chat/chat';
import { Notifications } from './features/notifications/notifications/notifications';
import { AdminChat } from './features/admin/admin-chat/admin-chat';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'register',
    component: Register,
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'products',
        component: ProductList,
      },
      {
        path: 'products/:id',
        component: ProductDetail,
      },
      {
        path: 'wishlist',
        component: Wishlist,
      },
      {
        path: 'cart',
        component: Cart,
      },
      {
        path: 'my-orders',
        component: MyOrder,
      },
      {
        path: 'chat',
        component: Chat,
      },
      {
        path: 'notifications',
        component: Notifications,
      },
    ],
  },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: AdminDashboard,
      },
      {
        path: 'products',
        component: AdminProducts,
      },
      {
        path: 'products/add',
        component: AddProduct,
      },
      {
        path: 'products/edit/:id',
        component: EditProduct,
      },
      {
        path: 'categories',
        component: AdminCategories,
      },
      {
        path: 'categories/add',
        component: AddCategory,
      },
      {
        path: 'categories/edit/:id',
        component: EditCategory,
      },
      {
        path: 'brands',
        component: AdminBrands,
      },
      {
        path: 'brands/add',
        component: AddBrand,
      },
      {
        path: 'brands/edit/:id',
        component: EditBrand,
      },
      {
        path: 'orders',
        component: AdminOrders,
      },
      {
        path: 'orders/edit/:id',
        component: EditOrder,
      },
      {
        path: 'users',
        component: AdminUsers,
      },
      {
        path: 'users/edit/:id',
        component: EditUser,
      },
      {
        path: 'chat',
        component: AdminChat,
      },
      {
        path: 'reviews',
        component: AdminReviews,
      },
      {
        path: 'reviews/edit/:id',
        component: EditReview,
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
