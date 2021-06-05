import { NgModule } from '@angular/core';

import { LoginModule} from './authentication/login/login.module';
import { ForgotPasswordModule} from './authentication/forgot-password/forgot-password.module';
import { RegisterModule} from './authentication/register/register.module';
import { VerifyCodeModule} from './authentication/verify-code/verifyCode.module';
import { DialCodeModule } from './authentication/dial-code/dial-code.module'
import { DropdownModule } from 'primeng/dropdown';
import { VerifyEmailModule } from './authentication/verify-email/verify-email.module';
import { NewsModule } from './news/news.module';
import { NewsDetailModule } from './news-detail/news-detail.module';
import { ContactUsModule } from './contact-us/contact-us.module';
import { RefundPolicyModule } from './refund-policy/refund-policy.module';
import { ShippingPolicyModule } from './shipping-policy/shipping-policy.module';
import { TermAndConditionModule } from './term-and-condition/term-and-condition.module';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';
import { ResentEmailModule } from './authentication/resent-email/resent-email.module';
import { EventTermAndConditionModule} from './event-term-and-condition/event-term-and-condition.module';
import { PurchaseTermAndConditionModule } from './purchase-term-and-condition/purchase-term-and-condition.module';
import { NaepTermsConditionsSgModule } from './naep-terms-conditions-sg/naep-terms-conditions-sg.module';
import { NaepTermsConditionsMyModule } from './naep-terms-conditions-my/naep-terms-conditions-my.module';

@NgModule({
    imports: [
        LoginModule,
        ForgotPasswordModule,
        RegisterModule,
        VerifyCodeModule,
        DialCodeModule,
        DropdownModule,
        VerifyEmailModule,
        NewsModule,
        NewsDetailModule,
        ContactUsModule,
        RefundPolicyModule,
        ShippingPolicyModule,
        TermAndConditionModule,
        PrivacyPolicyModule,
        ResentEmailModule,
        EventTermAndConditionModule,
        PurchaseTermAndConditionModule,
        NaepTermsConditionsMyModule,
        NaepTermsConditionsSgModule
    ],
    exports:[],
    declarations: []
})
export class PagesModule
{

}
