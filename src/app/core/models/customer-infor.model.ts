export class CustomerInfor {

    //Personal Information
    publicId: string
    nameAsInIC: string;
    nickName: string;
    preferredName: string;
    address: string;
    country: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    postalCode: string;
    stateCode: string;
    countryCode: string;
  
    //Privacy
    email: string;
    phoneDialCode: string;
    phoneNumber: string;
    phoneNumberAndDialCode: string;
    //Advising Team
    myAdvisorId: string;
  
    advisorName: string;
    advisorId: string;
    advisorPhotoKey: string;
  
    recruiterName: string;
    recruiterId: string;
    recruiterPhotoKey: string;
  
    teamLeaderName: string;
    teamLeaderId: string;
    teamLeaderPhotoKey: string;
  
    branchManagerName: string;
    branchManagerId: string;
    branchManagerPhotoKey: string;
  
    //History
    customerUpdateHistory: any = [];
    phoneNumberFull: string;
  }
  