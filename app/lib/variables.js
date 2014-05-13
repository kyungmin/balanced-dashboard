Balanced.COOKIE = {
	// cookies set by the Ember dashboard app
	EMBER_AUTH_TOKEN: 'ember-auth-rememberable',
	MARKETPLACE_URI: 'mru',
	API_KEY_SECRET: 'apiKeySecret',

	// read only (set by the auth proxy)
	CSRF_TOKEN: 'csrftoken',
	SESSION: 'session'
};

Balanced.TIME = {
	THREE_YEARS: 365 * 3,
	MONTHS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	DAYS_IN_MONTH: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
	WEEK: 7
};

Balanced.KEYS = {
	ENTER: 13,
	ESCAPE: 27
};

Balanced.BANK_ACCOUNT_TYPES = [{
	label: 'Checking',
	value: 'checking'
}, {
	label: 'Savings',
	value: 'savings'
}];

Balanced.SEARCH = {
	CATEGORIES: ['order', 'transaction', 'search', 'customer', 'funding_instrument', 'dispute'],
	SEARCH_TYPES: ['debit', 'credit', 'card_hold', 'refund'],
	TRANSACTION_TYPES: ['debit', 'credit', 'hold', 'refund'],
	FUNDING_INSTRUMENT_TYPES: ['bank_account', 'card'],
	DISPUTE_TYPES: ['pending', 'won', 'lost']
};

//  time in ms to throttle between key presses for search
Balanced.THROTTLE = {
	SEARCH: 400,
	REFRESH: 1000,
	CURRENCY_CONVERSION: 400
};

Balanced.PASSWORD = {
	MIN_CHARS: 6,
	REGEX: /(?=.*[A-z])(?=.*\d)/
};

Balanced.MAXLENGTH = {
	DESCRIPTION: 150,
	APPEARS_ON_STATEMENT_BANK_ACCOUNT: 14,
	APPEARS_ON_STATEMENT_CARD: 18
};

Balanced.DATES = {
	CREATED_AT: moment('2011-04-01').startOf('day').toDate(),

	RESULTS_MAX_TIME: moment().add('hours', 2).startOf('hour').toDate(),
	RESULTS_MIN_TIME: moment().subtract('months', 1).startOf('hour').toDate()
};

Balanced.CURRENCY_LIST = [
	{ code: "AED", name: "UAE Dirham", decimal_place: 2 },
	{ code: "AFN", name: "Afghan Afghani", decimal_place: 2 },
	{ code: "ALL", name: "Albanian Lek", decimal_place: 2 },
	{ code: "AMD", name: "Armenian Dram", decimal_place: 2 },
	{ code: "ANG", name: "Netherlands Antillian Guilder", decimal_place: 2 },
	{ code: "AOA", name: "Angolan Kwanza", decimal_place: 2 },
	{ code: "ARS", name: "Argentine Peso", decimal_place: 2 },
	{ code: "AUD", name: "Australian Dollar", decimal_place: 2 },
	{ code: "AWG", name: "Aruban Guilder", decimal_place: 2 },
	{ code: "AZN", name: "Azerbaijanian Manat", decimal_place: 2 },
	{ code: "BAM", name: "Convertible Marks", decimal_place: 2 },
	{ code: "BBD", name: "Barbados Dollar", decimal_place: 2 },
	{ code: "BDT", name: "Bangladeshi Taka", decimal_place: 2 },
	{ code: "BGN", name: "Bulgarian Lev", decimal_place: 2 },
	{ code: "BHD", name: "Bahraini Dinar", decimal_place: 3 },
	{ code: "BIF", name: "Burundi Franc", decimal_place: 0 },
	{ code: "BMD", name: "Bermudian Dollar", decimal_place: 2 },
	{ code: "BND", name: "Brunei Dollar", decimal_place: 2 },
	{ code: "BOB", name: "Boliviano", decimal_place: 2 },
	{ code: "BRL", name: "Brazilian Real", decimal_place: 2 },
	{ code: "BSD", name: "Bahamian Dollar", decimal_place: 2 },
	{ code: "BWP", name: "Botswana Pula", decimal_place: 2 },
	{ code: "BYR", name: "Belarussian Ruble", decimal_place: 0 },
	{ code: "BZD", name: "Belize Dollar", decimal_place: 2 },
	{ code: "CAD", name: "Canadian Dollar", decimal_place: 2 },
	{ code: "CDF", name: "Franc Congolais", decimal_place: 2 },
	{ code: "CHF", name: "Swiss Franc", decimal_place: 2 },
	{ code: "CLP", name: "Chilean Peso", decimal_place: 2 },
	{ code: "CNY", name: "Yuan Renminbi", decimal_place: 2 },
	{ code: "COP", name: "Colombian Peso", decimal_place: 2 },
	{ code: "CRC", name: "Costa Rican Colon", decimal_place: 2 },
	{ code: "CUC", name: "Cuban Convertable Peso", decimal_place: 2 },
	{ code: "CVE", name: "Cape Verde Escudo", decimal_place: 2 },
	{ code: "CZK", name: "Czech Koruna", decimal_place: 2 },
	{ code: "DJF", name: "Djibouti Franc", decimal_place: 0 },
	{ code: "DKK", name: "Danish Krone", decimal_place: 2 },
	{ code: "DOP", name: "Dominican Peso", decimal_place: 2 },
	{ code: "DZD", name: "Algerian Dinar", decimal_place: 2 },
	{ code: "EEK", name: "Estonian Kroon", decimal_place: 2 },
	{ code: "EGP", name: "Egyptian Pound", decimal_place: 2 },
	{ code: "ERN", name: "Nakfa", decimal_place: 2 },
	{ code: "ETB", name: "Ethiopian Birr", decimal_place: 2 },
	{ code: "EUR", name: "Euro", decimal_place: 2 },
	{ code: "FJD", name: "Fiji Dollar", decimal_place: 2 },
	{ code: "FKP", name: "Falkland Islands Pound", decimal_place: 2 },
	{ code: "GBP", name: "Pound Sterling", decimal_place: 2 },
	{ code: "GEL", name: "Georgian Lari", decimal_place: 2 },
	{ code: "GHS", name: "Ghana Cedi", decimal_place: 2 },
	{ code: "GIP", name: "Gibraltar Pound", decimal_place: 2 },
	{ code: "GMD", name: "Gambian Dalasi", decimal_place: 2 },
	{ code: "GNF", name: "Guinea Franc", decimal_place: 0 },
	{ code: "GQE", name: "CFA Franc", decimal_place: 0 },
	{ code: "GTQ", name: "Guatemalan Quetzal", decimal_place: 2 },
	{ code: "GYD", name: "Guyana Dollar", decimal_place: 2 },
	{ code: "HKD", name: "Hong Kong Dollar", decimal_place: 2 },
	{ code: "HNL", name: "Honduran Lempira", decimal_place: 2 },
	{ code: "HRK", name: "Croatian Kuna", decimal_place: 2 },
	{ code: "HTG", name: "Haitian Gourde", decimal_place: 2 },
	{ code: "HUF", name: "Hungarian Forint", decimal_place: 2 },
	{ code: "IDR", name: "Indonesian Rupiah", decimal_place: 0 },
	{ code: "ILS", name: "New Israeli Sheqel", decimal_place: 2 },
	{ code: "INR", name: "Indian Rupee Ngultrum", decimal_place: 2 },
	{ code: "IQD", name: "Iraqi Dinar", decimal_place: 3 },
	{ code: "IRR", name: "Iranian Rial", decimal_place: 2 },
	{ code: "ISK", name: "Iceland Krona", decimal_place: 2 },
	{ code: "JMD", name: "Jamaican Dollar", decimal_place: 2 },
	{ code: "JOD", name: "Jordanian Dinar", decimal_place: 3 },
	{ code: "JPY", name: "Japanese Yen", decimal_place: 0 },
	{ code: "KES", name: "Kenyan Shilling", decimal_place: 2 },
	{ code: "KGS", name: "Kyrgyzstani Som", decimal_place: 2 },
	{ code: "KHR", name: "Cambodian Riel", decimal_place: 2 },
	{ code: "KMF", name: "Comoro Franc", decimal_place: 0 },
	{ code: "KPW", name: "North Korean Won", decimal_place: 2 },
	{ code: "KRW", name: "South Korean Won", decimal_place: 0 },
	{ code: "KWD", name: "Kuwaiti Dinar", decimal_place: 3 },
	{ code: "KYD", name: "Cayman Islands Dollar", decimal_place: 2 },
	{ code: "KZT", name: "Kazakhstani Tenge", decimal_place: 2 },
	{ code: "LAK", name: "Laotian Kip", decimal_place: 2 },
	{ code: "LBP", name: "Lebanese Pound", decimal_place: 2 },
	{ code: "LKR", name: "Sri Lanka Rupee", decimal_place: 2 },
	{ code: "LRD", name: "Liberian Dollar", decimal_place: 2 },
	{ code: "LSL", name: "Lesotho Loti", decimal_place: 2 },
	{ code: "LTL", name: "Lithuanian Litas", decimal_place: 2 },
	{ code: "LVL", name: "Latvian Lats", decimal_place: 2 },
	{ code: "LYD", name: "Libyan Dinar", decimal_place: 3 },
	{ code: "MAD", name: "Moroccan Dirham", decimal_place: 2 },
	{ code: "MDL", name: "Moldovan Leu", decimal_place: 2 },
	{ code: "MGA", name: "Malagasy Ariary", decimal_place: 0 },
	{ code: "MKD", name: "Macedonian Denar", decimal_place: 2 },
	{ code: "MMK", name: "Kyat", decimal_place: 2 },
	{ code: "MNT", name: "Mongolian Tugrik", decimal_place: 2 },
	{ code: "MOP", name: "Macanese Pataca", decimal_place: 2 },
	{ code: "MRO", name: "Mauritanian Ouguiya", decimal_place: 2 },
	{ code: "MUR", name: "Mauritius Rupee", decimal_place: 2 },
	{ code: "MVR", name: "Rufiyaa", decimal_place: 2 },
	{ code: "MWK", name: "Malawian Kwacha", decimal_place: 2 },
	{ code: "MXN", name: "Mexican Peso", decimal_place: 2 },
	{ code: "MYR", name: "Malaysian Ringgit", decimal_place: 2 },
	{ code: "MZM", name: "Mozambican Meticalis", decimal_place: 2 },
	{ code: "NAD", name: "Namibia Dollar", decimal_place: 2 },
	{ code: "NGN", name: "Nigerian Naira", decimal_place: 2 },
	{ code: "NIO", name: "Cordoba Oro", decimal_place: 2 },
	{ code: "NOK", name: "Norwegian Krone", decimal_place: 2 },
	{ code: "NPR", name: "Nepalese Rupee", decimal_place: 2 },
	{ code: "NZD", name: "New Zealand Dollar", decimal_place: 2 },
	{ code: "OMR", name: "Rial Omani", decimal_place: 3 },
	{ code: "PAB", name: "Panamanian Balboa", decimal_place: 2 },
	{ code: "PEN", name: "Nuevo Sol", decimal_place: 2 },
	{ code: "PGK", name: "Papua New Guinean Kina", decimal_place: 2 },
	{ code: "PHP", name: "Philippine Peso", decimal_place: 2 },
	{ code: "PKR", name: "Pakistan Rupee", decimal_place: 2 },
	{ code: "PLN", name: "Polish Zloty", decimal_place: 2 },
	{ code: "PYG", name: "Paraguayan Guarani", decimal_place: 0 },
	{ code: "QAR", name: "Qatari Rial", decimal_place: 2 },
	{ code: "RON", name: "Romanian Leu", decimal_place: 2 },
	{ code: "RSD", name: "Serbian Dinar", decimal_place: 2 },
	{ code: "RUB", name: "Russian Ruble", decimal_place: 2 },
	{ code: "RWF", name: "Rwanda Franc", decimal_place: 0 },
	{ code: "SAR", name: "Saudi Riyal", decimal_place: 2 },
	{ code: "SBD", name: "Solomon Islands Dollar", decimal_place: 2 },
	{ code: "SCR", name: "Seychelles Rupee", decimal_place: 2 },
	{ code: "SDG", name: "Sudanese Pound", decimal_place: 2 },
	{ code: "SEK", name: "Swedish Krona", decimal_place: 2 },
	{ code: "SGD", name: "Singapore Dollar", decimal_place: 2 },
	{ code: "SHP", name: "Saint Helena Pound", decimal_place: 2 },
	{ code: "SLL", name: "Sierra Leonean Leone", decimal_place: 2 },
	{ code: "SOS", name: "Somali Shilling", decimal_place: 2 },
	{ code: "SRD", name: "Surinam Dollar", decimal_place: 2 },
	{ code: "STD", name: "São Tomé and Príncipe Dobra", decimal_place: 2 },
	{ code: "SYP", name: "Syrian Pound", decimal_place: 2 },
	{ code: "SZL", name: "Swazi Lilangeni", decimal_place: 2 },
	{ code: "THB", name: "Thai Baht", decimal_place: 2 },
	{ code: "TJS", name: "Tajikistani Somoni", decimal_place: 2 },
	{ code: "TMM", name: "Manat", decimal_place: 2 },
	{ code: "TMT", name: "Turkmenistan Manat", decimal_place: 2 },
	{ code: "TND", name: "Tunisian Dinar", decimal_place: 3 },
	{ code: "TOP", name: "Pa'anga", decimal_place: 2 },
	{ code: "TRY", name: "New Turkish Lira", decimal_place: 2 },
	{ code: "TTD", name: "Trinidad and Tobago Dollar", decimal_place: 2 },
	{ code: "TWD", name: "New Taiwan Dollar", decimal_place: 2 },
	{ code: "TZS", name: "Tanzanian Shilling", decimal_place: 2 },
	{ code: "UAH", name: "Ukrainian Hryvnia", decimal_place: 2 },
	{ code: "UGX", name: "Uganda Shilling", decimal_place: 2 },
	{ code: "USD", name: "US Dollar", decimal_place: 3 },
	{ code: "UYU", name: "Peso Uruguayo", decimal_place: 2 },
	{ code: "UZS", name: "Uzbekistan Sum", decimal_place: 2 },
	{ code: "VEB", name: "Venezuelan Bolivares", decimal_place: 2 },
	{ code: "VND", name: "Vietnamese Dong", decimal_place: 2 },
	{ code: "VUV", name: "Vanuatu Vatu", decimal_place: 0 },
	{ code: "WST", name: "Samoan Tala", decimal_place: 2 },
	{ code: "XAF", name: "Central African CFA Franc", decimal_place: 0 },
	{ code: "XCD", name: "East Caribbean Dollar", decimal_place: 2 },
	{ code: "XOF", name: "West African CFA Franc", decimal_place: 2 },
	{ code: "XPF", name: "CFP Franc", decimal_place: 0 },
	{ code: "YER", name: "Yemeni Rial", decimal_place: 2 },
	{ code: "ZAR", name: "South African Rand", decimal_place: 2 },
	{ code: "ZMK", name: "Kwacha", decimal_place: 2 },
	{ code: "ZWR", name: "Zimbabwean Dollar", decimal_place: 2 }
];
