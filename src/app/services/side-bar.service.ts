import { Injectable, Injector } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentType, GlobalPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

import { SideBarRef } from '../utils/side-bar-ref';
import { SidebarConfig } from '../models/sidebar-config';
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { USER_DATA } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  public openedSidebars: SideBarRef<any>[] = [];

  constructor(private _overlay: Overlay, private _injector: Injector) { }

  open<T>(component: ComponentType<T>, config?: SidebarConfig): SideBarRef<T> {
    config = this.applyDefaultConfig(config, new SidebarConfig());
    const overlayRef = this.createOverlay(config);
    const sidebarComponent = this.attachSidebar(overlayRef, config);
    return this.attachSidebarComponent<T>(
      component,
      sidebarComponent,
      overlayRef
    );
  }

  close(componentInstance: any): void {
    if (this.openedSidebars && this.openedSidebars.length) {
      const sidebarRef = this.openedSidebars.find(sidebar => sidebar.componentInstance === componentInstance);
      if (sidebarRef) {
        sidebarRef.close();
        this.openedSidebars = this.openedSidebars.filter(
          sidebar => sidebar.componentInstance !== componentInstance
        );
      }
    }
  }

  private applyDefaultConfig(config?: SidebarConfig, defaultOptions?: SidebarConfig): SidebarConfig {
    return { ...defaultOptions, ...config };
  }

  createOverlay(config: OverlayConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  getOverlayConfig(config: SidebarConfig): OverlayConfig {
    const overlayConfig = new OverlayConfig({
      positionStrategy: new GlobalPositionStrategy().right('0px'),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      panelClass: config.panelClass,
      hasBackdrop: config.hasBackdrop
    });
    if (config.backdropClass) {
      overlayConfig.backdropClass = config.backdropClass;
    }
    return overlayConfig;
  }

  attachSidebar(overlayRef: OverlayRef, config: SidebarConfig): SideBarComponent {
    const injector = Injector.create({
      parent: this._injector,
      providers: [
        { provide: USER_DATA, useValue: config.data.user }
      ]
    });
    const portal = new ComponentPortal(SideBarComponent, null, injector);
    const sidebarComponentRef = overlayRef.attach<SideBarComponent>(portal);
    return sidebarComponentRef.instance;
  }

  attachSidebarComponent<T>(component: ComponentType<T>, sidebar: SideBarComponent, overlayRef: OverlayRef): SideBarRef<T> {
    const sidebarRef = new SideBarRef<T>(overlayRef, sidebar);
    const portal = new ComponentPortal<T>(component as ComponentType<T>);
    const componentRef = sidebar.attachComponentPortal(portal);
    sidebarRef.componentInstance = componentRef.instance;
    this.openedSidebars = [...this.openedSidebars, sidebarRef];
    return sidebarRef;
  }
}
