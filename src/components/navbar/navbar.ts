import {Component, Input} from '@angular/core';
import {Network} from "@ionic-native/network";


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

  constructor(public network: Network) {

    console.log(this.network.type);
    this.checkNetwork();
  }

  checkNetwork() {
    this.network.onDisconnect().subscribe(next => {
      this.msg_network = 'Network was disconnected'
      this.colorNetworkStatus = 'red'
      this.showNetworkStatus = true
    });

    this.network.onConnect().subscribe(next => {
      this.msg_network = 'Network connected'
      this.colorNetworkStatus = 'green'
      this.showNetworkStatus = true
      setTimeout(() => {
        this.showNetworkStatus = false
      }, 2000)
    });
  }
}
