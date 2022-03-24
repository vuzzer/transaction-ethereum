const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;
const axios = require('axios');
const ethNetwork = 'https://rinkeby.infura.io/v3/PRJECT ID';
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork))

async function transferFund(sendersData, receiverData, amountToSend){
    return new Promise(async (resolve, reject)=>{
        var nonce = await web3.eth.getTransactionCount(sendersData.address);
        web3.eth.getBalance(sendersData.address, async (err, result)=>{
            if(err){
                return reject();
            }
            let balance = web3.utils.fromWei(result, "ether");
            console.log(balance + " ETH");
            if(balance < amountToSend){
                console.log('insufficient funds');
                return reject();
            }

            let gasPrices = await getCurrentGasPrices();
             let details = {
                "to": receiverData.address,
                "value": web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), "ether" )),
                "gas":21000,
                "gasPrice": gasPrices.low * 10**9,
                "nonce": nonce,
                "chainId":4 //EIP 155 chainId - rinkeby: 4
            };

            const transaction = new EthereumTx(details, {chain: "rinkeby"});
            let privateKey = sendersData.privateKey;
            let privKey = Buffer.from(privateKey, 'hex');
            transaction.sign(privKey);

            const serializedTransaction = transaction.serialize();

            web3.eth.sendSignedTransaction ('0x' + serializedTransaction.toString('hex'), (err, id)=>{
                if(err){
                    console.log(err);
                    return reject();
                }
                const url = `https://rinkeby.etherscan.io/tx/${id}`;
                console.log(url);
                resolve({id:id, link:url});
            });
        });
    })
}

async function getCurrentGasPrices(){
    let response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json?');
    let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high : response.data.fast /10
    }
    return prices;
}

/* async function getBalance(address){
    return new Promise((resolve, reject)=>{
        web3.eth.getBalance(address, async (err, result)=>{
            if(err){
                return reject(err);
            }
            resolve(web3.utils.fromWei(result, "ether"));
        })
    });
} */


transferFund({address:"sender_address_account",privateKey:"receiver_address_account"}, {address:"private_key"},amountToSend);

