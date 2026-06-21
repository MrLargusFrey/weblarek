import { Component } from './base/Component';
import { EventEmitter } from './base/Events';

export class Modal extends Component<HTMLElement> {
  private modal: HTMLElement;
  private closeButton: HTMLElement;
  private content: HTMLElement;
  private events: EventEmitter;

  private handleEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      this.close();
    }
  };

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.modal = container;
    this.closeButton = container.querySelector('.modal__close') as HTMLElement;
    this.content = container.querySelector('.modal__content') as HTMLElement;

    this.closeButton.addEventListener('click', (): void => {
      this.close();
    });

    this.modal.addEventListener('click', (e: MouseEvent): void => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  open(content: HTMLElement): void {
    this.content.innerHTML = '';
    this.content.appendChild(content);
    this.modal.classList.add('modal_active');
    document.addEventListener('keydown', this.handleEscape);
    this.events.emit('modal:open');
  }

  close(): void {
    this.modal.classList.remove('modal_active');
    this.content.innerHTML = '';
    document.removeEventListener('keydown', this.handleEscape);
    this.events.emit('modal:close');
  }
}