import { Routes } from '@angular/router';
import { AllproductComponent } from './allproduct/allproduct.component';
import { authGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'register', component:RegistrationComponent},
    {path:'',component:HomeComponent, canActivate:[authGuard]},
    {path:'product/:id', component:AllproductComponent,canActivate:[authGuard]},
];
