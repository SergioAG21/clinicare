import { Component, computed, HostListener, signal } from '@angular/core';
import { SwiperComponent } from '@shared/components/swiper/swiper';

@Component({
  selector: 'about-section',
  imports: [SwiperComponent],
  templateUrl: './about-section.component.html',
})
export class AboutComponent {
  public totalImages = 4;
  public imagenes = computed(() => {
    return Array.from(
      { length: this.totalImages },
      (_, i) => `img/about/image${i + 1}.webp`
    );
  });

  indiceSeleccionado = signal<number | null>(null);

  imagenSeleccionada = computed(() =>
    this.indiceSeleccionado() !== null
      ? this.imagenes()[this.indiceSeleccionado()!]
      : null
  );

  abrirModal(imagen: string) {
    const index = this.imagenes().indexOf(imagen);
    this.indiceSeleccionado.set(index);
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.indiceSeleccionado.set(null);
    document.body.style.overflow = '';
  }

  siguiente() {
    if (this.indiceSeleccionado() === null) return;
    const total = this.imagenes().length;
    this.indiceSeleccionado.set((this.indiceSeleccionado()! + 1) % total);
  }

  anterior() {
    if (this.indiceSeleccionado() === null) return;
    const total = this.imagenes().length;
    this.indiceSeleccionado.set(
      (this.indiceSeleccionado()! - 1 + total) % total
    );
  }

  // ✅ Permite usar flechas del teclado
  @HostListener('window:keydown.ArrowRight')
  handleRight() {
    if (this.indiceSeleccionado() !== null) this.siguiente();
  }

  @HostListener('window:keydown.ArrowLeft')
  handleLeft() {
    if (this.indiceSeleccionado() !== null) this.anterior();
  }

  @HostListener('window:keydown.Escape')
  handleEsc() {
    if (this.indiceSeleccionado() !== null) this.cerrarModal();
  }
}
