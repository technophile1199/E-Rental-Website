import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByLocation'
})
export class FilterByLocationPipe implements PipeTransform {

  transform(items: any, select?: any): any {
    if (select !== "All") {
      return select
        ? items.filter(item => item["location"] === select)
        : items;
    } else {
      return items;
    }
  }
}
