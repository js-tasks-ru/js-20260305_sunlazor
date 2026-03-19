import {createElement} from "../../shared/utils/create-element";

interface Options {
  // массив чисел (данные графика)
  data: number[] | undefined;
  // заголовок (например, "orders")
  label: string | undefined;
  // основное числовое значение (например, "344")
  value: number | undefined;
  // ссылка "View all" (если передана)
  link: string | undefined;
  // функция для форматирования значения value (например, добавление знака валюты $)
  formatHeading: Function | undefined;
}

export default class ColumnChart {
  // Ссылка на корневой DOM-элемент компонента (HTMLElement).
  element;
  // Фиксированная высота графика (должна быть равна 50).
  private chartHeight = 50;

  constructor(private columnChart: Options | undefined) {
    this.element = this.makeChartTemplate();
  }

  // Принимает новый массив данных и обновляет только тело графика (столбцы), не перерисовывая весь компонент целиком.
  update(data) {
  }

  // Удаляет элемент компонента из DOM.
  remove() {
  }

  // Полностью удаляет компонент, очищает обработчики событий и ссылки на DOM-элементы (для предотвращения утечек памяти).
  destroy() {

  }

  private makeChartTemplate() {
    const chartLinkHtml = this.columnChart?.link
      ? `<a href="${this.columnChart?.link}" class="column-chart__link">View all</a>`
      : '';
    const chartTemplate = createElement(`
    <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
<!--        Total orders-->
        ${this.columnChart?.label}
        ${chartLinkHtml}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.columnChart?.value}</div>
        <div data-element="body" class="column-chart__chart">
<!--          <div style="&#45;&#45;value: 2" data-tooltip="6%"></div>-->
<!--          <div style="&#45;&#45;value: 22" data-tooltip="44%"></div>-->
<!--          <div style="&#45;&#45;value: 5" data-tooltip="11%"></div>-->
        </div>
      </div>
    </div>
    `);

    if (this.columnChart?.data?.length === 0) {
      chartTemplate.classList.add('column-chart_loading');
    } else {
      const dataHtml = this.columnChart?.data?.map(
        (dataValue) => `<div style="&#45;&#45;value: ${dataValue}" data-tooltip="${dataValue * 100 / 50}%"></div>`
      ).join('');
      console.log(dataHtml);
      if (dataHtml) {
        const chartDiv = chartTemplate.querySelector('.column-chart__chart');
        if (chartDiv) {
          chartDiv.innerHTML = dataHtml;
        }
      }
    }

    return chartTemplate;
  }
}
