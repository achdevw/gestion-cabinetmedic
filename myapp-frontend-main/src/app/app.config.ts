import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig = {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};
