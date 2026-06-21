import { Component } from './base/Component';

export class Catalog extends Component<HTMLElement> {
  private gallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.gallery = container;
  }

  set items(cardElements: HTMLElement[]) {
    this.gallery.innerHTML = '';
    cardElements.forEach(el => this.gallery.appendChild(el));
  }
}