import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';

import { ProgressContainerComponent } from 'src/app/progress-container/progress-container.component';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(private overlay: Overlay) { }

  private progessTopRef: OverlayRef = this.cdkProgressCreate();

  private cdkProgressCreate() {
   return this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
  }
  
  showProgess() {
    console.log('showProgess()');
    this.progessTopRef.attach(new ComponentPortal(ProgressContainerComponent));
  }
  
  hideProgess() {
    console.log('hideProgess()');
    this.progessTopRef.detach();
  }
}
