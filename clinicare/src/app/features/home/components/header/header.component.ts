import { Component, HostListener, signal } from '@angular/core';
import { NavigationIndexComponent } from '../navigation-index/navigation-index.component';

@Component({
  selector: 'index-header',
  imports: [NavigationIndexComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public isScrolled = signal(false);
  public mobileMenuOpen = false;

  public isHomePage = signal(window.location.pathname === '/');

  // Escucha el evento del scroll
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 200);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    console.log('Mobile menu is now', this.mobileMenuOpen ? 'open' : 'closed');
  }
}
