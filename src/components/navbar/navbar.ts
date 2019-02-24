import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Network} from "@ionic-native/network";
import {IonButtonEnd, ServiceProvider} from "../../providers/metier.service";


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
  }
  
  ngOnInit() {
    console.log(this.network)
    this.checkNetwork()
  }

  checkNetwork() {
    this.network.onDisconnect().subscribe(next => {
      console.log(next)
      console.log(this.network)
      this.initNetworkStatus(false);
    });

    this.network.onConnect().subscribe(next => {
      console.log(next)
      console.log(this.network)
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
