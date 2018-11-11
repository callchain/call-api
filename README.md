# Callchain api ONLY for application internal deployment

## Runing

1. npm install
2. npm run build
3. node dist/main.js

## Interfaces

- New Wallet

    /api/wallet/new, GET
    
- Account Balance

    /api/accounts/:address/balances, GET

- Payment
    
    /api/accounts/:address/payments, POST

- Transaction List

    /api/accounts/:address/transactions, GET

- Transaction Detail

    /api/transaction/:hash, GET

