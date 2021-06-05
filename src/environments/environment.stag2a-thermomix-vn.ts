import { commonVariables, SingaporeBank, MalaysiaBank, PaymentOptions, PaymentMethods, company, dialCode, entity, GA_TRACKING_ID } from './common-env-variables';

export const environment = {
  checkLanguage: false,
  checkOffice: true,
  production: false,
  hmr: false,
  baseUrl: 'https://stag2a-thermomix.doxa-holdings.com',


  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/stag2a-retail-public-bucket.doxa-holdings.com/',
  
  bankList: SingaporeBank,
  
  ...commonVariables,

  paymentOptionList: [PaymentOptions.Full, PaymentOptions.OffLineEPP, PaymentOptions.Recurring, PaymentOptions.OnLineEPP], 
  paymentMethodList: [PaymentMethods.Office,PaymentMethods.Ipay88OTP, PaymentMethods.FPX, PaymentMethods.TT, PaymentMethods.WireCardOTP, PaymentMethods.Sg2c2p], 
  companyInfo: company.SG,
  dialcode : dialCode.SG,
  entity : entity.VN,
  GA_TRACKING_ID: GA_TRACKING_ID.test
};
