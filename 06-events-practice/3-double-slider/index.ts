import {createElement} from "../../shared/utils/create-element";

type DoubleSliderSelected = {
  from: number;
  to: number;
};

type FormatValue = (value: number) => string;

interface Options {
  min?: number;
  max?: number;
  formatValue?: FormatValue;
  selected?: DoubleSliderSelected;
}

export default class DoubleSlider {
  public min: number;
  public max: number;
  public element: HTMLElement;

  private readonly formatValue: FormatValue;
  private selected: DoubleSliderSelected;
  private pointermoveEvent: ((event: PointerEvent) => void) | null = null;
  private pointerdownEvent: ((event: PointerEvent) => void) | null = null;
  private pointerupEvent: (() => void) | null = null;
  private readonly leftThumb: HTMLSpanElement;
  private readonly rightThumb: HTMLSpanElement;
  private readonly innerSlider: HTMLDivElement;
  private readonly sliderBar: HTMLSpanElement;
  private readonly valueMax: HTMLSpanElement;
  private readonly valueMin: HTMLSpanElement;
  private diff: number;

  constructor(sliderConf: Options = {}) {
    this.min = sliderConf?.min || 100;
    this.max = sliderConf?.max || this.min + 100;
    this.diff = this.max - this.min;
    this.formatValue = sliderConf?.formatValue ?? function(value: number) { return Math.round(value).toString() };
    this.selected = sliderConf?.selected ?? { from: this.min, to: this.max};

    this.element = this.makeSliderTemplate();
    this.sliderBar = <HTMLSpanElement>this.element.querySelector('.range-slider__progress');
    this.leftThumb = <HTMLSpanElement>this.element.querySelector('.range-slider__thumb-left');
    this.rightThumb = <HTMLSpanElement>this.element.querySelector('.range-slider__thumb-right');
    this.innerSlider = <HTMLDivElement>this.element.querySelector('.range-slider__inner');
    this.valueMax = <HTMLSpanElement>this.element.querySelector('span[data-element="to"]');
    this.valueMin = <HTMLSpanElement>this.element.querySelector('span[data-element="from"]');

    this.addThumbEvents();
  }

  public destroy() {
    this.removeListeners();
    if (this.pointerdownEvent) {
      this.element.removeEventListener('pointerdown', this.pointerdownEvent);
    }
    this.element.remove();
  }

  private makeSliderTemplate() {
    const left = (this.selected.from - this.min) / this.diff * 100;
    const right = 100 - (this.selected.to - this.min) / this.diff * 100;

    return createElement(`
        <div class="range-slider">
          <span data-element="from">${this.formatValue(this.selected.from)}</span>
          <div class="range-slider__inner">
            <span class="range-slider__progress" style="left: ${left}%; right: ${right}%"></span>
            <span class="range-slider__thumb-left" style="left: ${left}%"></span>
            <span class="range-slider__thumb-right" style="right: ${right}%"></span>
          </div>
          <span data-element="to">${this.formatValue(this.selected.to)}</span>
        </div>
    `);
  }

  private addThumbEvents() {
    this.pointerdownEvent = (event: PointerEvent) => {
      const thumb = event.target as HTMLElement;

      if (thumb.classList.contains('range-slider__thumb-left') ||
          thumb.classList.contains('range-slider__thumb-right')) {
        this.removeListeners();
        if (thumb.classList.contains('range-slider__thumb-left')) {
          this.addLeftThumbEvents();
        } else {
          this.addRightThumbEvents();
        }
      }
    }

    this.element.addEventListener('pointerdown', this.pointerdownEvent);
  }

  private addRightThumbEvents() {
    const { left: sliderLeft, width: sliderWidth } = this.innerSlider.getBoundingClientRect();

    this.pointermoveEvent = (event: PointerEvent) => {
      const inSliderCord = event.clientX - sliderLeft;
      let positionPercent = 100 * inSliderCord / sliderWidth;

      const leftPercent = 100 * (this.selected.from - this.min) / this.diff;
      if (positionPercent < leftPercent) {
        positionPercent = leftPercent;
      } else if (positionPercent > 100) {
        positionPercent = 100;
      }

      const rightPercent = 100 - positionPercent;
      this.rightThumb.style.right = rightPercent + '%';
      this.sliderBar.style.right = rightPercent + '%';
      this.selected.to = Math.round(this.min + (positionPercent / 100 * this.diff));
      this.valueMax.textContent = this.formatValue(this.selected.to);
    };

    document.addEventListener('pointermove', this.pointermoveEvent);
    this.addThumbsPointerListeners();
  }

  private addLeftThumbEvents() {
    const { left: sliderLeft, width: sliderWidth } = this.innerSlider.getBoundingClientRect();

    this.pointermoveEvent = (event: PointerEvent) => {
      const inSliderCord = event.clientX - sliderLeft;
      let positionPercent = 100 * inSliderCord / sliderWidth;

      const rightPercent = 100 * (this.selected.to - this.min) / this.diff;
      if (positionPercent < 0) {
        positionPercent = 0;
      } else if (positionPercent > rightPercent) {
        positionPercent = rightPercent;
      }

      this.leftThumb.style.left = positionPercent + '%';
      this.sliderBar.style.left = positionPercent + '%';
      this.selected.from = Math.round(this.min + (positionPercent / 100 * this.diff));
      this.valueMin.textContent = this.formatValue(this.selected.from);
    };

    document.addEventListener('pointermove', this.pointermoveEvent);
    this.addThumbsPointerListeners();
  }

  private addThumbsPointerListeners() {
    this.pointerupEvent = () => {
      this.removeListeners();
      this.element.dispatchEvent(new CustomEvent('range-select', {
        bubbles: true,
        detail: {
          from: this.selected.from,
          to: this.selected.to,
        }
      }));
    };

    document.addEventListener('pointerup', this.pointerupEvent);
  }

  private removeListeners() {
    if (this.pointermoveEvent) {
      document.removeEventListener('pointermove', this.pointermoveEvent);
      this.pointermoveEvent = null;
    }
    if (this.pointerupEvent) {
      document.removeEventListener('pointerup', this.pointerupEvent);
      this.pointerupEvent = null;
    }
  }
}
