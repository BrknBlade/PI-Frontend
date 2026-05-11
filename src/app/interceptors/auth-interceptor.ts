import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if(['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const xsrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN'))
      ?.split('=')[1];

    const newReq = req.clone({
      setHeaders : {
        'X-XSRF-TOKEN' : decodeURIComponent(`${xsrfToken}`)
      },
      withCredentials : true
    });

    return next(newReq);
  }

  return next(req.clone({
    withCredentials : true
  }))
};
