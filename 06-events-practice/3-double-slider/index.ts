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

  private formatValue: FormatValue;
  private selected: DoubleSliderSelected;

  constructor(sliderConf: Options = {}) {
    this.min = sliderConf?.min || 0;
    this.max = sliderConf?.max || this.min + 100;
    this.formatValue = sliderConf?.formatValue ?? function(value: number) { return value.toString() };
    this.selected = sliderConf?.selected ?? { from: this.max * 0.25, to: this.max * 0.75};

    this.element = this.makeSliderTemplate();
    this.addThumbEvents();
  }

  public destroy() {

  }

  private makeSliderTemplate() {
    const left = (this.selected.from - this.min) / (this.max - this.min) * 100;
    const right = 100 - (this.selected.to - this.min) / (this.max - this.min) * 100;

    return createElement(`
        <div class="range-slider">
          <span>${this.formatValue(this.min)}</span>
          <div class="range-slider__inner">
            <span class="range-slider__progress" style="left: ${left}%; right: ${right}%"></span>
            <span class="range-slider__thumb-left" style="left: ${left}%"></span>
            <span class="range-slider__thumb-right" style="right: ${right}%"></span>
          </div>
          <span>${this.formatValue(this.max)}</span>
        </div>
    `);
  }

  private addThumbEvents() {
    this.element.addEventListener('pointerdown', (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('range-slider__thumb-left')) {
        const sliderLeft
          = this.element?.querySelector('.range-slider__inner')?.getBoundingClientRect()?.left ?? 0;
        // const sliderWidth
        //   = this.element?.querySelector('.range-slider__inner')?.getBoundingClientRect()?.width ?? 0;
        const rightThumb
          = this.element?.querySelector('.range-slider__thumb-right')?.getBoundingClientRect()?.left ?? 0;
        document.body.addEventListener('pointermove', (event: PointerEvent) => {
          console.log('sliderLeft: ', sliderLeft);
          // el.style.left = event.clientX - parseInt(this.element.style.left) + 'px';
          target.style.left = Math.max(event.clientX - sliderLeft, 0) + 'px';
          // target.style.left = Math.max(event.clientX, sliderLeft) + 'px';
          // target.style.left = event.clientX + 'px';

          if (event.clientX - sliderLeft < 0) {
            target.style.left = '0px';
          } else if (event.clientX > rightThumb) {
            target.style.left = rightThumb - sliderLeft + 'px';
          } else {
            target.style.left = event.clientX - sliderLeft + 'px';
          }
          console.log(event.clientX);
          console.log('thumb: ', target.style.left);
        })
      }
    })
  }
}
