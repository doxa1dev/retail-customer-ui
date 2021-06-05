import { commonVariables, commonVariablesProd, MalaysiaBank, PaymentOptions, PaymentMethods, company, dialCode, entity, GA_TRACKING_ID } from './common-env-variables';

const { has_phone_verification, wireCardOtpUrl, wireCardIppUrl, ipay88OtpUrl, ipay88FpxUrl, ipay88RecurringUrl, ...otherCommonVariables } = commonVariables;

export const environment = {
  checkLanguage: true,
  checkOffice: true,
  production: true,
  hmr: false,
  baseUrl: 'https://thermomix-api.doxa-holdings.com',

  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/prod-retail-public-bucket.doxa-holdings.com/',

  bankList: MalaysiaBank,

  has_phone_verification : true,

  paymentOptionList: [PaymentOptions.Full, PaymentOptions.OffLineEPP, PaymentOptions.Recurring, PaymentOptions.OnLineEPP],
  paymentMethodList: [PaymentMethods.Office, PaymentMethods.Ipay88OTP, PaymentMethods.FPX, PaymentMethods.Sg2c2p],
  companyInfo: company.MY,
  dialcode : dialCode.MY,
  ...otherCommonVariables,
  ...commonVariablesProd,
  entity : entity.MY,
  GA_TRACKING_ID: GA_TRACKING_ID.prod
};
