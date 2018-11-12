import express from 'express';
let app = express();
import bodyParser from 'body-parser';
import multer from 'multer';

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
		return res.json({success: true, result});
	}).catch(error => {
		return res.json({success: false, error: error});
	});
});

// do payment
app.post('/api/accounts/:address/payments',upload.array(), (req, res) => {
	// post body data
	var source = req.body.source;
	var secret = req.body.secret;
	var value = req.body.value;
	var currency = req.body.currency;
	var counterparty = req.body.counterparty || '';
	var memo = req.body.memo;
	var destination = req.body.destination;
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
				result.hash = signedTx.id;
				return res.json({success: result.resultCode === 'tesSUCCESS', data: result});
			}).catch(error => {
				return res.json({success: false, error: error});
			});
		}).catch(error => {
			return res.json({success: false, error: error});
		});
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
	if (initiated === 'false' || initiated === 'true') {
		options.initiated = (initiated === 'true');
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
		return res.json({success: true, data: txs});
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

app.listen(3000, () => {
	console.log('Callchain Api listening on port 3000!');
});

