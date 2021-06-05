import { commonVariables, SingaporeBank, MalaysiaBank, PaymentOptions, PaymentMethods, company, dialCode, entity } from './common-env-variables';

export const environment = {
    checkLanguage: true,
    production: true,
    hmr: false,
    baseUrl: 'https://stag2a-thermomix.doxa-holdings.com',

    storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/stag2a-retail-public-bucket.doxa-holdings.com/',

    ...commonVariables,
    bankList: SingaporeBank,
    
    paymentOptionList: [PaymentOptions.Full, PaymentOptions.OffLineEPP, PaymentOptions.Recurring, PaymentOptions.OnLineEPP], 
    paymentMethodList: [PaymentMethods.Office, PaymentMethods.Ipay88OTP, PaymentMethods.FPX, PaymentMethods.TT, PaymentMethods.WireCardOTP, PaymentMethods.Sg2c2p],
    companyInfo: company.SG,
    dialcode : dialCode.SG,
    entity : entity.SG
};
