import { _decorator, Component, JsonAsset, Label, Node } from "cc";
import { MetaMaskManager } from "./Manager/MetaMaskManager";
const { ccclass, property } = _decorator;
declare global {
  interface Window {
    ethereum: any;
  }
}
@ccclass("login")
export class login extends Component {
  UserAccountAdress;
  @property({ type: Node })
  ConnectMetaMask = null;
  @property({ type: Node })
  Addressshow = null;
  @property({ type: JsonAsset })
  contract_abi: any;
  start() {
    this.Addressshow.parent.active = false;
  }
  connectToMetaMask() {
    console.log("Button Clicked");
    const accounts = window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((val: any) => {
        this.UserAccountAdress = val[0];
        this.Addressshow.getComponent(Label).string = val[0];
        this.Addressshow.parent.active = true;
        this.ConnectMetaMask.active = false;
        console.log("Account Address", val);
        this.initWeb3();
        MetaMaskManager.getInstance().checkWalletStatus();

        setTimeout(() => {
          MetaMaskManager.getInstance().mintRoom();
        }, 1000);
      });
  }
  initWeb3() {
    MetaMaskManager.getInstance().initiateWeb3(
      this.contract_abi.json.output.abi,
      this.UserAccountAdress
    );
  }
  update(deltaTime: number) {}
}
