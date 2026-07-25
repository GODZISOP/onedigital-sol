import * as fabric from 'fabric';
console.log(Object.keys(fabric).filter(k => k.includes('Text')));
console.log("IText type:", typeof fabric.IText);
