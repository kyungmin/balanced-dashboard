module('Balanced.Utils');

test('toDataUri', function(assert) {
	var tests = {
		'aabbcc': 'data:text/plain;charset=utf-8;base64,YWFiYmNj'
	};

	_.each(tests, function(val, key) {
		assert.equal(val, Balanced.Utils.toDataUri(key));
	});
});

test('getParamByName', function(assert) {
	var uris = [
		'/v1/marketplaces?query=123',
		'/v1/marketplaces?query=123&after=bar',
		'/v1/marketplaces?infront=foo&query=123&after=bar'
	];

	for (var i = 0; i < uris.length; i++) {
		var result = Balanced.Utils.getParamByName(uris[i], 'query');
		assert.equal(result, '123');
	}
});

test("objectToQueryString", function(assert) {
	var testExpectation = function(value, expectation) {
		var result = Balanced.Utils.objectToQueryString(value);
		assert.equal(result, expectation);
	};

	testExpectation({
		milo: "cat"
	}, "milo=cat");

	testExpectation({
		one: "two",
		three: undefined
	}, "one=two&three=");
	testExpectation({
		roger: "dog",
		milo: "cat",
		"princesMonsterTruck&lil Bub": "cat>dog"
	}, "roger=dog&milo=cat&princesMonsterTruck%26lil%20Bub=cat%3Edog");
});

test('formatCurrency', function(assert) {
	var cents = [-984526372, -10000, -105, -1,
		0,
		1,
		105,
		10000,
		984726372,
		null
	];

	var expected = [
		'-$9,845,263.72',
		'-$100.00',
		'-$1.05',
		'-$0.01',
		'$0.00',
		'$0.01',
		'$1.05',
		'$100.00',
		'$9,847,263.72',
		'$0.00'
	];

	for (var i = 0; i < cents.length; i++) {
		assert.equal(Balanced.Utils.formatCurrency(cents[i]), expected[i]);
	}
});

test('centsToDollars', function(assert) {
	var cents = [-984526372, -10000, -105, -1,
		0,
		1,
		105,
		10000,
		984726372,
		null
	];

	var expected = [
		'-9,845,263.72',
		'-100.00',
		'-1.05',
		'-0.01',
		'0',
		'0.01',
		'1.05',
		'100.00',
		'9,847,263.72',
		'0'
	];

	for (var i = 0; i < cents.length; i++) {
		assert.equal(Balanced.Utils.centsToDollars(cents[i]), expected[i]);
	}
});

test('dollarsToCents', function(assert) {
	var dollars = [
		'0',
		'0.',
		'0.1',
		'.51',
		'0.01',
		'0.51',
		'1.05',
		'45.98',
		'100',
		'100.0',
		'100.00',
		'631.55',
		'1498',
		' 1,498 ',
		' 1,498. ',
		' 1,498.1 ',
		'2947.56',
		'2,947.56',
		'9847263.72',
		'9847263',
		'9,847,263.72',
		'223.',
		'223.6',
		'2,947.',
		'2,947.5'
	];

	var cents = [
		0,
		0,
		10,
		51,
		1,
		51,
		105,
		4598,
		10000,
		10000,
		10000,
		63155,
		149800,
		149800,
		149800,
		149810,
		294756,
		294756,
		984726372,
		984726300,
		984726372,
		22300,
		22360,
		294700,
		294750
	];

	for (var i = 0; i < dollars.length; i++) {
		assert.equal(Balanced.Utils.dollarsToCents(dollars[i]), cents[i]);
	}

	var invalid = [
		null,
		undefined,
		'',
		'dsfadsf',
		'!safds',
		'$afs',
		'122.34324'
	];

	////
	// Not a fan of this, but we need to wrap in a functions outside of the
	// loop so jshint is happy.
	////

	function isInvalid(val) {
		assert.throws(function() {
				Balanced.Utils.dollarsToCents(val);
			},
			/is not a valid dollar amount/,
			'Expected an error to be thrown'
		);
	}

	for (var j = 0; j < invalid.length; j++) {
		isInvalid(invalid[j]);
	}
});

test('isValidPassword', function(assert) {
	var invalid_passwords = [
		null,
		'',
		'1',
		'123456',
		'a',
		'abcdef'
	];

	var valid_passwords = [
		'1abcdef',
		'12345f',
		'SupahSecret123',
		'JohnSe!@#~~~cret1212',
		'IAMSUPERMAN123'
	];

	_.each(invalid_passwords, function(password) {
		assert.equal(Balanced.PASSWORD.REGEX.test(password), false, password);
	});

	_.each(valid_passwords, function(password) {
		assert.equal(Balanced.PASSWORD.REGEX.test(password), true, password);
	});
});

test('stripDomain', function(assert) {
	var urls = [
		'https://api.balancedpayments.com/v1/marketplaces',
		'http://api.balancedpayments.com/v1/marketplaces/TEST-MP5noKWGqLyLOLKkQkJmKg9s',
		'https://api.balancedpayments.com/v1/customers/AC5npjjazD5O0cKfEkizNghk/bank_accounts',
		'http://api.balancedpayments.com/v1/customers/AC5npjjazD5O0cKfEkizNghk/bank_accounts?marketplace=TEST-MP5noKWGqLyLOLKkQkJmKg9s&limit=10&offset=0',
		'/v1/customers',
		'api.balancedpayments.com/v1/customers/AC5npjjazD5O0cKfEkizNghk'
	];

	var expected = [
		'/v1/marketplaces',
		'/v1/marketplaces/TEST-MP5noKWGqLyLOLKkQkJmKg9s',
		'/v1/customers/AC5npjjazD5O0cKfEkizNghk/bank_accounts',
		'/v1/customers/AC5npjjazD5O0cKfEkizNghk/bank_accounts?marketplace=TEST-MP5noKWGqLyLOLKkQkJmKg9s&limit=10&offset=0',
		'/v1/customers',
		'api.balancedpayments.com/v1/customers/AC5npjjazD5O0cKfEkizNghk'
	];

	for (var i = 0; i < urls.length; i++) {
		assert.equal(Balanced.Utils.stripDomain(urls[i]), expected[i]);
	}
});

test('prettyLogUrl', function(assert) {
	var uris = [
		'http://api.balancedpayments.com/v1/marketplaces',
		'https://api.balancedpayments.com/v1/marketplaces/',
		'http://api.balancedpayments.com/v1/marketplaces/TEST-MP5noKWGqLyLOLKkQkJmKg9s',
		'https://api.balancedpayments.com/v1/marketplaces/TEST-MP5noKWGqLyLOLKkQkJmKg9s/',
		'https://api.balancedpayments.com/v1/customers/AC5npjjazD5O0cKfEkizNghk/bank_accounts',
		'http://api.balancedpayments.com/v1/marketplaces/TEST-MP5noKWGqLyLOLKkQkJmKg9s/credits',
		'https://api.balancedpayments.com/v1/marketplaces/TEST-MP5noKWGqLyLOLKkQkJmKg9s/accounts/AC5nNzq2Qy3cjrXOGqow2yka/credits',
		'https://api.balancedpayments.com/v1/marketplaces/TEST-MP5noKWGqLyLOLKkQkJmKg9s/accounts/AC5npjjazD5O0cKfEkizNghk/bank_accounts?is_valid=True',
		'http://api.balancedpayments.com/v1/customers/AC5npjjazD5O0cKfEkizNghk/bank_accounts/BA5nPKKnltzJAAEiWWnnZHBg?marketplace=TEST-MP5noKWGqLyLOLKkQkJmKg9s'
	];

	var expected = [
		'/v1/marketplaces',
		'/v1/marketplaces/',
		'/v1/marketplaces/TEST-MP5noKWGqLyLOLKkQkJmKg9s',
		'/v1/marketplaces/TEST-MP5noKWGqLyLOLKkQkJmKg9s/',
		'/v1/customers/AC5npjjazD5O0cKfEkizNghk/bank_accounts',
		'/v1/.../credits',
		'/v1/.../accounts/AC5nNzq2Qy3cjrXOGqow2yka/credits',
		'/v1/.../accounts/AC5npjjazD5O0cKfEkizNghk/bank_accounts',
		'/v1/customers/AC5npjjazD5O0cKfEkizNghk/bank_accounts/BA5nPKKnltzJAAEiWWnnZHBg'
	];

	for (var i = 0; i < uris.length; i++) {
		assert.equal(Balanced.Utils.prettyLogUrl(uris[i]), expected[i]);
	}
});

test('toTitleCase', function(assert) {
	var inputs = [
		null,
		undefined,
		'',
		'a',
		'something',
		'something else',
		'something_else'
	];

	var outputs = [
		null,
		undefined,
		'',
		'A',
		'Something',
		'Something Else',
		'Something Else'
	];

	for (var i = 0; i < inputs.length; i++) {
		assert.equal(Balanced.Utils.toTitleCase(inputs[i]), outputs[i]);
	}
});

test('combineUri', function(assert) {
	var inputs = [{
		base: 'http://auth.balancedpayments.com/v1/marketplaces/TEST-MP1',
		path: '1234'
	}, {
		base: 'http://auth.balancedpayments.com/v1/marketplaces/TEST-MP1/',
		path: '1234'
	}, {
		base: 'http://auth.balancedpayments.com/v1/marketplaces/TEST-MP1',
		path: '/1234'
	}, {
		base: 'http://auth.balancedpayments.com/v1/marketplaces/TEST-MP1/',
		path: '/1234'
	}];

	var outputs = [
		'http://auth.balancedpayments.com/v1/marketplaces/TEST-MP1/1234',
		'http://auth.balancedpayments.com/v1/marketplaces/TEST-MP1/1234',
		'http://auth.balancedpayments.com/v1/marketplaces/TEST-MP1/1234',
		'http://auth.balancedpayments.com/v1/marketplaces/TEST-MP1/1234'
	];

	assert.throws(function() {
		Balanced.Utils.combineUri(null, undefined);
	});

	for (var i = 0; i < inputs.length; i++) {
		assert.equal(Balanced.Utils.combineUri(inputs[i].base, inputs[i].path), outputs[i]);
	}
});

test('formatNumber', function(assert) {
	var number = [-984526372, -10000, -1000, -105, -1,
		0,
		1,
		105,
		1000,
		10000,
		984726372,
		null,
		undefined
	];

	var expected = [
		'-984,526,372',
		'-10,000',
		'-1,000',
		'-105',
		'-1',
		'0',
		'1',
		'105',
		'1,000',
		'10,000',
		'984,726,372',
		'0',
		'0'
	];

	for (var i = 0; i < number.length; i++) {
		assert.equal(Balanced.Utils.formatNumber(number[i]), expected[i]);
	}
});

test('formatFileSize', function(assert) {
	var bytes = [
		null,
		undefined,
		0,
		93065,
		1000000000
	];

	var expected = [
		"0 byte",
		"0 byte",
		"0 byte",
		"93.06 kb",
		"1.00 gb"
	];

	for (var i = 0; i < bytes.length; i++) {
		assert.equal(Balanced.Utils.formatFileSize(bytes[i]), expected[i]);
	}
});

test('formatError', function(assert) {
	var error = [
		null,
		undefined,
		'Invalid field [routing_number] - "" is not a valid routing number',
		'Invalid field [routing_number] --- "" is not a valid routing number',
		'"123456789abc" must have length <= 9'
	];

	var expected = [
		null,
		undefined,
		'"" is not a valid routing number',
		'"" is not a valid routing number',
		'"123456789abc" must have length <= 9'
	];

	for (var i = 0; i < error.length; i++) {
		assert.equal(Balanced.Utils.formatError(error[i]), expected[i]);
	}
});

test('applyUriFilters', function(assert) {
	var test = function(uri, query, expectation) {
		var result = Balanced.Utils.applyUriFilters(uri, query);
		assert.equal(result, expectation);
	};

	test('http://example.com/something', {
		query: 'hello',
	}, 'http://example.com/something?limit=10&offset=0&q=hello');

	test('http://example.com/something', {
		query: 'hello',
		limit: 23,
		offset: 87,
		sortField: 'foo',
		sortOder: 'asc',
		minDate: new Date(1231231231231),
		maxDate: new Date(1231231231231),
		type: 'foobar'
	}, 'http://example.com/something?created_at%5B%3C%5D=2009-01-06T08%3A40%3A31.231Z&created_at%5B%3E%5D=2009-01-06T08%3A40%3A31.231Z&limit=23&offset=87&q=hello&sortOder=asc&type=foobar');

	test('http://example.com/something', {
		query: 'hello',
		custom: 'woohoo'
	}, 'http://example.com/something?custom=woohoo&limit=10&offset=0&q=hello');

	test('http://example.com/something', {
		query: 'nick+test1@rasslingcats.com'
	}, 'http://example.com/something?limit=10&offset=0&q=nick%2Btest1%40rasslingcats.com');
});


test('filterSensitiveData', function(assert) {
	var inputs = [
		null,
		undefined, [], {},
		'hello world',
		'123-12-1234',
		'1234123412341234',
		'1234-1234-1234-1234',
		'1234 1234 1234 1234',
		'123456',
		'my SSN is 123-12-1234',
		"i'm dumb and my credit card number is 1234-1234-1234-1234 yup"
	];

	var expected = [
		null,
		undefined,
		"",
		"[object Object]",
		'hello world',
		'XX-HIDE-XX-1234',
		'XX-HIDE-XX-1234',
		'XX-HIDE-XX-1234',
		'XX-HIDE-XX-1234',
		'XX-HIDE-XX-3456',
		'my SSN is XX-HIDE-XX-1234',
		"i'm dumb and my credit card number is XX-HIDE-XX-1234 yup"
	];

	for (var i = 0; i < inputs.length; i++) {
		assert.equal(Balanced.Utils.filterSensitiveData(inputs[i]), expected[i]);
	}
});

test('updateQueryStringParameter', function(assert) {
	var uris = {
		'/v1/marketplaces?query=123': '/v1/marketplaces?query=890',
		'/v1/marketplaces?query=123&after=bar': '/v1/marketplaces?query=890&after=bar',
		'/v1/marketplaces?infront=foo&query=123&after=bar': '/v1/marketplaces?infront=foo&query=890&after=bar'
	};

	_.each(uris, function(val, key) {
		assert.equal(val, Balanced.Utils.updateQueryStringParameter(key, 'query', '890'));
	});
});

test('toGravatar', function(assert) {
	var hashs = {
		'exampleHash': 'https://secure.gravatar.com/avatar/exampleHash?s=30&d=mm',
		'': 'https://secure.gravatar.com/avatar?s=30&d=mm'
	};

	_.each(hashs, function(val, key) {
		assert.equal(val, Balanced.Utils.toGravatar(key));
	});
});

test('setCurrentMarketplace', function(assert) {
	expect(0);
});

test('filterSensitivePropertiesMap', function(assert) {
	var inputs = [
		null,
		undefined, {}, {
			a: 'b'
		}, {
			a: {
				b: 'c'
			}
		}, {
			a: '1234123412341234',
			b: "234523452345"
		}
	];

	var expected = [
		null,
		undefined, {}, {
			a: 'b'
		}, {
			a: "[object Object]"
		}, {
			a: 'XX-HIDE-XX-1234',
			b: "XX-HIDE-XX-2345"
		}
	];

	for (var i = 0; i < inputs.length; i++) {
		assert.deepEqual(Balanced.Utils.filterSensitivePropertiesMap(inputs[i]), expected[i]);
	}
});

test("#buildUri", function(assert) {
	var test = function(path, query, expectation) {
		var result = Balanced.Utils.buildUri(path, query);
		assert.equal(result, expectation);
	};

	test("/path", undefined, "/path");
	test("/path", {}, "/path");
	test("/path", "", "/path");

	test("/path", {
		milo: "cat",
		roger: "dog"
	}, "/path?milo=cat&roger=dog");
	test("/path", "milo=cat&roger=dog", "/path?milo=cat&roger=dog");
});

/*
test("#formatDate", function(assert) {
	var test = function(value, expectation) {
		var f = '%B %e %Y, %l:%M %p';
		assert.deepEqual(Balanced.Utils.formatDate(value, f), expectation);
	};

	var date = moment('2011-04-01 00:00:00').toDate();
	test(date, "April 1 2011, 12:00 AM");
	test("2014-07-23T08:39:14+00:00", "July 23 2014,  1:39 AM");
	test(1000, 1000);
});

test("#humanReadableDate", function(assert) {
	var test = function(value, expectation) {
		assert.deepEqual(Balanced.Utils.humanReadableDate(value), expectation);
	};
	var date = moment('2011-04-01 00:00:00').toDate();
	test(date, "Apr 1, 2011");
	test("2014-07-23T08:39:14+00:00", "Jul 23, 2014");
	test(1000, 1000);
});

test("#humanReadableTime", function(assert) {
	var test = function(value, expectation) {
		var f = '%B %e %Y, %l:%M %p';
		assert.deepEqual(Balanced.Utils.humanReadableTime(value), expectation);
	};
	var date = moment('2011-04-01 00:00:00').toDate();
	test(date, "12:00 AM");
	test("2014-07-23T18:39:14+00:00", "11:39 AM");
	test(1000, 1000);
});

test("#humanReadableDateShort", function(assert) {
	var test = function(value, expectation) {
		var f = '%B %e %Y, %l:%M %p';
		assert.deepEqual(Balanced.Utils.humanReadableDateShort(value), expectation);
	};
	var date = moment('2011-04-01 00:00:00').toDate();
	test(date, "04/1/11, 12:00 AM");
	test("2014-07-23T08:39:14+00:00", "07/23/14,  1:39 AM");
	test(1000, 1000);
});

test("#humanReadableDateLong", function(assert) {
	var test = function(value, expectation) {
		var f = '%B %e %Y, %l:%M %p';
		assert.deepEqual(Balanced.Utils.humanReadableDateLong(value), expectation);
	};
	var date = moment('2011-04-01 00:00:00').toDate();
	test(date, "April 1 2011, 12:00 AM");
	test("2014-07-23T08:39:14+00:00", "July 23 2014,  1:39 AM");
	test(1000, 1000);
});
*/
