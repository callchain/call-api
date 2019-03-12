# Callchain api ONLY for application internal deployment

## Runing

1. npm install
2. npm run build
3. node dist/main.js or `pm2 start dist/main.js` in production

- [Interfaces](#Interfaces)
  - [New Wallet](#New-Wallet)
  - [Account Balance](#Account-Balance)
  - [Payment](#Payment)
  - [Create Order](#Create-Order)
  - [Cancel Order](#Cancel-Order)
  - [Get Account Orders](#Get-Account-Orders)
  - [Transaction List](#Transaction-List)
  - [Transaction Detail](#Transaction-Detail)
  - [Get Market Orderbook](#Get-Market-Orders)

# Interfaces

## New Wallet
- Create new callchain wallet, return address and secret. Application should keep save of the secret for user or for application self.

    ```js
    /api/wallet/new, GET
    ```

    __Example__
    ```js
    http://localhost/api/wallet/new
    ```
    
    __Result Example__
    ```json
    {
        "success": true,
        "data": {
            "secret": "sp6TyPRD372FLHaaK1fnwDGMWiNWQ",
            "address": "cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB"
        }
    }
    ```

    __Return Data__
    
    Name | Type | Description
    ---- | ---- | -----------
    secret | string | CALL wallet secret
    address | string | CALL wallet address

## Account Balance
- Get balance of callchain account, return data is array of balance. Each item contains value, currency and counterparty. When currency is call, counterparty is empty. Counterparty is the currency issuer.

    ```js
    /api/accounts/:address/balances, GET
    ```

    __Example__

    ```js
    http://localhost/api/accounts/cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB/balances
    ```
    
    __Result Example__

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

    __Return Data__
    
    Name | Type | Description
    ---- | ---- | -----------
    currency | string | currency name
    value | string | currency balance value
    counterparty | string | currency issuer

## Payment
- Pay to destination of Callchain assets. When do payment, secret is required. So the api is only for internal deployment, and is not for decentrialized application.

    ```js
    /api/accounts/:address/payments, POST
    ```

    __Example__
    
    ```js
    http://localhost/api/accounts/cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB/payments
    ```
    
    __Request parameters__
    
    Name | Type | Description
    ---- | ---- | -----------
    source | string | payer wallet address 
    secret | string | payer wallet private key
    value | string | amount of payment
    currency | string | name of payment currency
    counterparty | string | counterparty issuer
    memo | string | pay memo, optional

    __Result Example__
    ```json
    {
        "success": true,
        "data": {
            "resultCode": "tesSUCCESS",
            "resultMessage": "The transaction was applied. Only final in a validated ledger.",
            "hash": "0FBB4C0B0E7A9DDE2753636A3C1A2E09AF5848FF52497CD675583CA9423039D6"
        }
    }
    ```

    __Return Data__
    
    Name | Type | Description
    ---- | ---- | -----------
    resultCode | string | server results for payment transactions
    resultMessage | string | description of payment transaction results
    hash | string | payment transaction hash


## Create Order
- Create order for assets exchange. If matched, Callchain will fill each order. If unmatched, the order will be pending and wait to be taked.

    ```js
    /api/accounts/:address/orders, POST
    ```
    
    __Example__

    ```js
    http://localhost/api/accounts/cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB/orders
    ```

    __Request Data__
    
    Name | Type | Description
    ---- | ---- | -----------
    secret | string | Payer wallet private key
    type | string | Type of transaction,sell or buy
    baseCurrency | string | Base currency name
    baseCounterparty | string | Base issuer address
    baseValue | string | Base currency transaction amount
    counterCurrency | string | Counter currency name
    counterCounterparty | string | Counter issuer address
    counterValue | string | Counter currency transaction amount

    ```json
    {
        "success": true,
        "data": {
            "resultCode": "tesSUCCESS",
            "resultMessage": "The transaction was applied. Only final in a validated ledger.",
            "hash": "D40BEEE7DFFAD3DBED51762AE9B03ED4541D99088209B2A0A6E9072A4E19349A"
        }
    }
    ```

    __Return Data__
    
    Name | Type | Description
    ---- | ---- | -----------
    resultCode | string | Server results for payment transactions
    resultMessage | string | Description of payment transaction results
    hash | string | transaction hash

## Cancel Order
- Cancel account's pending order by order sequence number.


    ```js
    /api/accounts/:address/orders/:order, POST
    ```

    __Example__
    
    ```js
    http://localhost/api/accounts/cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB/orders/9
    ```

    __Request Data__
    
    Name | Type | Description
    ---- | ---- | -----------
    order | string | Order number
    secret | string | Payer wallet private key

    __Result Example__
    ```json
    {
        "success": true,
        "data": {
            "resultCode": "tesSUCCESS",
            "resultMessage": "The transaction was applied. Only final in a validated ledger.",
            "hash": "F81A17CB363F9B038F97DDABC789CE9F097263E133316DBC298BB3887CB88557"
        }
    }
    ```

    __Return Data__
    
    Name | Type | Description
    ---- | ---- | -----------
    resultCode | string | Server results for payment transactions
    resultMessage | string | Description of payment transaction results
    hash | string | transaction hash

## Get Account Orders
- Get account pending orders, those are not filled.

    ```js
    /api/accounts/:address/orders, GET
    ```

    __Example__

    ```js
    http://localhost/api/accounts/cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB/orders
    ```

    __Result Example__
    ```json
    {
    "success": true,
    "data": [
        {
            "specification": {
                "direction": "buy",
                "quantity": {
                    "currency": "WJF",
                    "value": "10",
                    "counterparty": "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ"
                },
                "totalPrice": {
                    "currency": "CALL",
                    "value": "0.1"
                }
            },
            "properties": {
                "maker": "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ",
                "sequence": 83,
                "makerExchangeRate": "100"
            }
        },
        {
            "specification": {
                "direction": "sell",
                "quantity": {
                    "currency": "WJF",
                    "value": "99",
                    "counterparty": "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ"
                },
                "totalPrice": {
                    "currency": "CALL",
                    "value": "158.4"
                }
            },
            "properties": {
                "maker": "cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ",
                "sequence": 107,
                "makerExchangeRate": "1.6"
            }
        }
        ]
    }
    ```
    __Return Data__
    
    Name | Type | Description
    ---- | ---- | -----------
    data | array | Transaction information array
    direction | string | Type of order
    quantity | object | Number of order
    totalPrice | object | Total price
    makerExchangeRate | string | Unit Price

## Transaction List
- Get account transaction history. Each request wil return `results` as transactions list and `marker` as a marker for next request. When `marker` is missing, there is no data for the account.

    ```js
    /api/accounts/:address/transactions, GET
    ```
    
    __Optional Query Parameters__
    
    Name | Type | Description
    ---- | ---- | -----------
    ledger | integer | marker ledger for request
    seq | integer | marker seq for request, should used with ledger
    initiated | boolean | filter transactions that initiated by the account
    counterparty | string | filter transactions for the counterparty
    limit | integer | request limit transactions, min is 10 and max is 400
    
    __Example__
    
    ```js
    http://localhost/api/accounts/cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB/transactions
    ```
    
    __Result Example__
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

    __Return Data__
    
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
    
   

## Transaction Detail
- Get transaction detail information by transaction hash

    ```js
    /api/transaction/:hash, GET
    ```

    __Example__
    
    ```js
    http://localhost/api/transaction/70E6EFFF109AC8133F0A4C2AF8B35F83E20EA72E964EA311DD1598F291C13E76
    ```
    
    __Result Example__
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

    __Return Data__
    
    Name | Type | Description
    ---- | ---- | -----------
    type | string | Type of transaction
    address | string | Originator address
    sequence | string | Transaction record number
    id | string | Trading hash
    specification | string | Transaction details
    outcome | string | Transaction results


## Get Market Orderbook
- Get market orders information by base currency and counter currency

    ```js
    /api/orderbook/:base_currency+:base_issuer/:counter_currency+:counter_issuer, GET
    ```

    __Example__
    
    ```js
    http://localhost/api/orderbook/WJF+cLDGEff8xh2PJ7cikh82uTCp5JXAELETRQ/CALL
    ```
    
    __Result Example__
    ```json
    {
        "success": true,
        "data": {
            "bids": [
                {
                    "price": "0.0002",
                    "amount": "2.0000"
                },
                {
                    "price": "0.0001",
                    "amount": "1.0000"
                }
            ],
            "asks": [
                {
                    "price": "1.0000",
                    "amount": "2.0000"
                },
                {
                    "price": "1.5000",
                    "amount": "1.0000"
                },
                {
                    "price": "2.0000",
                    "amount": "1.0000"
                }
            ]
        }
    }
    ```

    __Return Data__
    
    Name | Type | Description
    ---- | ---- | -----------
    bids | string | Buy order
    asks | string | Sell order
    
