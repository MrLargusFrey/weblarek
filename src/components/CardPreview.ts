import { Card } from './Card';

export class CardPreview extends Card {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private descriptionElement: HTMLElement;
  private button: HTMLButtonElement;
  private onToggle: () => void;
  private currentContainer: HTMLElement; // ← новое поле

  constructor(container: HTMLElement, onToggle: () => void) {
    super(container);
    this.onToggle = onToggle;
    this.currentContainer = container;
    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
    this.button = container.querySelector('.card__button') as HTMLButtonElement;

    this.button.addEventListener('click', this.onToggle);
  }

  setContainer(container: HTMLElement): void {
    this.currentContainer = container;
    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
    this.button = container.querySelector('.card__button') as HTMLButtonElement;

    this.button.removeEventListener('click', this.onToggle);
    this.button.addEventListener('click', this.onToggle);
  }

  render(): HTMLElement {
    return this.currentContainer;
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.button.disabled = value;
  }
}