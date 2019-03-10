import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";


@Injectable()
export class ReducerService {
  constructor() {}
  
  /**
   * Observe Network Status
   */
  private isNetwordBehavior = new BehaviorSubject<boolean>(true);
  public isNetworkObserver  = this.isNetwordBehavior.asObservable();
  isNetwork(value: boolean) {
    this.isNetwordBehavior.next(value);
  }
}
