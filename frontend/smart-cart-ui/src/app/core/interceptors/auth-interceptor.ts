import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { BehaviorSubject, catchError, filter, switchMap } from 'rxjs';


let isRefreshing = false;   
const refreshTokenSubject = new BehaviorSubject<string | null>(null);
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  //next(req) #observable 1. original api request ko actually backend bhejta hai
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('token-refresh')) {
        if (isRefreshing) {
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            switchMap((token) => {
              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`,
                },
              });

              return next(newRequest);
            }),
          );
        }
        console.log('401 from URL:', req.url);
        console.log('401 Unauthorized');
        // resets therefreshTokenSubject value to null $ new refresh cycle start karna aur waiting requests ko batana ki abhi new access token available nahi hai.
        refreshTokenSubject.next(null);
        isRefreshing = true;
        //auth.refreshToken() Observable #2 The refresh API request.
        return auth.refreshToken().pipe(
          
          switchMap((response) => {
            auth.saveToken(response.token);
            auth.saveRefreshToken(response.refreshToken);
            // New access token ko waiting requests ke saath share karna (refreshTokenSubject) = behaviour subject mechanism provided  
            refreshTokenSubject.next(response.token);
            // it indicate refresh operation has been completed 
            isRefreshing = false;

            const newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`,
              },
            });
            console.log('Refresh Response:', response);
            
            //next(newRequest) Observable #3 retry the original API request
            return next(newRequest);
          }),
          catchError((error) => {
            isRefreshing = false;
            throw error;
          }),
        );
      }
      throw error;
    }),
  );
};
