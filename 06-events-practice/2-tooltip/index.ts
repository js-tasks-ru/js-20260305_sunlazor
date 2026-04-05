import {createElement} from "../../shared/utils/create-element";

export default class Tooltip {
  public static element: HTMLElement | null = null;

  constructor() {
    if (!Tooltip.element) {
      Tooltip.element = this.makeTooltipTemplate();
    }
  }

  public get element() {
    if (!Tooltip.element) {
      Tooltip.element = this.makeTooltipTemplate();
    }

    return Tooltip.element;
  }

  public render(html: string) {
    this.element.textContent = html;
    document.body.appendChild(this.element);
  }

  public initialize() {
    document.addEventListener('pointerover', (event) => {
      const tooltipTarget = event.target as HTMLElement;
      if (tooltipTarget.dataset.tooltip) {
        this.element.textContent = tooltipTarget.dataset.tooltip;
        tooltipTarget.appendChild(this.element);
      }
    });
    document.addEventListener('pointerout', (event) => {
      this.destroy();
    });
  }

  public destroy() {
    this.element.remove();
  }

  private makeTooltipTemplate() {
    return createElement('<div class="tooltip"></div>');
  }
}
