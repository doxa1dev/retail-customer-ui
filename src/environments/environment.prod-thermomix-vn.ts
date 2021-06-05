import { commonVariables, commonVariablesProd, SingaporeBank, PaymentOptions, PaymentMethods, company, dialCode, entity, GA_TRACKING_ID } from './common-env-variables';

const { wireCardOtpUrl, wireCardIppUrl, ipay88OtpUrl, ipay88FpxUrl, ipay88RecurringUrl, ...otherCommonVariables } = commonVariables;
const { has_phone_verification, ...otherCommonVariablesProd } = commonVariablesProd;

export const environment = {
  checkLanguage: true,
  checkOffice: true,
  production: true,
  hmr: false,
  baseUrl: 'https://thermomix-api.doxa-holdings.com',

  storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/prod-retail-public-bucket.doxa-holdings.com/',

  bankList: SingaporeBank,

  paymentOptionList: [PaymentOptions.Full, PaymentOptions.OffLineEPP, PaymentOptions.Recurring, PaymentOptions.OnLineEPP],
  paymentMethodList: [PaymentMethods.Office, PaymentMethods.Ipay88OTP, PaymentMethods.FPX, PaymentMethods.TT, PaymentMethods.WireCardOTP, PaymentMethods.Sg2c2p],
  companyInfo: company.SG,
  dialcode : dialCode.SG,
  ...otherCommonVariables,
  ...otherCommonVariablesProd,
  entity : entity.VN,
  GA_TRACKING_ID: GA_TRACKING_ID.test
};
