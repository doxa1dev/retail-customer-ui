import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { MustMatch } from '../../authentication/_helper/must-match.validator';
import { MyProfileService } from '../../../../core/service/my-profile.service';
import { MyProfile } from '../../../../core/models/my-profile.model';
import { UpdateProfile } from '../../../../core/models/update-profile.model';
import { ChangePassword } from '../../../../core/models/change-password.model';
import { Router, NavigationEnd } from '@angular/router';
import * as helper from '../_helper/helper-fn';

import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';
import { ToolbarComponent } from '../../../../layout/components/toolbar/toolbar.component';
import { ToolbarModule } from '../../../../layout/components/toolbar/toolbar.module';
import { ToolbarService } from '../../../../layout/components/toolbar/toolbar.service';
import { isNullOrUndefined } from 'util';
import { Title } from 'app/core/enum/title';
import { VerifyDialogComponent } from '@fuse/components/verify-dialog/verify-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/service/auth.service';
// import { VerifyDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  storageUrl = environment.storageUrl;
  countryCodeToName = environment.countryCodeToName;
  stateCodeToName = null;
  stateCodeToNameFormOptions = null;

  firstName = '';
  preferredName = '';
  addressLine1 = '';
  addressLine2 = '';
  addressLine3 = '';
  postalCode = '';
  stateCode = '';
  countryCode = '';
  displayAddress = '';
  displayStateCountry = '';
  phoneNumber = '';
  phoneNumberFull = '';
  phoneNumberTemp = '';
  email = '';
  password = '';
   myAdvisorId = '';
  myProfileImgUrl = '../../../../../assets/icons/ICON/AccountCircle.svg';
  salt = '';
  QF1CompleteStatus = '-';
  QF2CompleteStatus = '-';
  wrongOldPassword = false;
  advisorName = '';
  recruiterName = '';
  teamLeaderName = '';
  branchManagerName = '';
  advisor_id = '';
  recruiter_id = '';
  teamLeader_id = '';
  branchManager_id = '';
  advisorImg = '';
  recruiterImg = '';
  teamLeaderImg = '';
  branchManagerImg = '';
  name: string;
  isPersonalInfoEditing = false;
  isPasswordChanging = false;
  isShowAdvisorId=false;
  personalInfoForm: FormGroup;
  changePasswordForm: FormGroup;
  title = Title.DOT;
  version1 = environment.questionnaireOneVersion;
  version2 = environment.questionnaireTwoVersion;
  isPhonenumber: boolean = false;
  isEmail: boolean = false;
  messagePhone;
  messageEmail;
  is_active: boolean;
  is_registered: boolean;
  uuid

  constructor(
    private formBuilder: FormBuilder,
    private myProfileService: MyProfileService,
    private router: Router,
    private toolBarService: ToolbarService,
    public dialog: MatDialog,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    //fetch from api
    this.myProfileService.getProfile().subscribe(response => {
      if (response.code === 200) {
        this.router.navigate(["/my-profile"]);
        const myProfile: MyProfile = response.userProfileData;
        this.firstName = myProfile.firt_name;
        this.preferredName = myProfile.preferred_name;
        this.phoneNumber = myProfile.phone_dial_code + myProfile.phone_number;
        this.phoneNumberTemp = '+' + myProfile.phone_dial_code + ' ' + myProfile.phone_number;
        this.phoneNumberFull = '+' + myProfile.phone_dial_code + ' ' + myProfile.phone_number.slice(0, 3) + '*****' + myProfile.phone_number.slice(-3);
        this.messagePhone = 'An OTP will be sent to the following number: ' + this.phoneNumberFull
        this.email = myProfile.email; 
        this.messageEmail = 'An email will be sent to ' + this.email + ', please complete verification process.'
        this.myAdvisorId = helper.isEmptyOrNullOrUndefined(myProfile.my_advisor_id) ? '-' : myProfile.my_advisor_id;
        this.myProfileImgUrl = helper.isEmptyOrNullOrUndefined(myProfile.my_profile_photo_key) ? this.myProfileImgUrl : this.storageUrl + myProfile.my_profile_photo_key;
        this.advisorName = myProfile.advisor_name;
        this.recruiterName = myProfile.recruiter_name;
        this.teamLeaderName = myProfile.teamLeader_name;
        this.branchManagerName = myProfile.branchManager_name;
        this.advisor_id = helper.isEmptyOrNullOrUndefined(myProfile.advisor_id) ? '-' : myProfile.advisor_id;
        this.recruiter_id = helper.isEmptyOrNullOrUndefined(myProfile.recruiter_id) ? '-' : myProfile.recruiter_id;
        this.teamLeader_id = helper.isEmptyOrNullOrUndefined(myProfile.teamLeader_id) ? '-' : myProfile.teamLeader_id;
        this.branchManager_id = helper.isEmptyOrNullOrUndefined(myProfile.branchManager_id) ? '-' : myProfile.branchManager_id;
        this.advisorImg = helper.isEmptyOrNullOrUndefined(myProfile.advisor_photo_key) ? '' : this.storageUrl + myProfile.advisor_photo_key;
        this.recruiterImg = helper.isEmptyOrNullOrUndefined(myProfile.recruiter_photo_key) ? '' : this.storageUrl + myProfile.recruiter_photo_key;
        this.teamLeaderImg = helper.isEmptyOrNullOrUndefined(myProfile.teamLeader_photo_key) ? '' : this.storageUrl + myProfile.teamLeader_photo_key;
        this.branchManagerImg = helper.isEmptyOrNullOrUndefined(myProfile.branchManager_photo_key) ? '' : this.storageUrl + myProfile.branchManager_photo_key;
        this.addressLine1 = helper.isEmptyOrNullOrUndefined(myProfile.address_line1) ? '' : myProfile.address_line1;
        this.addressLine2 = helper.isEmptyOrNullOrUndefined(myProfile.address_line2) ? '' : myProfile.address_line2;
        this.addressLine3 = helper.isEmptyOrNullOrUndefined(myProfile.address_line3) ? '' : myProfile.address_line3;
        this.postalCode = helper.isEmptyOrNullOrUndefined(myProfile.postal_code) ? '' : myProfile.postal_code;
        this.stateCode = helper.isEmptyOrNullOrUndefined(myProfile.state_code) ? '' : myProfile.state_code;
        this.countryCode = helper.isEmptyOrNullOrUndefined(myProfile.country_code) ? '' : myProfile.country_code;
        this.name = helper.isEmptyOrNullOrUndefined(this.preferredName) ? this.firstName : this.preferredName;
        this.stateCodeToName = environment.countryCodeToStates[this.countryCode];
        this.stateCodeToNameFormOptions = environment.countryCodeToStates[this.countryCode];
        this.setDisplayAddressLine();
        this.setStateCountryLine();
        this.is_active = myProfile.is_active
        this.is_registered = myProfile.is_registered

      } else {
        this.router.navigate(["/login"]);
      }
    }, err => {
      console.log(err);
    }
    );

    this.myProfileService.getQuestionnaireStatus().subscribe(response => {
      this.QF1CompleteStatus = response.questionnaireOneStatus;
      this.QF2CompleteStatus = response.questionnaireTwoStatus;
    });

    this.personalInfoForm = new FormGroup({
      'first-name': new FormControl(null),
      'preferred-name': new FormControl(null),
      'address-line1': new FormControl(null, Validators.maxLength(30)),
      'address-line2': new FormControl(null, Validators.maxLength(30)),
      'address-line3': new FormControl(null, Validators.maxLength(30)),
      'postal-code': new FormControl(null),
      'state-code': new FormControl(null),
      'country-code': new FormControl(null),
    });

    this.changePasswordForm = this.formBuilder.group(
      {
        oldpassword: ['', [Validators.required, Validators.minLength(8)]],
        newpassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmpassword: ['', Validators.required]
      },
      {
        validator: [
          MustMatch('newpassword', 'confirmpassword')
        ]
      }
    );
    
  }

  onSelectFile(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type != "image/bmp" && file.type != "image/jpeg" && file.type != "image/png") {
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      // tslint:disable-next-line: no-shadowed-variable
      reader.onload = (event) => { // called once readAsDataURL is completed
        let preSignedUrl: string;
        let profilePhotoKey: string;
        let newtoken: string;
        let picture_name = file.name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
        this.myProfileService.getPreSignedUrl(picture_name, file.type).subscribe(response => {
          if (response.code === 200) {
            profilePhotoKey = response.key;
            preSignedUrl = response.url;
            newtoken = response.newtoken;
            this.myProfileService.uploadProfileImage(preSignedUrl, file.type, file).subscribe(response => {
              this.myProfileImgUrl = this.storageUrl + profilePhotoKey;
              localStorage.setItem("token", newtoken);

              this.toolBarService.changeUserMenuPhoto(profilePhotoKey);
            });
          }
        });
      };
    }
  }

  editPersonalInfo(): void {
    this.isPersonalInfoEditing = true;
    this.isPasswordChanging = false;
    this.personalInfoForm.setValue({
      'first-name': this.firstName,
      'preferred-name': this.preferredName,
      'address-line1': this.addressLine1,
      'address-line2': this.addressLine2,
      'address-line3': this.addressLine3,
      'postal-code': this.postalCode,
      'state-code': this.stateCode,
      'country-code': this.countryCode,
      // 'password': myProfile.password
    });
    this.stateCodeToNameFormOptions = environment.countryCodeToStates[this.countryCode];
  }

  closeEditPersonalInfo(): void {
    this.isPersonalInfoEditing = false;
  }

  changePassword(): void {
    this.isPasswordChanging = true;
    this.isPersonalInfoEditing = false;
    this.changePasswordForm.reset();

  }

  closeChangePassword(): void {
    this.isPasswordChanging = false;
    this.wrongOldPassword = false;
  }

  saveNewPersonalInfo(): void {
    //console.log(this.personalInfoForm);
    const updateProfile: UpdateProfile = new UpdateProfile(
      this.personalInfoForm.get('first-name').value,
      this.personalInfoForm.get('preferred-name').value,
      this.personalInfoForm.get('address-line1').value,
      this.personalInfoForm.get('address-line2').value,
      this.personalInfoForm.get('address-line3').value,
      this.personalInfoForm.get('postal-code').value,
      this.personalInfoForm.get('state-code').value,
      this.personalInfoForm.get('country-code').value
    );

    this.myProfileService.updateProfile(updateProfile).subscribe(response => {
      console.log(response);
    });

    this.firstName = this.personalInfoForm.get('first-name').value;
    this.preferredName = this.personalInfoForm.get('preferred-name').value;
    this.addressLine1 = this.personalInfoForm.get('address-line1').value;
    this.addressLine2 = this.personalInfoForm.get('address-line2').value;
    this.addressLine3 = this.personalInfoForm.get('address-line3').value;
    this.postalCode = this.personalInfoForm.get('postal-code').value;
    this.stateCode = this.personalInfoForm.get('state-code').value;
    this.countryCode = this.personalInfoForm.get('country-code').value;
    this.stateCodeToName = environment.countryCodeToStates[this.countryCode];
    this.setDisplayAddressLine();
    this.setStateCountryLine();
    this.isPersonalInfoEditing = false;
  }

  saveNewPassword(): void {
    const changePassword: ChangePassword = new ChangePassword(
      this.changePasswordForm.get('oldpassword').value,
      this.changePasswordForm.get('newpassword').value,
      this.changePasswordForm.get('confirmpassword').value
    );

    this.myProfileService.changePassword(changePassword).subscribe(response => {
      if (response.code === 201) {
        this.wrongOldPassword = true;
        this.changePasswordForm.get('oldpassword').markAsPristine();
      }

      if (response.code === 200) {
        this.wrongOldPassword = false;
        Swal.fire({
          text: 'Password changed successfully!',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => { this.isPasswordChanging = false; }, 500);
      }

      if (response.code === 304) {
        Swal.fire({
          title: 'No change in password',
          text: 'Please change again!',
        });
      }
      console.log(response);
    });

  }

  setFormState(event): void {
    const selectedCountryCode = event.value;
    this.stateCodeToNameFormOptions = environment.countryCodeToStates[selectedCountryCode];
  }

  keepOriginalOrder = (a, b) => a.key;

  goToQuestionnaire1(): void {
    this.router.navigate(['/questionnaire/one'], { queryParams: {version: this.version1}});
  }

  goToQuestionnaire2(): void {
    this.router.navigate(['/questionnaire/two'], { queryParams: {version: this.version2}});
  }

  private setDisplayAddressLine() {
    const address1 = !helper.isEmptyOrNullOrUndefined(this.addressLine1) ? this.addressLine1 + ', ' : '';
    const address2 = !helper.isEmptyOrNullOrUndefined(this.addressLine2) ? this.addressLine2 + ', ' : '';
    const address3 = !helper.isEmptyOrNullOrUndefined(this.addressLine3) ? this.addressLine3 + ', ' : '';
    const postal = !helper.isEmptyOrNullOrUndefined(this.postalCode) ? this.postalCode : '';

    this.displayAddress = address1 + address2 + address3 + postal;
  }

  private setStateCountryLine() {
    const state = !helper.isEmptyOrNullOrUndefined(this.stateCode) ? this.stateCodeToName[this.stateCode] + ', ' : '';
    const country = !helper.isEmptyOrNullOrUndefined(this.countryCode) ? this.countryCodeToName[this.countryCode] : '';

    this.displayStateCountry = state + country;
  }

  verifyPhone() {
    const dialogRef = this.dialog.open(VerifyDialogComponent, {
      width: "550px",
      data: {
        message: this.messagePhone,
        title:
        "CONFIRM",
        isPhonenumber: true
      },
    });

    dialogRef.afterClosed().subscribe( data => {
      if (data == true) {
        localStorage.setItem('phoneNumber', this.phoneNumber);
        localStorage.setItem('email', this.email);
        this.router.navigate(['/register/code/verify']);
      } else {
        return;
      }
    });
    return;
  }

  verifyEmail() {
    const dialogRef = this.dialog.open(VerifyDialogComponent, {
      width: "550px",
      data: {
        message: this.messageEmail,
        title:
        "CONFIRM",
        isEmail: true
      },
    });
    dialogRef.afterClosed().subscribe( data => {
      if (data == true) {
        this.authService.verify({ email: this.email }).subscribe(() => {
         return
        })
      } else {
        return;
      }
    });
    return;
  }
}
