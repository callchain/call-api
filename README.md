# Callchain api ONLY for application internal deployment

## Runing

1. npm install
2. npm run build
3. node dist/main.js or `pm2 start dist/main.js` in production

## Interfaces

- New Wallet

    Create new callchain wallet, return address and secret. Application should keep save of the secret for user or for application self.

    ```js
    /api/wallet/new, GET
    ```

    ### Example
    
    http://localhost/api/wallet/new
    
    ```json
    {
        "success": true,
        "data": {
            "secret": "sp6TyPRD372FLHaaK1fnwDGMWiNWQ",
            "address": "cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB"
        }
    }
    ```

    #### Return Data
    
    Name | Type | Description
    ---- | ---- | -----------
    secret | string | CALL wallet secret
    address | string | CALL wallet address

- Account Balance

    Get balance of callchain account, return data is array of balance. Each item contains value, currency and counterparty. When currency is call, counterparty is empty. Counterparty is the currency issuer.
    ```js
    /api/accounts/:address/balances, GET
    ```

    ### Example
    
    http://localhost/api/accounts/cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB/balances
    
    ```json
    {
        "success": true,
        "data": [
            {
                "currency": "CALL",
                "value": "100"
            }
        ]
    }
    ```

    ### Return Data
    
    Name | Type | Description
    ---- | ---- | -----------
    currency | string | currency name
    value | string | currency balance value
    counterparty | string | currency issuer

- Payment

    Pay to destination of Callchain assets. When do payment, secret is required. So the api is only for internal deployment, and is not for decentrialized application.

    ```js
    /api/accounts/:address/payments, POST
    ```

    ### Example
    
    http://localhost/api/accounts/cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB/payments
    
    #### Request parameters
    Name | Type | Description
    ---- | ---- | -----------
    source | string | payer wallet address 
    secret | string | payer wallet private key
    value | string | amount of payment
    currency | string | name of payment currency
    counterparty | string | counterparty issuer
    memo | string | pay memo, optional

    ```json
    {
        "success": true,
        "data": {
            "resultCode": "tesSUCCESS",
            "resultMessage": "The transaction was applied. Only final in a validated ledger."
        }
    }
    ```

    ### Return Data
    
    Name | Type | Description
    ---- | ---- | -----------
    resultCode | string | server results for payment transactions
    resultMessage | string | description of payment transaction results
    hash | string | payment transaction hash

- Transaction List

    Get account transaction history. Each request wil return `results` as transactions list and `marker` as a marker for next request. When `marker` is missing, there is no data for the account.

    ```js
    /api/accounts/:address/transactions, GET
    ```
    
    #### Request optional query parameters
    Name | Type | Description
    ---- | ---- | -----------
    ledger | integer | marker ledger for request
    seq | integer | marker seq for request, should used with ledger
    initiated | boolean | filter transactions that initiated by the account
    counterparty | string | filter transactions for the counterparty
    limit | integer | request limit transactions, default is 10
    
    ### Example
    
    http://localhost/api/accounts/cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB/transactions
    
    ```json
    {
        "success": true,
        "data": {
            "results": [
                {
                    "type": "payment",
                    "address": "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ",
                    "sequence": 2,
                    "id": "857C986514157D8139909B987E1538782F50B3288F200BDFF25847E5E81993D3",
                    "specification": {
                        "source": {
                            "address": "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ",
                            "maxAmount": {
                                "currency": "CALL",
                                "value": "10"
                            }
                        },
                        "destination": {
                            "address": "cDVCAS1cnoMboELkQXxdmhJCiMscMm93U2",
                            "amount": {
                                "currency": "CALL",
                                "value": "10"
                            }
                        }
                    },
                    "outcome": {
                        "result": "tesSUCCESS",
                        "timestamp": "2018-11-12T07:59:02.000Z",
                        "fee": "0.000012",
                        "balanceChanges": {
                            "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ": [
                                {
                                    "currency": "CALL",
                                    "value": "-10.000012"
                                }
                            ],
                            "cDVCAS1cnoMboELkQXxdmhJCiMscMm93U2": [
                                {
                                    "currency": "CALL",
                                    "value": "10"
                                }
                            ]
                        },
                        "orderbookChanges": {},
                        "ledgerVersion": 6876813,
                        "indexInLedger": 0,
                        "deliveredAmount": {
                            "currency": "CALL",
                            "value": "10"
                        }
                    }
                },
                {
                    "type": "payment",
                    "address": "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ",
                    "sequence": 1,
                    "id": "70E6EFFF109AC8133F0A4C2AF8B35F83E20EA72E964EA311DD1598F291C13E76",
                    "specification": {
                        "source": {
                            "address": "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ",
                            "maxAmount": {
                                "currency": "CALL",
                                "value": "10"
                            }
                        },
                        "destination": {
                            "address": "cDVCAS1cnoMboELkQXxdmhJCiMscMm93U2",
                            "amount": {
                                "currency": "CALL",
                                "value": "10"
                            }
                        }
                    },
                    "outcome": {
                        "result": "tesSUCCESS",
                        "timestamp": "2018-11-12T07:57:33.000Z",
                        "fee": "0.000012",
                        "balanceChanges": {
                            "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ": [
                                {
                                    "currency": "CALL",
                                    "value": "-10.000012"
                                }
                            ],
                            "cDVCAS1cnoMboELkQXxdmhJCiMscMm93U2": [
                                {
                                    "currency": "CALL",
                                    "value": "10"
                                }
                            ]
                        },
                        "orderbookChanges": {},
                        "ledgerVersion": 6876784,
                        "indexInLedger": 0,
                        "deliveredAmount": {
                            "currency": "CALL",
                            "value": "10"
                        }
                    }
                }
            ]
        }
    }
    ```

    ### Return Data
    
    Name | Type | Description
    ---- | ---- | -----------
    results | array | Transaction information array
    type | string | Type of transaction
    address | string | Originator address
    sequence | string | Transaction record number
    id | string | Trading hash
    specification | string | Transaction details
    outcome | string | Transaction results
    marker | object | marker for next request
    ledger | interger | ledger marker for next request
    seq | integer | seq marker for next request
    
   

- Transaction Detail

    Get transaction detail information by transaction hash

    ```js
    /api/transaction/:hash, GET
    ```

    ### Example
    
    http://localhost/api/transaction/70E6EFFF109AC8133F0A4C2AF8B35F83E20EA72E964EA311DD1598F291C13E76
    
    ```json
    {
        "success": true,
        "data": {
            "type": "payment",
            "address": "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ",
            "sequence": 1,
            "id": "70E6EFFF109AC8133F0A4C2AF8B35F83E20EA72E964EA311DD1598F291C13E76",
            "specification": {
                "source": {
                    "address": "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ",
                    "maxAmount": {
                        "currency": "CALL",
                        "value": "10"
                    }
                },
                "destination": {
                    "address": "cDVCAS1cnoMboELkQXxdmhJCiMscMm93U2",
                    "amount": {
                        "currency": "CALL",
                        "value": "10"
                    }
                }
            },
            "outcome": {
                "result": "tesSUCCESS",
                "timestamp": "2018-11-12T07:57:33.000Z",
                "fee": "0.000012",
                "balanceChanges": {
                    "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ": [
                        {
                            "currency": "CALL",
                            "value": "-10.000012"
                        }
                    ],
                    "cDVCAS1cnoMboELkQXxdmhJCiMscMm93U2": [
                        {
                            "currency": "CALL",
                            "value": "10"
                        }
                    ]
                },
                "orderbookChanges": {},
                "ledgerVersion": 6876784,
                "indexInLedger": 0,
                "deliveredAmount": {
                    "currency": "CALL",
                    "value": "10"
                }
            }
        }
    }
    ```

    ### Return Data
    
    Name | Type | Description
    ---- | ---- | -----------
    type | string | Type of transaction
    address | string | Originator address
    sequence | string | Transaction record number
    id | string | Trading hash
    specification | string | Transaction details
    outcome | string | Transaction results
    