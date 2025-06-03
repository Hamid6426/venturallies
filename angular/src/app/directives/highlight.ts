import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class Highlight {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onEnter() {
    this.el.nativeElement.style.backgroundColor = '#AAAA00';
  }

  @HostListener('mouseleave') onLeave() {
    this.el.nativeElement.style.backgroundColor = null;
  }
}
