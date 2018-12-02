import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Network} from "@ionic-native/network";
import {IonButtonEnd, ServiceProvider} from "../../providers/service";


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

  private msg_network = 'msg network'
  private showNetworkStatus = false
  private colorNetworkStatus = 'red'

  constructor(public network: Network, public service: ServiceProvider) {
    console.log(this.network.type)
    this.checkNetwork()
  }

  checkNetwork() {
    this.network.onDisconnect().subscribe(next => {
      this.initNetworkStatus(false);
    });

    this.network.onConnect().subscribe(next => {
      this.initNetworkStatus(true);
      setTimeout(() => {
        this.showNetworkStatus = false
      }, 2000)
    });
  }

  initNetworkStatus(status) {
    this.msg_network = status ? 'Network connected' : 'Network was disconnected'
    this.colorNetworkStatus = status ? 'green' : 'red'
    this.showNetworkStatus = status
    this.service.statusNetwork = status;
  }
  
  goTo(item) {
    this.getClickedButton.emit(item);
  }
}
