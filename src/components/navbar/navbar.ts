import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Network} from "@ionic-native/network";
import {IonButtonEnd, ServiceProvider} from "../../providers/metier.service";
import {ReducerService} from "../../providers/reducer.service";


@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {
  
  private _title = 'NextBirth';
  
  @Input()
  set title(value: string) {
    this._title = value === null ? 'NextBirth' : value;
  }
  
  @Input() showMenuToggle = true;
  
  @Input() ionButtons: Array<IonButtonEnd> = [];
  @Output() getClickedButton = new EventEmitter();

  private msg_network = '';
  private showNetworkStatus = false
  private colorNetworkStatus = 'red'

  constructor(public network: Network, public service: ServiceProvider,
              public reducerService: ReducerService) {
  }
  
  ngOnInit() {
    this.checkNetwork()
  }

  checkNetwork() {
    this.network.onDisconnect().subscribe(next => {
      console.log(next)
      this.initNetworkStatus(false);
    });

    this.network.onConnect().subscribe(next => {
      console.log(next)
      this.initNetworkStatus(true);
      setTimeout(() => {
        this.showNetworkStatus = false
      }, 2000)
    });
  }

  initNetworkStatus(status: boolean) {
    this.msg_network = status ? 'Connection internet' : 'Pas de connection internet';
    this.colorNetworkStatus = status ? 'green' : 'red';
    this.showNetworkStatus = status;
    this.service.statusNetwork = status;
    this.reducerService.isNetwork(status);
  }
  
  goTo(item) {
    this.getClickedButton.emit(item);
  }
}
