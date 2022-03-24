const ethWallet = require('ethereumjs-wallet').default

/* for(let index=0; index < 1000; index++) {
    let addressData = ethWallet.generate();
    console.log(`Private key = , ${addressData.getPrivateKeyString()}`);
    console.log(`Address = , ${addressData.getAddressString()}`);
} */

const addressData = ethWallet.fromPrivateKey(Buffer.from('cd2ea49572cc13e309ea7991282c132b5e4e193892cd2b763ad26dc3834a9307','hex'));
console.log(`Private key = , ${addressData.getPrivateKeyString()}`);
console.log(`Address = , ${addressData.getAddressString()}`);