import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../interfaces/todo';

@Pipe({
  name: 'sortBy',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(value: Todo[], field: keyof Todo): Todo[] {

    if (!value || !field || field == null) return value;

    return [...value].sort((a,b) => {

      const aValue = a[field];
      const bValue = b[field];

      // Handle null or undefined values and ensure numbers
      if (
        aValue == null ||
        bValue == null ||
        typeof aValue !== 'number' ||
        typeof bValue !== 'number') return 0;

      return aValue - bValue; // Numeric comparison

    });
  }

}
