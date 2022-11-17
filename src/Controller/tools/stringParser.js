function stringParser(str) {
	if (Number(str) == NaN)
		return ("varchar");
	if (str.indexOf("."))
		return ("float");
	return ("int");
};

export default stringParser;
