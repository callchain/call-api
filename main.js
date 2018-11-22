import express from 'express';
let app = express();
import bodyParser from 'body-parser';
import multer from 'multer';

//import call from 'call-lib';
const call = require('call-lib');
const server = 'wss://s1.callchain.live:5020';
const api = new call.CallAPI({server: server});

let upload = multer(); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
	return res.send('Welcome to Callchain Api!');
});

// create new wallet
app.get('/api/wallet/new', (req, res) => {
	var ret = api.generateAddress();
	return res.json({success: true, data: ret});
});

function compare(prop, flag) { //对象排序,flag=true由小到大;flag=false由大到小
    return function (obj1, obj2) {
        let val1 = obj1[prop];
        let val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (flag) {
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        } else {
            if (val1 < val2) {
                return 1;
            } else if (val1 > val2) {
                return -1;
            } else {
                return 0;
            }
        }
    }
}

// get account balance
app.get('/api/accounts/:address/balances', (req, res) => {
	var address = req.params.address;
	var options = {};
	var counterparty = req.query.counterparty;
	if (counterparty) {
		options.counterparty = counterparty;
	}
	var currency = req.query.currency;
	if (currency) {
		options.currency = currency;
	}
	var ledgerVersion = Number(req.query.ledgerVersion) || 0;
	if (ledgerVersion !== 0) {
		options.ledgerVersion = ledgerVersion;
	}

	api.connect().then(() => {
		return api.getBalances(address, options);
	}).then(balances => {
		api.disconnect();
		let result = [];
		balances.forEach(balance => {
			if (Number(balance.value) >=0) {
				result.push(balance);
			}
		});
		return res.json({success: true, data: result});
	}).catch(error => {
		return res.json({success: false, error: error});
	});
});

// do payment
app.post('/api/accounts/:address/payments',upload.array(), (req, res) => {
	var destination = req.params.address;
	// post body data
	var source = req.body.source;
	var secret = req.body.secret;
	var value = req.body.value;
	var currency = req.body.currency;
	var counterparty = req.body.counterparty;
	var memo = req.body.memo;
	var payment = {
		source: {
			address: source,
			maxAmount: { value: value, currency: currency, counterparty: counterparty }
		},
		destination: {
			address: destination,
			amount: { value: value, currency: currency, counterparty: counterparty }
		}
	}
	if (memo) {
		payment.memos = [{data: memo, type: 'string', format: 'text/plain'}];
	}

	api.connect().then(() => {
		api.preparePayment(source, payment).then(prepared => {
			prepared.secret = secret;
			var signedTx = api.sign(prepared.tx_json, prepared.secret);
			api.submit(signedTx, true).then(result => {
				return res.json({success: result.resultCode === 'tesSUCCESS', data: result});
			}).catch(error => {
				return res.json({success: false, error: error});
			});
		}).catch(error => {
			return res.json({success: false, error: error});
		});
	});
});

// create one order
app.post('/api/accounts/:address/orders', upload.array(),(req, res) => {
	var source = req.params.address;
	// post body data
	var secret = req.body.secret;
	var type = req.body.type;
	var baseCurrency = req.body.baseCurrency;
	var baseCounterparty = req.body.baseCounterparty;
	var baseValue = req.body.baseValue;
	var counterCurrency = req.body.counterCurrency;
	var counterCounterparty = req.body.counterCounterparty;
	var counterValue = req.body.counterValue;
	var order = {
		"direction": type,
		"quantity": {
			"currency": baseCurrency,
			"counterparty": baseCurrency === 'CALL' ? '' : baseCounterparty,
			"value": baseValue
		},
		"totalPrice": {
			"currency": counterCurrency,
			"counterparty": counterCurrency === 'CALL' ? '' : counterCounterparty,
			"value": counterValue
		}
	};

	api.connect().then(() => {
		api.prepareOrder(source, order).then(prepared => {
			var signedTransaction = api.sign(prepared.tx_json, secret);
			api.submit(signedTransaction, true).then(result => {
				result.hash = signedTransaction.id;
				return res.json({ success: true, data: result });
			}, error => {
				return res.json({ success: false, error: error });
			});
		}).catch(error => {
			return res.json({ success: false, error: error });
		})
	});
});

// cancel one order
app.delete('/api/accounts/:address/orders/:seq', upload.array(), (req, res) => {
	var source = req.params.address;
	var seq = req.params.seq;
	// post body data
	var secret = req.body.secret;
	api.connect().then(() => {
		api.prepareOrderCancellation(source, { orderSequence: Number(seq) }).then(prepared => {
			var signedTransaction = api.sign(prepared.tx_json, secret);
			api.submit(signedTransaction, true).then(result => {
				result.hash = signedTransaction.id;
				return res.json({ success: true, data: result });
			}, error => {
				return res.json({ success: false, error: error });
			});
		}).catch(error => {
			return res.json({ success: false, error: error });
		})
	});
});

// get account transaction history
app.get('/api/accounts/:address/transactions', (req, res) => {
	var address = req.params.address;
	var options = {};
	var limit = req.query.limit;
	if (limit) {
		options.limit = Number(limit) || 10;
	}
	var ledger = Number(req.query.ledger) || 0;
	var seq = Number(req.query.seq) || 0;
	if (ledger !== 0) {
		options.marker = {ledger: ledger, seq: seq};
	}
	var initiated = req.query.initiated;
	if (initiated === 'true' || initiated === 'false') {
		options.initiated = Boolean(initiated);
	}
	var counterparty = req.query.counterparty;
	if (counterparty) {
		options.counterparty = counterparty;
	}
	api.connect().then(() => {
		return api.getServerInfo();
	}).then(serverInfo => {
		const ledgers = serverInfo.completeLedgers.split('-');
        options.minLedgerVersion = Number(ledgers[0]);
        options.maxLedgerVersion = Number(ledgers[1]);
        return api.getTransactions(address, options);
	}).then(txs => {
		return res.json({success: true, data: txs.results.sort(compare('sequence', false))});
	}).catch(error => {
		return res.json({success: false, error: error});
	});
});

// get one transaction detail
app.get('/api/transaction/:hash', (req, res) => {
	var hash = req.params.hash;
	api.connect().then(() => {
		return api.getTransaction(hash);
	}).then(tx => {
		return res.json({success: true, data: tx});
	}).catch(error => {
		return res.json({success: false, error: error});
	});
});
//get market orders
app.get('/api/orderbook/:base/:counter', (req, res) => {
	///api/orderbook/:base_currency+:base_issuer/:counter_currency+:counter_issuer
	var base = req.params.base.split('+');
	var counter = req.params.counter.split('+'); 
	var base_currency = base[0];
	var base_issuer = base[1];
	var counter_currency = counter[0];
	var counter_issuer = counter[1];
	api.connect().then(()=> {
		const order_book = {
			base: {
				currency: base_currency,
				counterparty: base_issuer
			},
			counter: {
				currency: counter_currency,
				counterparty: counter_issuer
			}
		};
		if (!base_issuer) {
			delete order_book.base.counterparty;
		}
		if (!counter_issuer) {
			delete order_book.counter.counterparty;
		}

		api.getOrderbook('cDpYpZPDvij5pgajWwtiVFVo5iWjiEq4JS', order_book).then(result => {
			let bids = [];//买单
			let asks = [];//卖单
			for (let i in result.bids) {
				let s = result.bids[i].specification;
				let obj = {
					price: (Math.floor((Number(s.totalPrice.value * 100000000) / Number(s.quantity.value * 100000000)) * 100000000) / 100000000).toFixed(4),
					amount: (Math.floor(Number(s.quantity.value) * 10000) / 10000).toFixed(4)
				};
				//price 合并
				let flag = true;
				for (let j in bids) {
					if (bids[j].price === obj.price) {
						flag = false;
						bids[j].amount = (Math.floor((Number(bids[j].amount) + Number(obj.amount)) * 10000) / 10000).toFixed(4);
						break;
					}
				}
				if (flag)
					bids.push(obj);
			}
			for (let j in result.asks) {
				let s = result.asks[j].specification;
				let obj = {
					price: (Math.floor((Number(s.totalPrice.value * 100000000) / Number(s.quantity.value * 100000000)) * 100000000) / 100000000).toFixed(4),
					amount: (Math.floor(Number(s.quantity.value) * 10000) / 10000).toFixed(4)
				};
				//price 合并
				let flag = true;
				for (let j in asks) {
					if (asks[j].price === obj.price) {
						flag = false;
						asks[j].amount = (Math.floor((Number(asks[j].amount) + Number(obj.amount)) * 10000) / 10000).toFixed(4);
						break;
					}
				}
				if (flag)
					asks.push(obj);
			}
			return res.json({success: true, data: {bids: bids.sort(compare('price', false)), asks: asks.sort(compare('price', true))}});//买由高到低；卖由低到高
		}).catch(error => {
			return res.json({success: false, error: error});
		})
	}).catch(error=> {
		return res.json({success: false, error: error});
	});
});

app.listen(3000, () => {
	console.log('Callchain Api listening on port 3000!');
});

