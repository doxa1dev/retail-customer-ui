import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Title } from 'app/core/enum/title';
import { ActivityService } from 'app/core/service/activity.service';
import { FormJustHost, JustHostService } from 'app/core/service/just-host.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-form-just-host',
  templateUrl: './form-just-host.component.html',
  styleUrls: ['./form-just-host.component.scss']
})
export class FormJustHostComponent implements OnInit {

  title = Title.LEFT_LINK;
  imgUrl: string;
  justHostForm: FormGroup;
  today = new Date();
  isSubmit: boolean = false;
  coverphotokey : string;
  storageUrl = environment.storageUrl;
  maximumImageSize : number = environment.imageSize;

  constructor(
    private justHostService : JustHostService,
    private router : Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private activityService: ActivityService,
  ) { }

  ngOnInit(): void {
    this.justHostForm = this.formBuilder.group({
      host_name: ['', Validators.required],
      host_contact_number: ['', [Validators.required , Validators.maxLength(40)]],
      demo_date: ['', Validators.required],
      address_line1: ['', [Validators.required , Validators.maxLength(40)]],
      address_line2: ['', [Validators.required , Validators.maxLength(40)]],
      address_line3: ['', [Validators.maxLength(40)]],
      postal_code: ['' , [Validators.maxLength(10)]],
      guest: this.formBuilder.array([
        this.formBuilder.group({
          guest_name: ['', [Validators.required]],
          guest_contact_number : ['', [Validators.required , Validators.maxLength(40)]]
        })
      ]),
    });

  }

  submit(){
    this.isSubmit = true;
    console.log(this.justHostForm.value.guest)
    if(this.justHostForm.invalid || CheckNullOrUndefinedOrEmpty(this.imgUrl)){
      return;
    }else{
      const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:
          "Are you sure you want to create this event?",
          title: "CONFIRM",
          colorButton: false,
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          let formCreate = new FormJustHost();
          formCreate.host_name = this.justHostForm.value.host_name;
          formCreate.host_contact_number = this.justHostForm.value.host_contact_number;
          formCreate.demo_date = this.justHostForm.value.demo_date;
          formCreate.address_line1 = this.justHostForm.value.address_line1;
          formCreate.address_line2 = this.justHostForm.value.address_line2;
          formCreate.address_line3 = this.justHostForm.value.address_line3;
          formCreate.postal_code = this.justHostForm.value.postal_code;
          formCreate.guest = this.justHostForm.value.guest;
          formCreate.demo_photo = this.coverphotokey;
          // console.log(formCreate);
          this.justHostService.createJustHost(formCreate).subscribe(data=>{
            if(data.code ===200){
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: data.message,
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(()=>{
                this.router.navigate(['/advisor/just-host'])
              })
            }
          })
        }
      })
    }
  }

  cancle(){
    this.router.navigate(['/advisor/just-host'])
  }

  keyPressNumbers(event) {
    let charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  onChangeDate(event){

  }

  onSelectFile(event){
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type != "image/bmp" && file.type != "image/jpeg" && file.type != "image/jpg" && file.type != "image/png") {
        return;
      }
      if (file.size > this.maximumImageSize * 1024 * 1024) {
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              `Maximum File Size ${this.maximumImageSize} MB. Please choose another picture`,
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
  
        });
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        let preSignedUrl: string;
        let profilePhotoKey: string;
        this.activityService.getPreSignedUrl(Date.now().toString() + file.name, file.type).subscribe(response => {
          if (response.code === 200) {
            profilePhotoKey = response.key;
            preSignedUrl = response.url;
            this.activityService.uploadActivityImage(preSignedUrl, file.type, file).subscribe(
              response => {
                this.imgUrl = this.storageUrl + profilePhotoKey;
              }
            );
            this.coverphotokey = profilePhotoKey;
            return profilePhotoKey;
          }
        });
      };
    }
  }

  addOrRemoveGuest(action: string, index: number) {
    const newForm = this.formBuilder.group({
      guest_name: ['', [Validators.required]],
      guest_contact_number : ['', [Validators.required , Validators.maxLength(40)]]
    })
    const guest= this.justHostForm['controls'].guest as FormArray;
    if (action === 'add') {
      guest.push(newForm);
    }
    else {
      if (guest.length === 1) {
        return;
      }
      guest.removeAt(index);
    }
  }

}
