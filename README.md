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

### New Wallet

- /api/wallet/new, GET

#### Example

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

#### Return Value

Name | Type | Description
---- | ---- | -----------
success | boolean | Request results 
data | object | CALL wallet
secret | string | CALL wallet private key
address | string | CALL wallet address

### Account Balance

- /api/accounts/:address/balances, GET

#### Example

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

#### Return Value

Name | Type | Description
---- | ---- | -----------
success | boolean | Request results 
data | array | Balance array
currency | string | Currency name
value | string | Balance

### Payment

- /api/accounts/:address/payments, POST

#### Example

http://localhost/api/accounts/cnW1i1c6Wkz9ucQC7uK1UcbFNr5VUYUvxB/payments

#### Request parameters
Name | Type | Description
---- | ---- | -----------
source | string | Payer wallet address 
secret | string | Payer wallet private key
value | string | Amount of payment
currency | string | Name of payment currency
counterparty | string | Counterparty issuer
memo | string | Pay memo

```json
{
    "success": true,
    "data": {
        "resultCode": "tesSUCCESS",
        "resultMessage": "The transaction was applied. Only final in a validated ledger."
    }
}
```

#### Return Value

Name | Type | Description
---- | ---- | -----------
success | boolean | Request results 
data | object | Payment results
resultCode | string | Server results for payment transactions
resultMessage | string | Description of payment transaction results

### Transaction List

- /api/accounts/:address/transactions, GET

#### Example

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

#### Return Value

Name | Type | Description
---- | ---- | -----------
success | boolean | Request results 
results | array | Transaction information array
type | string | Type of transaction
address | string | Originator address
sequence | string | Transaction record number
id | string | Trading hash
specification | string | Transaction details
outcome | string | Transaction results

### Transaction Detail

- /api/transaction/:hash, GET

#### Example

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

#### Return Value

Name | Type | Description
---- | ---- | -----------
success | boolean | Request results 
data | object | Transaction detail
type | string | Type of transaction
address | string | Originator address
sequence | string | Transaction record number
id | string | Trading hash
specification | string | Transaction details
outcome | string | Transaction results