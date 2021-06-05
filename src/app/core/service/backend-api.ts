import { environment } from '../../../environments/environment';

// baseURL API product
const baseURL = environment.baseUrl;

// const baseURL= 'http://localhost:8888';

// Sign up
export const registerApi = `${baseURL}/auth/signup/`;
// Sign in
export const loginApi = `${baseURL}/auth/signin/`;
// Send Mail
export const verifyEmailApi = `${baseURL}/auth/verify-email/`;

export const checkExistApi = `${baseURL}/auth/check-exists`;
//OTP
export const otpApi = `${baseURL}/auth/send-otp?phone=:phoneNumber`;

export const verifyOtpApi = `${baseURL}/auth/verify-otp?uuid=:UUID&otp=:OTP`;

export const activePhoneApi = `${baseURL}/auth/active-phone`;

export const changeEditEmailApi = `${baseURL}/auth/verify-otp/check-edit-email`;

// export const activateEmailApi = `${baseURL}/auth/verify-email/:id`;
export const activateEmailApi = `${baseURL}/auth/active-acount`;

// Get Advisor 
export const getAdvisorApi = `${baseURL}/auth/signup`;
//Update Advisor
export const updateAdvisorApi = `${baseURL}/auth/become-an-advisor/:id`;

export const cartApi = `${baseURL}/cart/`;
// export const cartApi = `http://localhost:8888/cart/`;

// Add to cart
export const addCartApi = `${baseURL}/cart-item/`;
// Create cart
export const createCartApi = `${baseURL}/cart/create`;
// export const createCartApi = `http://localhost:8888/cart/create`;

export const checkCartHasInActiveProductApi =   `${baseURL}/cart/check-has-inactive-product`;

//Update Delivery Address 
export const updateDeliveryAddressApi = `${baseURL}/address/update`;

//Update Customer Information 
export const updateCustomerInformationApi = `${baseURL}/customer-information/:id`;


export const updateCustomerInformationÁnomynoudApi = `${baseURL}/customer-information/anomynous/:id`;

//Update Shipping Information
export const updateShippingApi = `${baseURL}/shipping/:id`;


// Order
// get all list order
export const ordersApi = `${baseURL}/orders/`;
// get all list order by advisor
export const ordersAdvisorApi = `${baseURL}/orders/advisor/all`;
// update reason unbox
export const updateReasonUnboxApi = `${baseURL}/orders/nounbox/:id`;
// update reason unbox
export const updateReasonHostApi = `${baseURL}/orders/nohost/:id`;
/** update stauts */
export const updateOrderStatus = `${baseURL}/orders/:id/status`;
// Category
export const cartegoryListApi = `${baseURL}/category/`;
// Category
export const cartegorySearchApi = `${baseURL}/category/search`;
// Remove product in cart
export const deleteCartItemApi = `${baseURL}/cart-item/:id`;
// Get Product-detail
export const productDetailApi = `${baseURL}/products/:id`;

export const productDetailUserApi = `${baseURL}/products/customer/:id`;

export const countOrderAdvisor = `${baseURL}/orders/count/all/advisor`;

export const countOrderCustomer = `${baseURL}/orders/count/customer`;

//Gte advisor

export const getAdvisorByCustomerApi =  `${baseURL}/auth/product-detail/id/checkAdvisorIdNumber`;

export const getAdvisorReferenceApi =  `${baseURL}/auth/product-detail/advisor`;

// List product
export const listProductApi = `${baseURL}/product-category/list-product/:id`;

// List Product not register
export const listProductApiNoRegister = `${baseURL}/product-category/list-product-noregister/:id`;
                                
// Get ListProduct
export const listProductsApi = `${baseURL}/products/id/:id/`;
// Update Quantity in CartItem
export const updateCartItemApi = `${baseURL}/cart-item/:id`;
// Update Quantity in CartItem
export const updateCartItemDescreaseApi = `${baseURL}/cart-item/descrease/:id`;
// Get and update questionnaire one
export const questionnaireOneApi = `${baseURL}/profile/questionnaire1`;
// Get and update questionnaire one register
export const questionnaireOneRegisterApi = `${baseURL}/profile/questionnaire1/register`;
// Get and update questionnaire two
export const questionnaireTwoApi = `${baseURL}/profile/questionnaire2`;
// Get and update questionnaire two
export const questionnaireTwoRegisterApi = `${baseURL}/profile/questionnaire2/register`;
// Get pre-signed URL 
export const profileGetPreSignedUrl = `${baseURL}/profile/get-presigned-url`;


// export const uploadImageApi = 'http://localhost:8888/profile/upload_profile_image'; // For back-end uploading

// Get and update profile
export const myProfileApi = `${baseURL}/profile`;
// Change password
export const changePasswordApi = `${baseURL}/profile/change-password`;
// Get questionnaire status
export const questionnaireStatusApi = `${baseURL}/profile/questionnaire-status`;

// Get Order by Id
export const getOrderByIdApi = `${baseURL}/orders/order/:id`;
// Create Order
export const createOrderApi = `${baseURL}/orders`;

// Create Payment
export const createPaymentApi = `${baseURL}/payment`;

// check paynow reference number must be unique
export const checkPaynowReferencePaymentApi = `${baseURL}/payment/check-payment-reference`;

// generate payment Signature

export const generatePaymentSignatureApi = `${baseURL}/payment/signature`;

// Get remaining
export const getRemainingPaymentApi = `${baseURL}/payment/remaining/:id`;
// Get pendingVerified
export const getPendingVerifiedPaymentApi = `${baseURL}/payment/pending/:id`;
// Get Verified
export const getVerifiedPaymentApi = `${baseURL}/payment/verified/:id`;
//Delete Cart
export const deleteCartApi = `${baseURL}/cart/delete/:id`;

// Forgot Password
export const forgotPasswordApi = `${baseURL}/auth/forgot-password`;
// Verify Reset Password Token
export const verifyForgotPasswordTokenApi = `${baseURL}/auth/verify-forgot-password-token`;
// Reset Password
export const resetPasswordApi = `${baseURL}/auth/reset-password`;

// resent mail active
export const resentEmailApi = `${baseURL}/auth/resent-email`

// decrypt Token
export const decryptToken = `${baseURL}/auth/token`;

//Activities
export const activitiesAdvisorApi = `${baseURL}/activity/advisor/count`;

export const activitiesAdvisorActiveApi = `${baseURL}/activity/active/activity`;

export const activitiesAdvisorCompletedApi = `${baseURL}/activity/complete/activity`;

export const activitiesAdvisorPendingApi = `${baseURL}/activity/advisor/pending-room`;

export const activityApi = `${baseURL}/activity/:id`;

export const activityCustomerCount = `${baseURL}/activity/customer/count`;
// Activity
// Get all Room
export const getAllRoomActivityApi = `${baseURL}/activity/officeroom/rooms`;
// Get Time Slot by room
export const getTimeSlotByRoomApi = `${baseURL}/activity/timeslot/:date/:id`;
// Create activity other location
export const createActivityOtherLocationApi = `${baseURL}/activityaddress`;
// Create activity 
export const createActivityApi = `${baseURL}/activity`;

export const createActivityOtherApi = `${baseURL}/activity/otherlocation`;

export const getActiviryByActivityId = `${baseURL}/activity-attendee/?activity_id=:id`;

export const saveActivityImageApi = `${baseURL}/activity/image`;

export const addAttendeeApi = `${baseURL}/activity-attendee/`;
// export const addAttendeeApi = `${baseURL}/activity-attendee/`;
export const addAttendeeContactApi = `${baseURL}/activity/privacy/invite/:activity_id/:email`;

//remove attendee 
export const removeAttendeeApi = `${baseURL}/activity-attendee/?email=:email&activity_id=:id`;
//update attendee 
export const updateAttendeeApi = `${baseURL}/activity-attendee/update`;
//
export const updateActivityApi = `${baseURL}/activity/update`;

export const updateOtherLocationApi = `${baseURL}/activityaddress`;

export const getActiveActivityofCustomer = `${baseURL}/activity/customer/activities/active`;

export const getCompletedActivityofCustomer = `${baseURL}/activity/customer/activities/completed`;

export const getReserveActivityofCustomer = `${baseURL}/activity/customer/activities/reserve`;

export const ReserveActivity = `${baseURL}/activity/customer/activities/reserve/:id`;

export const findClassApi = `${baseURL}/activity/get/ActivityFilter`;

export const updateIsAttended = `${baseURL}/activity-attendee/updateIsAttended?activity_id=:activity_id&customer_id=:customer_id`;

export const cancelActivityApi = `${baseURL}/activity/cancel/:id`;

//Branch Manager

export const getPendingRoomBookingsApi = `${baseURL}/activity/branch-manager/pending-room`;

export const getPastRoomBookingsApi = `${baseURL}/activity/branch-manager/past-room`;

export const getTimeTableRoomBookingsApi = `${baseURL}/activity/branch-manager/time-table?date=:timetabledate`;

export const rejectActivityApi = `${baseURL}/activity/branch-manager/reject?activity_id=:activityID`;

export const approveActivityApi = `${baseURL}/activity/branch-manager/approve?activity_id=:activityID`;

export const allOfficeRoomApi = `${baseURL}/activity/office-room-slot/all`;

//News 
export const newsListApi = `${baseURL}/news/customer`;
export const newsByUuidApi = `${baseURL}/news/customer/uuid/`;
export const newsNotification = `${baseURL}/news/notification`;

//Languages
export const changeLanguages = `${baseURL}/auth/change-language`;

//wirecard integration 
export const getWirecardPaymentRedirectUrlApi = `${baseURL}/payment/wirecard-payment-redirect-url`;

export const wireCardPaymentResponseApi = `${baseURL}/payment/wirecard-otp-response`;

export const wireCardIppResponseApi = `${baseURL}/payment/wirecard-ipp-response`;
export const WireCardIppRequestApi = `${baseURL}/payment/wirecard-ipp-request`;

//ipay88 response and backend url 
export const ipay88PaymentResponseUrlApi = `${baseURL}/payment/integration-response`;
export const ipay88PaymentBackendUrlApi = `${baseURL}/payment/integration-backend`;

//Warrantied
export const getAllWarrantiedApi = `${baseURL}/warrantied-products/customer`;

export const warrantiedDetailApi = `${baseURL}/warrantied-products/customer/id?id=:id`;

export const warrantiedHistoryApi = `${baseURL}/warrantied-history?warrantyId=:id&comment=:comment`;

//TT payment reference 
export const ttPaymentRefPhotoGetPreSignedUrl = `${baseURL}/payment/reference/image`;

//recurring payemnt create and subscription api
export const RecurringPaymentCreateApi = `${baseURL}/payment/recurring`;
export const RecurringPaymentSubscribeRequestApi = `${baseURL}/payment/recurring/subscribe-request/:id`;

//ipay88 reucrring subscription and payment response
export const ipay88RecurringSubscribeResponseApi = `${baseURL}/payment/recurring-subscription-response`;
export const ipay88RecurringPaymentResponseApi = `${baseURL}/payment/recurring-payment-response`;


//offline EPP
export const sendOffLineEPPEmailApi = `${baseURL}/payment/offline-epp/email`;

// Avisor Recruitment
export const searchCustomer = `${baseURL}/auth/search-customer`;
export const getCustomerByUuid = `${baseURL}/auth/search/id`;
export const searchCustomerByUuid = `${baseURL}/auth/question`;
export const getSubmissionHistory = `${baseURL}/recruitment`;
export const updateBankCustomer = `${baseURL}/auth/update/bank`;
export const createRecruitment = `${baseURL}/recruitment`;
export const checkRecruitmentApi = `${baseURL}/recruitment/customer/menu`;

//Team leader
export const getlistRecruitApi = `${baseURL}/auth/leader/recruitment`;

export const getDetailRecruitApi = `${baseURL}/recruitment/id?uuid=:UUID`;

export const recruitApproveOrRejectApi = `${baseURL}/recruitment/approval?uuid=:UUID`;

export const getNewAdvisorEarningProgramApi = `${baseURL}/recruitment/customer-naep/v3`;

export const newCreateCartByRefundProductApi = `${baseURL}/cart/create-cart-refund`;

export const newCreateCartByDiscountProductApi = `${baseURL}/cart/create-cart-by-discount-product`;

export const createCartGiftNaepApi = `${baseURL}/cart/create-cart-gift`;
//update order payment option 

export const updateOrderPaymentOptionApi = `${baseURL}/orders/payment-option`;

export const getSpecialProductApi = `${baseURL}/special-product/product`;

export const getSpecialProductV2Api = `${baseURL}/naep-package/customer-v2`;

export const getNaepPackagesV3Api = `${baseURL}/naep-package/v3/packages`;

export const getNaepPackageDetailV3Api = `${baseURL}/naep-package/v3/package`;

//get insatllment by order id

export const getInstallmentByOrderIdApi = `${baseURL}/payment/installment/:orderId`;

//get data footer payment
export const getOrderByUuid = `${baseURL}/orders/customer/uuid/`;


//payment promotion gifts 

export const getSinglePaymentGiftByProdcutApi = `${baseURL}/products/single-payment-gift/:productId`; 
export const getOnlineBankingGiftByProdcutApi = `${baseURL}/products/online-banking-gifts/:productId`; 

export const createOrderLineSinglePaymtGiftApi = `${baseURL}/order-line-item/order-line-single-paymt-gift`; 
export const createOrderLineBankTransferGiftApi = `${baseURL}/order-line-item/order-line-bank-transfer-gift`; 


export const updateNoUnboxNoHostReasonApi = `${baseURL}/orders/update/nounbox/:uuid`;

export const updateUnboxHostQRApi = `${baseURL}/orders/update/:uuid/status`;

export const checkMaximumProductApi = `${baseURL}/orders/product/cart`;

export const checkValidBeforeCreateActivityApi = `${baseURL}/activity/advisor/check`;

//report
export const getProductReportApi = `${baseURL}/products/report/all-products/advisor`;

export const getTeamLeaderOfBranchApi = `${baseURL}/customer-role/team-leader/advisor`;

export const getReportNAEPApi = `${baseURL}/recruitment/naep/report/advisor`;

export const getReportNAEPFirstSalesApi = `${baseURL}/recruitment/report/firstSales/advisor`;

export const getReportNAEPRecruitmentApi = `${baseURL}/recruitment/report/naep-recruitment/advisor`;

export const getBranchManager = `${baseURL}/customer-role/advisor/branch-manager`;

export const getDataReport = `${baseURL}/orders/advisor/reports`;

//New NAEP
export const CreateRecruitmentApi = `${baseURL}/recruitment/advisor-customer`;

export const getCustomerInformationNaepApi = `${baseURL}/auth/customer-information-naep`;

export const applyCustomerinformationNaepApi = `${baseURL}/auth/customer-apply-naep`;

export const checkBuyNaepOptionApi = `${baseURL}/approved-recruitment/check-buy-naep`;

export const getNAEPProductOptionsApi = `${baseURL}/special-product/get-product-options`;

export const createCartNaepApi =  `${baseURL}/cart/naep-create`;

export const checkIsBuyNaepApi = `${baseURL}/recruitment/check-is-buy-naep`;

export const deleteNaepApi = `${baseURL}/cart/delete-naep`;

export const inviteNewContactApi = `${baseURL}/recruitment/advisor-customer/new-contact`;

export const inviteNewContactViaWhatsappApi = `${baseURL}/recruitment/advisor-customer/new-contact-whatsapp`;

export const getListAdvisorApi = `${baseURL}/recruitment/list-advisor`;

export const createNewCartNaepApi =  `${baseURL}/cart/V4/new-naep-cart`;

export const getNaepPackageDetailApi =  `${baseURL}/naep-package/detail`;

export const checkValidPackageApi = `${baseURL}/naep-package/check-package-valid`;

export const checkCustomerValidToBuyPackageApi = `${baseURL}/recruitment/v3/check-customer-valid`;

//questionnaire
export const getDataQuestion1Api = `${baseURL}/profile/questionnaire1/answer-customer`;

export const getDataQuestion2Api = `${baseURL}/profile/questionnaire2/answer-customer`;

export const getDataQuestionnaireReportApi = `${baseURL}/profile/questionnaire/answer-customer-filter`

//My Customers
export const getListCustomersApi = `${baseURL}/auth/mycustomer`;

export const getDataCustomerApi = `${baseURL}/auth/mycustomer/detail`;

export const getDataQuestionCustomerApi = `${baseURL}/auth/mycustomer/detail/questionnaire`;

export const advisorGetNAEPCustomerDetailApi = `${baseURL}/recruitment/advisor/naep-infomation`;



// MPGS
export const getMpgsCheckoutSession = `${baseURL}/payment/mpgs-create-checkout-session`;
export const mpgsResponseApi = `${baseURL}/payment/mpgs-otp-response`;

export const shippingLocationAPI = `${baseURL}/shipping-location/customer`;

export const remarkAdvisorApi = `${baseURL}/cart/remask-advisor`;

export const decodeTokenApi = `${baseURL}/auth/decryptTokenNewCandidate`;

//questionnaire api
export const createNaepIntroductionFormApi = `${baseURL}/questionnaire-naep-approve`;

export const getNaepIntroductionFormApi = `${baseURL}/questionnaire-naep-approve`;
export const getNaepIntroduction2FormApi = `${baseURL}/auth/recruitment/candidate/form`;

export const checkValidPackage = `${baseURL}/naep-package/check-package-valid`

// my contact api
export const getDataMyContactsApi = `${baseURL}/auth/contact-list`;

export const getDataMyContactsNaepApi = `${baseURL}/auth/advisor/list-custommer-naep`;

export const getDataMyContactDetailApi = `${baseURL}/auth/contact-list/detail`;

export const checkEmailEdit = `${baseURL}/auth/check-edit-email`;

export const getNewContactInfo = `${baseURL}/auth/search/customer-buy-email`;

export const updateCartByAdvisor = `${baseURL}/cart/update-buy-for-customer`;

export const updateDeliveryAddress = `${baseURL}/address/update-advisor-buy-customer`;

export const customerRemoveContact = `${baseURL}/customer-remove-contact`;

export const activitiesAdvisorRejectedApi = `${baseURL}/activity/rejected/activity`;

export const createOrderRedemptionApi = `${baseURL}/orders/create`;

export const updateSpecialShippingApi = `${baseURL}/orders/update-shiping`;

//get holiday
export const getPublicHolidayApi = `${baseURL}/shipping/user/get-public-holiday`;

export const getQuickTimeSlotQXpressApi = `${baseURL}/shipping/time-slot-available-qxpress`;

export const getSpTimeAfterByDateApi = `${baseURL}/sp-time-after`;

export const createQXpressApi = `${baseURL}/shipping/user/create-qxpress`;

export const cancelQXpressApi = `${baseURL}/shipping/user/cancel-qxpress`;

export const checkInvalidPackageApi = `${baseURL}/recruitment/check-is-valid-package`;

//search product improve
export const getListProductV2Api = `${baseURL}/product-category/v2/list-product`;

export const getListProductNoRegisterV2Api = `${baseURL}/product-category/v2/list-product-noregister`;

//Share payment
export const shareLinkApi = `${baseURL}/orders/advisor/share-link-customer`;

export const CreateshareLinkApi = `${baseURL}/orders/create-session/advisor`;

export const createPaymentForShare = `${baseURL}/payment/advisor/share-link-payment`;

export const UpdateStatusShareLinkApi = `${baseURL}/orders/share/customer-update-status`;

export const UpdatePaymentOptionShareLinkApi = `${baseURL}/orders/advisor/share-update-option`;

export const CheckOrderPaymentApi = `${baseURL}/orders/check-payment/order-share`;

export const DownloadInvoiceApi = `${baseURL}/orders/invoice/:uuid`;

export const GetOrderAfterPaymentApi = `${baseURL}/orders/order-share/after-payment`;

export const GiftSharePaymentApi = `${baseURL}/products/advisor-share/gift-single`;

export const DataShareForCustomerTMMApi = `${baseURL}/orders/data-share/customer`;

export const NotLogInRecurringPayment = `${baseURL}/payment/not-login/payment-recurring`;

export const NotLogInGetVerifiedPayment = `${baseURL}/payment/verified-deposit/share-payment`;

export const NotLogInGetPendingVerifiedPayment = `${baseURL}/payment/pending-deposit/share`;

export const NotLogInGetInstallmentPayment = `${baseURL}/payment/payment-share/installment`;

export const RecurringPaymentSubscribeRequestForShareApi = `${baseURL}/payment/recurring/payment-share/subscribe-request`;

export const NotLogInDBS = `${baseURL}/payment/share-order/ipp-wirecard`;
//Assign Advisor
export const searchAssignAdvisor = `${baseURL}/auth/customer/assign/:id`;

//Banner
export const getBannerCustomerApi = `${baseURL}/banners/banner_customer`;

// delivery cost by weight
export const shippingCostByWeightApi = `${baseURL}/shipping-price-calculator/calculate-price`;

export const buyAsGuestApi = `${baseURL}/auth/create-anomynous-customer`;

export const checkAnomynousApi = `${baseURL}/auth/check-anomynous-customer`;

export const getInformationAnomynousApi = `${baseURL}/auth/get-data-anomynous-customer`;

export const updateInforForAnomynousCustomerApi = `${baseURL}/auth/update-anomynous`;

export const checkRouterNaepApi = `${baseURL}/recruitment/v4/check-is-customer-buy-package`;

export const checkNaepCustomerApi = `${baseURL}/auth/sign-in/check-naep-customer`;

export const HostGiftApi = `${baseURL}/host-gift-advisor`;

export const GetAllHostGiftApi = `${baseURL}/host-gift/advisor`;

//just host
export const JustHostCreateApi = `${baseURL}/just-host-event/create-customer`;

export const JustHostApi = `${baseURL}/just-host-event`;

export const GetAllJustHostApi = `${baseURL}/just-host-event/all`;

export const GetGiftJustHostApi = `${baseURL}/just-host/customer`;