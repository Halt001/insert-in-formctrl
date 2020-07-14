import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { FormControl, AbstractControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';


import { Directive, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

export interface FormControlInfo {
  controlName: string|number;
  control: AbstractControl;
  formElementRef: ElementRef<HTMLFormElement>;
}


@Injectable({ providedIn: 'root' })
export class FormCtrlService {
  private controlInfo = new Map<string|number, FormControlInfo>();

  registerCtrl(controlName: string|number, control: AbstractControl, formElementRef: ElementRef<HTMLFormElement>): void {
    this.controlInfo.set(controlName, {
      controlName,
      control,
      formElementRef,
     });

    console.log('registerCtrl', controlName);
  }

  unregisterCtrl(controlName: string|number): void {
    this.controlInfo.delete(controlName);

    console.log('unregisterCtrl', controlName);
  }

  getElementRefFromControlName(controlName: string|number): ElementRef<HTMLFormElement> {
    const info = this.controlInfo.get(controlName);

    return info && info.formElementRef;
  }
}


@Directive({
   // tslint:disable-next-line: directive-selector
   selector: '[formControlName]'
})
export class ControlErrorsDirective implements OnDestroy {
  constructor(
    private formCtrlService: FormCtrlService,
    private controlDirective: NgControl,
    private formElementRef: ElementRef<HTMLFormElement>,
  ) {
    this.formCtrlService.registerCtrl(this.controlDirective.name, this.controlDirective.control, this.formElementRef);
  }

  ngOnDestroy(): void {
    this.formCtrlService.unregisterCtrl(this.controlDirective.name);
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showForm = true;

  myForm = new FormGroup({
    '123abc': new FormControl('InitialValue 1'),
    '456xyz': new FormControl('InitialValue 2'),
  });

  constructor(private formCtrlService: FormCtrlService) { }

  ngOnInit(): void {
    //
  }

  clickedInsert(controlName: string|number, valueToInsert: string): void {
    const elementRef = this.formCtrlService.getElementRefFromControlName(controlName);
    const nativeElement = elementRef && elementRef.nativeElement;

    nativeElement.setRangeText(valueToInsert);
  }

}
