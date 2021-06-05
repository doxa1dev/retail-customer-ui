import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from 'app/core/enum/title';
import { MyCustomers } from 'app/core/models/my-customers';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MyCustomersService } from 'app/core/service/my-customers.service';

@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.component.html',
  styleUrls: ['./my-customers.component.scss']
})
export class MyCustomersComponent implements OnInit {

  title = Title.DOT;
  totalSize: number = 0;
  listCustomers = new Array<MyCustomers>();

  constructor(private router: Router,
    private customerService: MyCustomersService) { 
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<MyCustomers>;

  ngOnInit(): void {
    this.customerService.getListCustomers().subscribe(
      data => {
        
        this.listCustomers = data;
        this.totalSize = this.listCustomers.length;
        this.dataSource = new MatTableDataSource(this.listCustomers);
        // this.dataSource.paginator = this.paginator;
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.obs = this.dataSource.connect();
        
      }
    )
  }

  onViewCustomer(uuid) {
    this.router.navigate(['advisor/my-customers/detail'], {queryParams: {uuid: uuid}})
  }

}
