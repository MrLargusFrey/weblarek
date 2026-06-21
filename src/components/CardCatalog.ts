import { Card } from './Card';

export class CardCatalog extends Card {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;

    container.addEventListener('click', onClick);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    const categoryMap: Record<string, string> = {
      'софт-скил': 'card__category_soft',
      'хард-скил': 'card__category_hard',
      'другое': 'card__category_other',
    };
    const className = categoryMap[value] || 'card__category_other';
    this.categoryElement.className = `card__category ${className}`;
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }
}