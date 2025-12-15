import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styles: `
      @layer utilities {
    @keyframes spin-custom {
      to {
        transform: rotate(360deg);
      }
    }
    .animate-spin-custom {
      animation: spin-custom 1s linear infinite;
    }

    @keyframes fade-text {
      0%, 100% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
    }
    .animate-fade-text {
      animation: fade-text 1.5s ease-in-out infinite;
    }
  }
  `,
})
export class LoadingComponent {}
