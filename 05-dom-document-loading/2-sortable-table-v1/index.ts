import {createElement} from "../../shared/utils/create-element";

type SortOrder = 'asc' | 'desc';

type SortableTableData = Record<string, string | number>;

interface SortableTableHeader {
  id: string;
  title: string;
  sortable?: boolean;
  sortType?: 'string' | 'number';
  template?: (value: string | number) => string;
}

export default class SortableTable {
  private element: HTMLElement;
  constructor(private headersConfig: SortableTableHeader[] = [], private data: SortableTableData[] = []) {
    this.element = this.makeTableTemplate();
  }

  private makeTableTemplate() {
    let table = createElement('<div class="sortable-table"></div>');
    table.appendChild(this.makeTableHeader());
    table.appendChild(this.makeTableBody());

    return table;
  }

  private makeTableHeader() {
    let tableRow = createElement(`
      <div data-element="header" class="sortable-table__header sortable-table__row">
      </div>
    `);

    this.headersConfig.forEach((column) => {
      let cell = createElement(`
        <div class="sortable-table__cell" data-id="${column.id}" data-sortable="${column?.sortable ? column.sortable : 'false'}" data-order="asc">
          <span>${column.title}</span>
          ${column?.sortable ? '<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>' : ''}
        </div>
      `);

      tableRow.appendChild(cell);
    });

    return tableRow;
  }

  private makeTableBody() {
    let body = createElement(`
      <div data-element="body" class="sortable-table__body"></div>
    `);

    this.data.forEach((row) => {
      let divRow = createElement(`<a class="sortable-table__row"></a>`);
      this.headersConfig.forEach((headerColumn) => {
        if (row[headerColumn.id]) {
          let cell = createElement(`
            <div class="sortable-table__cell">${headerColumn?.template ? headerColumn?.template(row[headerColumn.id]) : row[headerColumn.id]}</div>
          `);

          divRow.appendChild(cell);
        }
      });

      body.appendChild(divRow);
    });

    return body;
  }
}
