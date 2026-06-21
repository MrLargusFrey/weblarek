import { Component } from './base/Component';
import { EventEmitter } from './base/Events';

export class Modal extends Component<HTMLElement> {
  private modal: HTMLElement;
  private closeButton: HTMLElement;
  private content: HTMLElement;
  private events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.modal = container;
    this.closeButton = container.querySelector('.modal__close') as HTMLElement;
    this.content = container.querySelector('.modal__content') as HTMLElement;

    // Все обработчики — стрелочные функции
    this.closeButton.addEventListener('click', (): void => {
      this.close();
    });

    this.modal.addEventListener('click', (e: MouseEvent): void => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  get isOpen(): boolean {
    return this.modal.classList.contains('modal_active');
  }

  open(content: HTMLElement): void {
    this.content.innerHTML = '';
    this.content.appendChild(content);
    this.modal.classList.add('modal_active');
    document.body.classList.add('locked');
    this.events.emit('modal:open');
  }

  close(): void {
    this.modal.classList.remove('modal_active');
    document.body.classList.remove('locked');
    this.content.innerHTML = '';
    this.events.emit('modal:close');
  }

  render(): HTMLElement {
    return this.modal;
  }
}