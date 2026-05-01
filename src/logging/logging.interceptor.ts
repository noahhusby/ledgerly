import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();

    const req = http.getRequest<Request>();

    const start = Date.now();

    console.log('--- REQUEST ---');

    console.log(`${req.method} ${req.url}`);

    console.log('Body:', this.sanitizeBody(req.body));

    return next.handle().pipe(
      tap((response: unknown) => {
        const res = http.getResponse<Response>();

        const duration = Date.now() - start;

        console.log('--- RESPONSE ---');

        console.log(`${req.method} ${req.url} ${res.status} - ${duration}ms`);
        console.log('Body:', response);
      }),

      catchError((error: unknown) => {
        const res = http.getResponse<Response>();
        const duration = Date.now() - start;
        console.log('--- ERROR RESPONSE ---');
        console.log(`${req.method} ${req.url} ${res.status} - ${duration}ms`);
        console.log('Error:', error);
        return throwError(() => error);
      }),
    );
  }

  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const safeBody = { ...(body as Record<string, unknown>) };

    delete safeBody.password;

    delete safeBody.passwordHash;

    delete safeBody.token;

    delete safeBody.accessToken;

    delete safeBody.refreshToken;

    return safeBody;
  }
}
