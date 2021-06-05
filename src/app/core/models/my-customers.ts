import { QuestionOne } from './question-one';
import { QuestionTwo } from './question-two';

export class MyCustomers {
    id: string;
    uuid: string;
    customerName: string;
    phoneNumber: string;
    email: string;
}

export class CustomerInformation {
    nameAsInIC: string;
    nickName: string;
    preferredName: string;
    address: string;
    country: string;
    email: string;
    phoneNumber: string;
    statusQuestion1: string;
    statusQuestion2: string;
    advisorName: string;
    advisorId: string;
    advisorImage: string;
    recruiterName: string;
    recruiterId: string;
    recruiterImage: string;
    teamLeaderName: string;
    teamLeaderId: string;
    teamLeaderImage: string;
    branchManagerName: string;
    branchManagerId: string;
    branchManagerImage: string;

    //Questionnaire
    questionnaireOne: QuestionOne;
    questionnaireTwo: QuestionTwo;
    //order history
    orderHistory?=[];
    listProduct?=[]
    status: string;
    // productName: string;
    // price: string
    // advisor_id: string;
    // advisor_name: string;
    total: string;
    id : string;

}


