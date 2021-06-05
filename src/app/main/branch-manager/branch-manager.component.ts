import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router} from '@angular/router';
import { Title } from 'app/core/enum/title'
@Component({
  selector: 'app-branch-manager',
  templateUrl: './branch-manager.component.html',
  styleUrls: ['./branch-manager.component.scss'],
  encapsulation: ViewEncapsulation.Emulated

})
export class BranchManagerComponent implements OnInit {
  title = Title.DOT;
  constructor(
    private router : Router
  ) { }

  ngOnInit(): void {
  }
  goPendingRoom(){
    this.router.navigate(['/branch-manager/pending-room-booking'], { queryParams: { status: 'pending' } })
  }
  goPastRoom()
  {
    this.router.navigate(['/branch-manager/pending-room-booking'], { queryParams: { status: 'past' } })
  }
  goRoomStatus()
  {
    this.router.navigate(['/branch-manager/room-status'])
  }
}
