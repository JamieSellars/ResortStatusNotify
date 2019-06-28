import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupbyPipe implements PipeTransform {

  transform(collection: Array<any>, property: string): Array<any> {
    
    if(!collection)
      return null;

    const groupCollection = collection.reduce((previous, current) => {

      if( !previous[current[property]])
        previous[current[property]] = [current];
      else
        previous[current[property]].push(current);

      return previous;
      
    }, {});

    return Object.keys(groupCollection).map( key => ({
      key, value: groupCollection[key]
    }));

  }

}
