import { Card } from './Card';

export class CardBasket extends Card {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);
    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteButton.addEventListener('click', onDelete);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value + 1);
  }
}