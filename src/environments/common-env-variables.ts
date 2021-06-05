export const commonVariables = {
  questionnaireOneVersion: 'V01.01',
  questionnaireTwoVersion: 'V01.01',
  has_phone_verification: false,

  //maximum image size 4MB.
  imageSize : 4,

  trackingHosts: {
    'DHL eCommerce Malaysia': 'https://www.dhl.com/my-en/home/tracking/tracking-ecommerce.html?tracking-id=<TRACKING_ID>',
    'GDex Singapore': 'https://web3.gdexpress.com/official/iframe/etracking_v4.php?input=<TRACKING_ID>&choice=cnGdex',
    'ABX Express': 'https://www.tracking.my/abx/<TRACKING_ID>',
    'Asiaxpress': 'https://www.tracking.my/asiaxpress/<TRACKING_ID>',
    'QXPRESS': 'https://www.qxpress.net/Customer/PopupTraceParcels?TrackingNo=<TRACKING_ID>',
    'MXPRESS': 'https://gold.mxpress2u.net/gold/PublicShipmentTracking.aspx?cn=<TRACKING_ID>'
  },

  countryCodeToName: {
    SG: 'Singapore',
    MY: 'Malaysia'
  },

  countryCodeToStates: {
    SG: {
      SG: 'Singapore'
    },
    MY: {
      W: 'Kuala Lumpur',
      L: 'Labuan',
      F: 'Putrajaya',
      J: 'Johor',
      K: 'Kedah',
      D: 'Kelantan',
      M: 'Malacca',
      N: 'Negeri Sembilan',
      C: 'Pahang',
      A: 'Perak',
      R: 'Perlis',
      P: 'Penang',
      S: 'Sabah',
      Q: 'Sarawak',
      B: 'Selangor',
      T: 'Terengganu'
    }
  },

  wireCardOtpUrl: 'https://wpp-test.wirecard.com.sg/loader/paymentPage.js',
  wireCardIppUrl: 'https://test.wirecard.com.sg/engine/hpp/paymentPageLoader.js',
  ipay88OtpUrl: 'https://payment.ipay88.com.my/ePayment/entry.asp',
  ipay88FpxUrl: 'https://dvl3.ipay88.com/epayment/entry.asp',
  // ipay88FpxUrl: 'https://payment.ipay88.com.my/ePayment/entry.asp',
  ipay88RecurringUrl: 'https://payment.ipay88.com.my/recurringpayment2.0/subscription.asp',
  SG2c2pUrl: 'https://demo2.2c2p.com/2C2PFrontEnd/RedirectV3/payment',
  // SG2c2pUrl: 'https://t.2c2p.com/RedirectV3/payment',

  
  Uen : { 
    SG : "201609998E",
    MY : ''
  },
  mpgsOtpUrl: 'https://test-gateway.mastercard.com/checkout/version/57/checkout.js',
  
  termAndPolycy :{
    SG : {
      term : 'https://thermomix.com.sg/terms-of-use/', 
      policy : 'https://thermomix.com.sg/privacy-policy/'
    },
    MY : {
      term : 'https://thermomix.com.my/terms-conditions-policies/', 
      policy : 'https://thermomix.com.my/privacy-policy/'
    }
  }
};

export const commonVariablesProd = {
  has_phone_verification: true,

  wireCardOtpUrl: 'https://wpp.wirecard.com.sg/loader/paymentPage.js',
  wireCardIppUrl: 'https://api.wirecard.com.sg/engine/hpp/paymentPageLoader.js',
  ipay88OtpUrl: 'https://payment.ipay88.com.my/ePayment/entry.asp',
  ipay88FpxUrl: 'https://payment.ipay88.com.my/ePayment/entry.asp',
  ipay88RecurringUrl: 'https://payment.ipay88.com.my/recurringpayment2.0/subscription.asp',
  mpgsOtpUrl: 'https://ap-gateway.mastercard.com/checkout/version/57/checkout.js',
  SG2c2pUrl: 'https://t.2c2p.com/RedirectV3/payment'
};

export const MalaysiaBank: IBank[] = [
  {
    "bank_code": "AEON",
    "bank_name": "AEON",
    "full_desc": "AEON"
  },
  {
    "bank_code": "AFF",
    "bank_name": "Affin Bank",
    "full_desc": "AFFIN Bank"
  },
  {
    "bank_code": "ALLI",
    "bank_name": "Alliance",
    "full_desc": "Alliance Bank"
  },
  {
    "bank_code": "AMB",
    "bank_name": "AM BANK",
    "full_desc": "AM Bank"
  },
  {
    "bank_code": "ARJ",
    "bank_name": "Al Rajhi Bank",
    "full_desc": "Al Rajhi Bank"
  },
  {
    "bank_code": "BIMB",
    "bank_name": "Bank Islam Malaysia",
    "full_desc": "Bank Islam Malaysia Bhd"
  },
  {
    "bank_code": "BIS",
    "bank_name": "Bank Islam",
    "full_desc": "Bank Islam"
  },
  {
    "bank_code": "BSN",
    "bank_name": "Bank Simpanan National",
    "full_desc": "Bank Simpanan National Bhd"
  },
  {
    "bank_code": "CIMB",
    "bank_name": "CIMB",
    "full_desc": "CIMB Bank"
  },
  {
    "bank_code": "CITI",
    "bank_name": "CitiBank",
    "full_desc": "Citi Bank"
  },
  {
    "bank_code": "DEUT",
    "bank_name": "Deutche",
    "full_desc": "Deutche Bank"
  },
  {
    "bank_code": "EON",
    "bank_name": "EON Bank",
    "full_desc": "EON Bank"
  },
  {
    "bank_code": "HAPS",
    "bank_name": "Hap Seng Bank",
    "full_desc": "Hap Seng Bank"
  },
  {
    "bank_code": "HLB",
    "bank_name": "Hong Leong",
    "full_desc": "Hong Leong Bank"
  },
  {
    "bank_code": "HSBC",
    "bank_name": "HSBC",
    "full_desc": "Hong Kong & Shanghai Bank"
  },
  {
    "bank_code": "MAY",
    "bank_name": "MayBank",
    "full_desc": "MayBank"
  },
  {
    "bank_code": "MBF",
    "bank_name": "MBF",
    "full_desc": "MBF"
  },
  {
    "bank_code": "OCBC",
    "bank_name": "OCBC",
    "full_desc": "OCBC Bank"
  },
  {
    "bank_code": "OTH",
    "bank_name": "Others",
    "full_desc": "Other Bank"
  },
  {
    "bank_code": "PBB",
    "bank_name": "Public Bank",
    "full_desc": "Public Bank Bhd"
  },
  {
    "bank_code": "RHB",
    "bank_name": "RHB",
    "full_desc": "RHB Bank"
  },
  {
    "bank_code": "STC",
    "bank_name": "Stand Chart",
    "full_desc": "Standard  & Chatered"
  },
  {
    "bank_code": "UOB",
    "bank_name": "UOB",
    "full_desc": "UOB Bank"
  }
];

export const SingaporeBank: IBank[] = [
  {
    "bank_code": "AEON",
    "bank_name": "AEON",
    "full_desc": "AEON"
  },
  {
    "bank_code": "AFF",
    "bank_name": "Affin Bank",
    "full_desc": "AFFIN Bank"
  },
  {
    "bank_code": "ALLI",
    "bank_name": "Alliance",
    "full_desc": "Alliance Bank"
  },
  {
    "bank_code": "AMB",
    "bank_name": "AM BANK",
    "full_desc": "AM Bank"
  },
  {
    "bank_code": "ARJ",
    "bank_name": "Al Rajhi Bank",
    "full_desc": "Al Rajhi Bank"
  },
  {
    "bank_code": "BIMB",
    "bank_name": "Bank Islam Malaysia",
    "full_desc": "Bank Islam Malaysia Bhd"
  },
  {
    "bank_code": "BIS",
    "bank_name": "Bank Islam",
    "full_desc": "Bank Islam"
  },
  {
    "bank_code": "BSN",
    "bank_name": "Bank Simpanan National",
    "full_desc": "Bank Simpanan National Bhd"
  },
  {
    "bank_code": "CIMB",
    "bank_name": "CIMB",
    "full_desc": "CIMB Bank"
  },
  {
    "bank_code": "CITI",
    "bank_name": "CitiBank",
    "full_desc": "Citi Bank"
  },
  {
    "bank_code": "DBS",
    "bank_name": "DBS Bank",
    "full_desc": "Development Bank of Singapore Limited"
  },
  {
    "bank_code": "DEUT",
    "bank_name": "Deutche",
    "full_desc": "Deutche Bank"
  },
  {
    "bank_code": "EON",
    "bank_name": "EON Bank",
    "full_desc": "EON Bank"
  },
  {
    "bank_code": "HAPS",
    "bank_name": "Hap Seng Bank",
    "full_desc": "Hap Seng Bank"
  },
  {
    "bank_code": "HLB",
    "bank_name": "Hong Leong",
    "full_desc": "Hong Leong Bank"
  },
  {
    "bank_code": "HSBC",
    "bank_name": "HSBC",
    "full_desc": "Hong Kong & Shanghai Bank"
  },
  {
    "bank_code": "MAY",
    "bank_name": "MayBank",
    "full_desc": "MayBank"
  },
  {
    "bank_code": "MBF",
    "bank_name": "MBF",
    "full_desc": "MBF"
  },
  {
    "bank_code": "OCBC",
    "bank_name": "OCBC",
    "full_desc": "OCBC Bank"
  },
  {
    "bank_code": "OTH",
    "bank_name": "Others",
    "full_desc": "Other Bank"
  },
  {
    "bank_code": "PBB",
    "bank_name": "Public Bank",
    "full_desc": "Public Bank Bhd"
  },
  {
    "bank_code": "POSB",
    "bank_name": "POSB Bank",
    "full_desc": "Post Office Savings Bank"
  },
  {
    "bank_code": "RHB",
    "bank_name": "RHB",
    "full_desc": "RHB Bank"
  },
  {
    "bank_code": "STC",
    "bank_name": "Stand Chart",
    "full_desc": "Standard  & Chatered"
  },
  {
    "bank_code": "UOB",
    "bank_name": "UOB",
    "full_desc": "UOB Bank"
  }
];

export const PaymentOptions = {
  Full: {
    "name": "FULL",
    "desc": "Full payment"
  },
  OffLineEPP: {
    "name": "OFFLINE-EPP",
    "desc": "Off-line easy payment plan"
  },
  Recurring: {
    "name": "RECURRING",
    "desc": "recurring payment"
  },
  OnLineEPP: {
    "name": "ONLINE-EPP",
    "desc": "online installment payment plan"
  }
};

export const PaymentMethods: IPaymentMethodList = {
  Office: {
    "name": "PAY_AT_OFFICE",
    "desc": "pay at office"
  },
  TT: {
    "name": "PAY_ONLINE_TT",
    "desc": "upload TT receipt to the system"
  },
  Ipay88OTP: {
    "name": "PAY_BY_IPAY88_OTP",
    "desc": "pay by credit card via ipay88 gateway"
  },
  FPX: {
    "name": "PAY_BY_IPAY88_FPX",
    "desc": "pay by online banking via ipay88 FPX gateway"
  },
  WireCardOTP: {
    "name": "PAY_BY_WIRECARD_OTP",
    "desc": "pay by credit card via wirecard gateway"
  },
  Sg2c2p: {
    "name": "PAY_BY_2C2P",
    "desc": "pay by ipp or paynow"
  },

};

export const company = {
  SG: {
    "id": 'SG',
    "company_name": 'Thermomix Singapore | The Future of Cooking',
    "company_address": '67 Ubi Ave 1, #01-03 Starhub Green, Singapore 408942',
    'payee_name': 'The Future of Cooking Pte. Ltd.',
    'bank_name': 'UOB Bank',
    'bank_account_number': '349-312-068-7',
  },

  MY: {
    "id": 'MY',
    "company_name": 'Thermomix Malaysia | True Mix Sdn. Bhd. (842085-U)(AJL 931777)',
    "company_address": '11A & 15, Jalan PJU 3/46, Sunway Damansara Technology Park, 47810 Petaling Jaya, Selangor, Malaysia',
    'payee_name': 'True Mix Sdn Bhd',
    'bank_name': 'CIMB Bank',
    'bank_account_number': '8600070007',
  }
};

export const dialCode = {
  SG : "65",
  MY : "60",
}

export const entity = {
  SG : "SG",
  MY : "MY",
  VN : "VN",
}

export const GA_TRACKING_ID={
  test: "G-V25NG1S3L4",
  prod: "UA-191909854-1"
}

interface IPaymentMethod {
  name: string;
  desc: string;
}

interface IPaymentMethodList {
  [key: string]: IPaymentMethod;
}

interface IBank {
  bank_name: string;
  bank_code: string;
  full_desc: string;
}
