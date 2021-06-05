import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import * as DIALS from '../../../../../assets/dialcode.json';


@Component({
  selector: 'app-dialCode',
  templateUrl: './dial-code.component.html',
  styleUrls: ['./dial-code.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  animations: fuseAnimations
})
export class DialCodeComponent implements OnInit {
  selectedDial = '93';
  @Input() disable: boolean ;  


  @Input()
  set SelectedDial(selectedDial: string) {
    this.selectedDial = selectedDial;
  }

  get SelectedDial(): string { return this.selectedDial; }

  dials = (DIALS as any).default;

  constructor(
    private _fuseConfigService: FuseConfigService,
  ) {
    this.dials = (DIALS as any).default;
  }
  ngOnInit(): void { }
}
