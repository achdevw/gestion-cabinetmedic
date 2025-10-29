import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
   
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(private router: Router) {}

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
