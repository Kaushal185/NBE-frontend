import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'charArray'
})
export class CharArrayPipe implements PipeTransform {

  transform(value: string): string[] {
    return value.split('');
  }

}
