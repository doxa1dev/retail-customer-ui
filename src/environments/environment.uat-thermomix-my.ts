import { commonVariables, SingaporeBank, MalaysiaBank, PaymentOptions, PaymentMethods, company, dialCode, entity, GA_TRACKING_ID } from './common-env-variables';

export const environment = {
  checkLanguage: false,
  checkOffice: true,
  production: false,
  hmr: false,
  baseUrl: 'https://uat-thermomix.doxa-holdings.com',

  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/uat-retail-public-bucket.doxa-holdings.com/',

  bankList: SingaporeBank,
  
  ...commonVariables,

  
  paymentOptionList: [PaymentOptions.Full, PaymentOptions.OnLineEPP,PaymentOptions.OffLineEPP, PaymentOptions.Recurring], 
  paymentMethodList: [PaymentMethods.Office, PaymentMethods.Ipay88OTP, PaymentMethods.FPX , PaymentMethods.Sg2c2p], 
  companyInfo: company.MY,
  dialcode : dialCode.MY,
  entity : entity.MY,
  GA_TRACKING_ID: GA_TRACKING_ID.test
};
