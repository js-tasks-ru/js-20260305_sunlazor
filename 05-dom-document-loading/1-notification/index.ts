import {createElement} from "../../shared/utils/create-element";

interface Options {
  duration?: number;
  type?: 'success' | 'error';
}

export default class NotificationMessage {
  private static element: HTMLElement;

  constructor(private message: string, private options: Options = {}) {
    if (NotificationMessage.element) {
      this.remove();
    }
    NotificationMessage.element = this.makeNotificationTemplate();
  }

  private static get type() {
    return 'success';
  }

  private static get duration() {
    return 2000;
  }

  public get element() {
    return NotificationMessage.element
  }

  public get type() {
    return this.options?.type ? this.options.type : NotificationMessage.type
  }

  public get duration() {
    return this.options?.duration ? this.options.duration : NotificationMessage.duration;
  }

  public show(target?: HTMLElement) {
    target ? target.append(NotificationMessage.element) : document.body.append(NotificationMessage.element);
    setTimeout(this.remove, this.duration);
  }

  public remove() {
    NotificationMessage.element.remove();
  }

  public destroy() {
    NotificationMessage.element.remove();
  }

  private makeNotificationTemplate() {
    return createElement(`
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `);
  }
}
