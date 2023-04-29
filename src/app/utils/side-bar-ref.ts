import { OverlayRef } from '@angular/cdk/overlay';
import { filter, take } from "rxjs";
import { SideBarComponent } from '../components/side-bar/side-bar.component';

export class SideBarRef<T> {

  componentInstance: T;
  private closeFallbackTimeout: number;

  constructor(private overlayRef: OverlayRef, public sideBarComponent: SideBarComponent) {
    overlayRef.backdropClick().subscribe(ev => this.close());
    sideBarComponent.animationStateChanged.pipe(filter((event: any) => event.state === 'closed'), take(1))
      .subscribe(() => {
        clearTimeout(this.closeFallbackTimeout);
        this.finishSidebarClose();
      });

    overlayRef.detachments().subscribe(() => {
      this.componentInstance = null!;
      this.overlayRef.dispose();
    });
  }

  close(): void {
    this.sideBarComponent.animationStateChanged.pipe(filter((event: any) => event.state === 'closing'), take(1))
      .subscribe(event => {
        this.overlayRef.detachBackdrop();
        this.closeFallbackTimeout = window.setTimeout(() => this.finishSidebarClose(), event.totalTime + 100);
      });
    this.sideBarComponent.startExitAnimation();
  }

  private finishSidebarClose() {
    this.overlayRef.dispose();
  }
}
