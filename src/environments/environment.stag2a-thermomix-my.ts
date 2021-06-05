import { commonVariables, MalaysiaBank, PaymentOptions, PaymentMethods, company, dialCode, entity, GA_TRACKING_ID } from './common-env-variables';

export const environment = {
  checkLanguage: true,
  checkOffice: true,
  production: false,
  hmr: false,
  baseUrl: 'https://stag2a-thermomix.doxa-holdings.com',
  // baseUrl: 'http://localhost:8888',



  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/stag2a-retail-public-bucket.doxa-holdings.com/',

  bankList: MalaysiaBank,

  ...commonVariables,

  paymentOptionList: [PaymentOptions.Full, PaymentOptions.OffLineEPP, PaymentOptions.Recurring],
  paymentMethodList: [PaymentMethods.Office, PaymentMethods.Ipay88OTP, PaymentMethods.FPX , PaymentMethods.Sg2c2p],
  companyInfo: company.MY,
  dialcode : dialCode.MY,
  entity : entity.MY,
  GA_TRACKING_ID: GA_TRACKING_ID.test
};
