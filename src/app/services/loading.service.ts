import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}

  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

  getLoadingState(): boolean {
    return this.loadingSubject.value;
  }
}
