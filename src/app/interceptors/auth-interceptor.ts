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
// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth/auth-service';
//
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('auth_token');
//
//   if (token) {
//     const authReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       },
//       withCredentials: true
//     });
//     return next(authReq);
//   }
//
//   return next(req.clone({ withCredentials: true }));
// };
