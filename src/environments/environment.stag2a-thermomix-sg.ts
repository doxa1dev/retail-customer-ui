import { commonVariables, SingaporeBank, MalaysiaBank, PaymentOptions, PaymentMethods, company, dialCode, entity, GA_TRACKING_ID } from './common-env-variables';

const { has_phone_verification, ...otherCommonVariables } = commonVariables;


export const environment = {
  checkLanguage: false,
  checkOffice: true,
  production: false,
  hmr: false,
  baseUrl: 'https://stag2a-thermomix.doxa-holdings.com',

  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/stag2a-retail-public-bucket.doxa-holdings.com/',

  bankList: SingaporeBank,

  has_phone_verification : false,

  ...otherCommonVariables,

  paymentOptionList: [PaymentOptions.Full, PaymentOptions.OnLineEPP],
  paymentMethodList: [PaymentMethods.Office, PaymentMethods.TT, PaymentMethods.WireCardOTP, PaymentMethods.Sg2c2p],
  companyInfo: company.SG,
  dialcode : dialCode.SG,
  entity : entity.SG,
  GA_TRACKING_ID: GA_TRACKING_ID.test
};
