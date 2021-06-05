import { MyContacts } from './../../core/models/my-contacts.model';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { isEmptyOrNullOrUndefined } from 'app/main/account/profile/_helper/helper-fn';
import { resolve } from 'dns';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from 'app/core/enum/title';
import { MyContactsService } from 'app/core/service/my-contact.service';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  title = Title.DOT;

  myContacts = [];
  totalSize: number = 0;
  advisorId: string;
  isShowadvisorId : boolean = false;

  constructor(
    private contact: MyContactsService,
    private router : Router
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<MyContacts>;

  ngOnInit(): void {
    // get list of contacts
    this.contact.getContactList('').subscribe(
      data => {
      if(!CheckNullOrUndefinedOrEmpty(data)) {
        this.myContacts = data;
        this.totalSize = this.myContacts.length;
        this.dataSource = new MatTableDataSource(this.myContacts);
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      }
    })
  }

  // search list contact
  searchContacts(searchContact: string) {
    setTimeout(() => {
      this.contact.getContactList(searchContact).subscribe( data => {
        this.myContacts = data;
        this.totalSize = this.myContacts.length;
        this.dataSource = new MatTableDataSource(this.myContacts);
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      })
    }, 500);
  }

  onViewDetail(uuid) {
    this.router.navigate(['/contact-list/detail'], {queryParams: {uuid: uuid}});
  }
}
