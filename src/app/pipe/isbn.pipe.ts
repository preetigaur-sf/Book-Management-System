import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isbn',
  standalone: true,
})
export class IsbnPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    value = value.replace(/\s+/g, '');

    if (!(value.length === 10 || value.length === 13) || !/^\d+$/.test(value)) {
      return 'Invalid ISBN';
    }

    if (value.length === 10) {
      return value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }

    if (value.length === 13) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '$1-$2-$3-$4');
    }

    return value;
  }
}
