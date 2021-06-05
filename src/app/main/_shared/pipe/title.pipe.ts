import {Pipe, PipeTransform} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isNullOrUndefined } from 'util';

@Pipe({name: 'titletranformPipe'})
export class TitletranformPipe implements PipeTransform {
  // transform(value: any) {
    
  //   return value.replace("or","<p style='color:red'>THACH</p>")
  // }

  constructor(private sanitizer:DomSanitizer){}

  transform(style) {
    
      if(!isNullOrUndefined(style))
      {
        // let html = style.replace("®","<span style='font-family:monospace; font-size:20px'>®</span>")
        let html = style.replace("®","<sup>®</sup>")
        
        return this.sanitizer.bypassSecurityTrustHtml(html);
      }
     

    
    //return this.sanitizer.bypassSecurityTrustStyle(style);
    // return this.sanitizer.bypassSecurityTrustXxx(style); - see docs
  }
}