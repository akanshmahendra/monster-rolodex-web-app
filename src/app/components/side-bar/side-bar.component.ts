import { Component, ComponentRef, OnDestroy, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  animations: [
    trigger('sidebar', [
      state('void, exit', style({ opacity: 0, transform: 'translateX(30%)' })),
      state('enter', style({ opacity: 1, transform: 'none' })),
      transition('* => enter', animate('250ms cubic-bezier(0, 0, 0.2, 1)')),
      transition(
        '* => void, * => exit',
        animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ],
  host: {
    '[@sidebar]': 'sidebarState',
    '(@sidebar.start)': 'onAnimationStart($event)',
    '(@sidebar.done)': 'onAnimationDone($event)'
  }
})
export class SideBarComponent implements OnDestroy {

  sidebarState: 'void' | 'enter' | 'exit' = 'enter';
  animationStateChanged = new Subject<any>();
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  constructor() { }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this._portalOutlet.attachComponentPortal(portal);
  }

  onAnimationDone({ toState, totalTime }: AnimationEvent) {
    if (toState === 'enter') {
      this.animationStateChanged.next({ state: 'opened', totalTime });
    } else if (toState === 'exit') {
      this.animationStateChanged.next({ state: 'closed', totalTime });
    }
  }

  onAnimationStart({ toState, totalTime }: AnimationEvent) {
    if (toState === 'enter') {
      this.animationStateChanged.next({ state: 'opening', totalTime });
    } else if (toState === 'exit' || toState === 'void') {
      this.animationStateChanged.next({ state: 'closing', totalTime });
    }
  }

  startExitAnimation(): void {
    this.sidebarState = 'exit';
  }

  ngOnDestroy(): void {
    this.animationStateChanged.complete();
  }

}
