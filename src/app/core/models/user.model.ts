export class User {
    public_id : string;
    firt_name: string;
    last_name: string;
    preferred_name: string;
    email: string;
    password: string;
    designation: string;
    phone_dial_code: string;
    phone_number: string;
    advised_by_customer_id: string;
    language_code: string;
    contact_uuid: string; 
    contact_id : string;
    constructor(
        public_id : string,
        firstName: string,
        lastName: string,
        preferredname: string,
        email: string,
        password: string,
        designation: string,
        phone_dial_code: string,
        phone_number: string,
       // advised_by_customer_id: string,
        language_code: string,
        contact_uuid: string,
        contact_id : string
    ) {
        this.public_id = public_id;
        this.firt_name = firstName;
        this.last_name = lastName;
        this.preferred_name = preferredname;
        this.email = email;
        this.password = password;
        this.designation = designation;
        this.phone_dial_code = phone_dial_code;
        this.phone_number = phone_number;
      //  this.advised_by_customer_id = advised_by_customer_id;
        this.language_code = language_code;
        this.contact_uuid = contact_uuid;
        this.contact_id = contact_id
    }
}

export class Advisor {
    name: string;
    id: string;
    avatar: string;
    uuid : string;
}


export class UserNoRegister{
    public_id : string;
    firt_name: string;
    preferred_name: string;
    email: string;
    designation: string;
    phone_number: string;
    phone_dial_code: string;
    advised_by_customer_id: string;
    advisor_first_name : string;
    advisor_last_name : string;
    advisor_preferred_name : string;
    advisor_photo_key : string;

}
