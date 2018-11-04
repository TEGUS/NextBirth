import {Component, Input} from '@angular/core';
import {Network} from "@ionic-native/network";
import {ServiceProvider} from "../../providers/service";


@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {
  @Input() title = 'NextBirth'
  @Input() showMenuToggle = true

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
}
