import { commonVariables, SingaporeBank, MalaysiaBank, PaymentOptions, PaymentMethods, company, dialCode, entity } from './common-env-variables';

export const environment = {
  checkLanguage: false,
  checkOffice: false,
  production: true,
  hmr: false,
  baseUrl: 'https://stag5-thermomix.doxa-holdings.com',

  storageUrl: 'http://stag5-retail-public-bucket.doxa-holdings.com.s3-website-ap-southeast-1.amazonaws.com/',

  bankList: SingaporeBank,

  ...commonVariables,

  paymentOptionList: [PaymentOptions.Full, PaymentOptions.OnLineEPP], 
  paymentMethodList: [PaymentMethods.Office, PaymentMethods.TT, PaymentMethods.WireCardOTP], 
  companyInfo: company.SG,
  dialcode : dialCode.SG,
  entity : entity.SG
};
