import { Routes } from '@angular/router';
import { AllproductComponent } from './allproduct/allproduct.component';
import { authGuard } from './auth.guard';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RegistrationComponent } from './registration/registration.component';
import { WishlistComponent } from './wishlist/wishlist.component';

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'register', component:RegistrationComponent},
    {path:'',component:HomeComponent, canActivate:[authGuard]},
    {path:'product', component:AllproductComponent,canActivate:[authGuard]},
    {path:'product/:id', component:ProductDetailComponent,canActivate:[authGuard]},
    {path:'category/:id', component:AllproductComponent,canActivate:[authGuard]},
    {path:'cart', component:CartComponent,canActivate:[authGuard]},
    {path:'wishlist', component:WishlistComponent,canActivate:[authGuard]},
    {path:'order-history', component:OrderHistoryComponent, canActivate:[authGuard]},
    {path:'order-detail/:id', component:OrderDetailComponent, canActivate:[authGuard]}
];