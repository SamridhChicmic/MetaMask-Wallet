import { _decorator, Component, Node } from "cc";
import web3 from "web3/dist/web3.min.js";
const { ccclass, property } = _decorator;

@ccclass("MetaMaskManager")
export class MetaMaskManager extends Component {
  private static _instance: MetaMaskManager;
  private web3Instance: web3 = null;
  private contract: any = null;
  private userAddress: any = null;

  static getInstance(): MetaMaskManager {
    if (!MetaMaskManager._instance) {
      MetaMaskManager._instance = new MetaMaskManager();
    }
    return MetaMaskManager._instance;
  }
  initiateWeb3(abi: any, metaMaskId: any) {
    this.web3Instance = new web3(web3.givenProvider || "ws://localhost:7475");
    //http://localhost:7457/
    this.userAddress = metaMaskId;

    this.contract = new this.web3Instance.eth.Contract(
      JSON.parse(JSON.stringify(abi)),
      "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D"
    );
    console.log("WebInstance---------->", this.web3Instance);
    console.log("CONTRACT---------->", this.contract);
  }
  checkWalletStatus() {
    this.web3Instance.eth.getAccounts(function (err, accounts) {
      console.log("ERROR---->", err);
      console.log("ACCOUNT____", accounts);
    });
  }

  mintRoom() {
    var amount = 0.00014;
    var tokens = web3.utils.toWei(amount.toString(), "ether");

    return new Promise((resolve, reject) => {
      this.contract.methods
        .mint("0x76CAA6eF0c0Cc1f5bb5afA54455fd2A00F6a27f6", tokens)
        .send({
          from: this.userAddress
        })
        .then((val: any) => {
          console.log("mint-->", val);
          resolve(val);
        })
        .catch((err: any) => {
          console.log("mint---->", err);
          //reject(err);
        });
    });
  }

  balance() {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .balanceOf(this.userAddress)
        .call()
        .then((val: any) => {
          console.log("val", val);
          resolve(val);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}
