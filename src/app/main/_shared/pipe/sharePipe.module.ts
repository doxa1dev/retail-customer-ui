import { NgModule } from '@angular/core';
import { TitletranformPipe} from './title.pipe';

@NgModule({
  imports: [],
  declarations: [ 
    TitletranformPipe
  ],
  exports: [
    TitletranformPipe
  ]
})
export class SharePipeModule{
    static forRoot() {
        return {
            ngModule: SharePipeModule,
            providers: [],
        };
     }
}