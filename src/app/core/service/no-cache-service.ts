import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor, HttpHandler } from '@angular/common/http' 


@Injectable()
export class NoCacheHeadersInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authReq = req.clone({
            setHeaders: {
                'Cache-Control': 'no-cache',
                 Pragma: 'no-cache'
            }
        });
        return next.handle(authReq);    
    }
}
