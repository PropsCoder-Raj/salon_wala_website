import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spiltPipe'
})
export class SpiltPipePipe implements PipeTransform {

  transform(input: string): string {
    let nameArr = input.split(',');
    let arrLen = nameArr.length;

    let loc = "";
    for(let i = 0; i<arrLen;i++){
      if(i == (arrLen-2))
        loc += nameArr[i]

      if(i == (arrLen-1))
      loc += ", "+nameArr[i]
    }


    return loc;
  }

}
