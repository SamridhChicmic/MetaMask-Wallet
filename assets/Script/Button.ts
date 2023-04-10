import { _decorator, Component, Label, log, Node } from "cc";
import { ethers } from "ethers";
// import Web3 from "web3";
import web3 from "web3/dist/web3.min.js";
const { ccclass, property } = _decorator;

declare global {
  interface Window {
    ethereum: any;
  }
}
declare global {
  interface Window {
    phantom: any;
  }
}

// declare global {
//   interface Window {
//     ronin: {
//       provider: ethers.providers.ExternalProvider;
//       roninEvent: EventListener;
//     };
//   }
// }
//declare let window: any;
@ccclass("Button")
export class Button extends Component {
  @property({ type: Node })
  IdButton = null;
  @property({ type: Node })
  ConnectionButton = null;
  AccountAdress = null;
  start() {
    this.IdButton.parent.active = false;
  }
  onClickButton() {
    const accounts = window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((val: any) => {
        this.AccountAdress = val[0];
        this.IdButton.getComponent(Label).string = val[0];
        console.log("Account Address", val);
        // console.log({ account });
      });

    const GoerliTestChainId = "0x5";
    const chainId = window.ethereum.request({ method: "eth_chainId" });
    if (GoerliTestChainId == chainId) {
      console.log("You are in correct network");
    } else {
      console.log("PLZ Switch to test network");
    }

    this.switchNetwork();
    this.IdButton.parent.active = true;
    this.ConnectionButton.active = false;
  }

  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
      console.log("You have succefully switched to Goerli Test network");
    } catch (error) {
      console.log("This network is not");
    }
  }
  onClickSendButton() {
    console.log("SEND AMOUNT");
    // VALUE IN GEWI HEXA DECIMAL
    let Transaction = {
      to: "0x76CAA6eF0c0Cc1f5bb5afA54455fd2A00F6a27f6",
      from: this.AccountAdress,
      value: "38D7EA4C68000",
    };
    const txHash = window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [Transaction],
      })
      .then((Resolve) => {
        // transaction id
        console.log("Resolve---->", Resolve);
        this.checkTransaction(Resolve);

      }).catch((Reject) => {
        console.log("REJECT----->", Reject.message);
      });
  }
  checkTransaction(Resolve){
    let loop=()=>{
    return window.ethereum.request({method:"eth_getTransactionReceipt",params:[Resolve]}).then((res)=>{
      if(res!=null)
      {console.log("CHECKED TRANSACTION",res)
        return "Confirmed";}
      else
      {return loop();} 
    });
    };
    return loop();
  }
  update(deltaTime: number) {}
}
{
  // this.web3Instance.eth.getAccounts(function (err, accounts) {
  //   console.log("Get acconts ", accounts);
  // });
  // if (typeof window.ethereum !== "undefined" && window.ethereum.isRopsten) {
  //   // Request connection to Ronin
  //   window.ethereum
  //     .request({
  //       method: "eth_requestAccounts",
  //       params: [{ chainId: "0x7E4" }],
  //     })
  //     .then(() => {
  //       // Connection successful, get the user's account address
  //       return web3.eth.getAccounts();
  //     })
  //     .then((accounts) => {
  //       const userAddress = accounts[0];
  //       console.log(`Connected to Ronin with address: ${userAddress}`);
  //       // You can now interact with the user's Ronin wallet using the Web3 API
  //     })
  //     .catch((error) => {
  //       // Connection failed, handle the error
  //       console.error(error);
  //     });
  // }
  // else {
  //   // Ronin is not installed or not enabled, prompt the user to install or enable it
  //   window.open("https://www.roninwallet.com/");
  // }
  // const accounts = window.ethereum
  //   .request({
  //     method: "eth_requestAccounts",
  //   })
  //   .then((val: any) => {
  //     const account = val[0];
  //     console.log(val);
  //     console.log({ account });
  //   });
  // console.log("Wndow ronning", accounts);
  // // Check if Ronin Wallet is installed
  // if (window.ronin === undefined) {
  //   throw new Error("Ronin Wallet is not installed");
  // }
  // const web3 = new Web3(window.ethereum);
  // const provider = web3.currentProvider;
  // // const provider = window.ronin.providers?.Web3Provider(
  // //   window.ronin.provider
  // // );
  // console.log("provider ", provider);
  // Check if current Ronin Wallet is unlocked
  // const firstAddress = provider.getSigner().getAddress();
  // console.log("provider ", firstAddress);
  // if (firstAddress === undefined) {
  //   throw new Error("Ronin Wallet is not unlocked");
  // }
  // console.log("Address  ", firstAddress);
  // return { address: firstAddress, provider };
  // window.ronin.provider
  //   .request({
  //     method: "eth_requestAccounts",
  //   })
  //   .then((val: any) => {
  //     const account = val[0];
  //     console.log(val);
  //     console.log({ account });
  //   });
  // try {
  //   window.ethereum.request({
  //     method: "wallet_switchEthereumChain",
  //     params: "[{ chainId: 0x5}]",
  //   });
  // console.log("You have succefully switched to Binance Test network")
  // } catch (switchError) {
  //   // This error code indicates that the chain has not been added to MetaMask.
  //   if (switchError.code === 4902) {
  //    console.log("This network is not available in your metamask, please add it")
  //   }
  //   console.log("Failed to switch to the network")
  // }
  //For Phantom Wallet
  // const provider = window.phantom.solana; // see "Detecting the Provider"
  // console.log("Provider ", provider);
  // try {
  //   const resp = provider.request({ method: "connect" });
  //   console.log("connect", resp);
  // } catch (err) {
  //   console.log("eeerrr", err);
  // }
  //0x5ac9da6812e30005ab63a18ec8041c5f009f7b0d32c1edd5dd5d88fbcb9b1962
}
