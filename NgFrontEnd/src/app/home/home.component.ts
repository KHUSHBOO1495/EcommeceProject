import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppDownloadComponent } from '../app-download/app-download.component';
import { BestSellingComponent } from '../best-selling/best-selling.component';
import { CategoryComponent } from '../category/category.component';
import { DiscountCouponsComponent } from '../discount-coupons/discount-coupons.component';
import { DiscountPurchaseComponent } from '../discount-purchase/discount-purchase.component';
import { FeaturedComponent } from '../featured/featured.component';
import { FooterComponent } from '../footer/footer.component';
import { JustArrivedComponent } from '../just-arrived/just-arrived.component';
import { LookingForComponent } from '../looking-for/looking-for.component';
import { MostPopularComponent } from '../most-popular/most-popular.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { PosterComponent } from '../poster/poster.component';
import { ServicesComponent } from '../services/services.component';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, NavbarComponent, PosterComponent, CategoryComponent, BestSellingComponent, DiscountCouponsComponent, FeaturedComponent, DiscountPurchaseComponent, MostPopularComponent, JustArrivedComponent, AppDownloadComponent, LookingForComponent, ServicesComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
