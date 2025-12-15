import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noImage',
  standalone: true,
})
export class NoImagePipe implements PipeTransform {
  transform(
    imageUrl: string | null | undefined,
    fallback: string = '/img/placeholder.webp'
  ): string {
    if (!imageUrl || imageUrl.trim() === '') {
      return fallback;
    }
    return imageUrl;
  }
}
