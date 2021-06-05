import { commonVariables, SingaporeBank, MalaysiaBank, PaymentOptions, PaymentMethods, company, dialCode, entity } from './common-env-variables';

export const environment = {
  checkLanguage: false,
  checkOffice: false,
  production: true,
  hmr: false,
  baseUrl: 'http://localhost:8888',

  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/stag2a-retail-public-bucket.doxa-holdings.com/',

  bankList: SingaporeBank,
  ...commonVariables,

  paymentOptionList: [PaymentOptions.Full, PaymentOptions.OffLineEPP, PaymentOptions.Recurring, PaymentOptions.OnLineEPP],
  paymentMethodList: [PaymentMethods.Office, PaymentMethods.Ipay88OTP, PaymentMethods.FPX, PaymentMethods.TT, PaymentMethods.WireCardOTP],
  companyInfo: company.SG,
  dialcode : dialCode.SG,
  entity : entity.SG
};
