/* import { Directive, HostListener, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  @HostBinding('style.backgroundColor') backgroundColor: string;
  @Input() set appHighlight(color: string) {
    this.backgroundColor = color;
  }
  
  constructor() {
    this.backgroundColor = 'yellow';
  }
} */
import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  constructor(private el: ElementRef) {   this.backgroundColor = 'yellow'; }
  @HostBinding('style.backgroundColor') backgroundColor: string;
  @Input() defaultColor: string ='black';
  @Input('appHighlight') highlightColor: string ='';
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || this.defaultColor || 'red');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}