// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { commonVariables, SingaporeBank, MalaysiaBank, PaymentOptions, PaymentMethods, company , dialCode, entity, GA_TRACKING_ID} from './common-env-variables';

export const environment = {
    checkLanguage: false,
    checkOffice: true,
    production: false,
    hmr: false,

    baseUrl: 'https://stag2a-thermomix.doxa-holdings.com',
    // baseUrl: 'http://localhost:8888',



    storageUrl: 'https://s3-ap-southeast-1.amazonaws.com/stag2a-retail-public-bucket.doxa-holdings.com/',
    
    bankList: SingaporeBank,
    
    ...commonVariables,

    paymentOptionList: [PaymentOptions.Full, PaymentOptions.OnLineEPP], 
    paymentMethodList: [PaymentMethods.Office, PaymentMethods.TT, PaymentMethods.WireCardOTP, PaymentMethods.Sg2c2p],
    companyInfo: company.SG,
    dialcode : dialCode.SG,
    entity : entity.SG,
    GA_TRACKING_ID: GA_TRACKING_ID.test
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
