import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private idSubject = new BehaviorSubject<number|null>(null);
  id$ = this.idSubject.asObservable();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.trackRouteParams();
    // Set Id as NavigationEnd doesnt trigger on reload
    this.setInitialId();
  }

  // Testing purpose - checking NavigationEnd - reload fails
  logNavigationEnd() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log(event);
      })
  }

  setInitialId() {
    const id = this.getDeepestActivatedRoute().snapshot?.paramMap.get('id');
    this.idSubject.next(id ? +id : null);
  }

  trackRouteParams() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getDeepestActivatedRoute().snapshot.paramMap.get('id'))
      )
      .subscribe((id) => {
        this.idSubject.next(id ? +id : null);
      })
  }

  getDeepestActivatedRoute(): ActivatedRoute {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild
    }
    return route;
  }

  getCurrentId(): number|null {
    return this.idSubject.getValue();
  }

}
