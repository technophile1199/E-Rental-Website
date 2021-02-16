import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { error } from 'protractor';

@Injectable()
export class MessageService {
  private messages: string[] = [];
  private toastrConfig: {} = {
    disableTimeOut: false,
    closeButton: false,
    positionClass: 'toast-bottom-right'
  };

  constructor(private toastr: ToastrService) {}

  public add(message: string): void {
    this.messages.push(message);
    this.toastr.success(message, 'Message:', this.toastrConfig);
  }

  public addError(message: string): void {
    console.log("ErrorMessage");
    //console.log(error);
    //console.log(message);
    //console.log(this.toastrConfig);
    this.toastr.error(message, 'Message:', this.toastrConfig);
  }

  public clear(): void {
    this.messages = [];
  }
}
