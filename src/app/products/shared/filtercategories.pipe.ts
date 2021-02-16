import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtercategories'
})
export class FiltercategoriesPipe implements PipeTransform {

  transform(items: any, select?: any): any {
    if (select !== "All") {
      return select
        ? items.filter(item => item["type"] === select)
        : items;
    } else {
      return items;
    }
}

}
