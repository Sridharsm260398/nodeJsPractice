import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse
  } from "@angular/common/http";
  import { catchError } from "rxjs/operators";
  import { throwError } from "rxjs";
  import { Injectable } from "@angular/core";
  import { MatDialog } from "@angular/material/dialog";
  
  import { ErrorComponent } from "../../module/error/error.component"
  import { ErrorService } from "../../shared/error.service";
  
  @Injectable()
  export class ErrorInterceptor implements HttpInterceptor {
  
    constructor(private dialog: MatDialog, private errorService: ErrorService) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = "An unknown error occurred!";
          var message: any = [error.error.error, error.error.message];
          if (message) {
            errorMessage = message;
          }
          this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
          // this.errorService.throwError(errorMessage);
          return throwError(error);
        })
      );
    }
  }