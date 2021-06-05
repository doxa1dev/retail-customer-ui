import { RecruitEnum} from 'app/core/enum/recruit'
export class listRecruit{
    customer : customer;
    status : status;
    recruitedby: RecruiterCustomer;
}
export class customer{
    customer_name: string;
    email: string;
    dial_code: string;
    phone_number: string;
    uuid : string;
    customerUuid: string;
}
export class status {
    recruit_status: RecruitEnum;
    recruit_uuid : string;
}

export class RecruiterCustomer {
    recruiterName: string;
    recruiterId: string;
}


export class recruitDetail {
    status : string;
    name : string;
    email : string;
    phone_number : string;
    photo_key : string;
    advisor_name : string;
    advisor_id : string;
    bank_code: string;
    bank_name: string;
    bank_account: string;
    bank_holder: string;
    bank_holder_ic: string;
    comment : string;
}