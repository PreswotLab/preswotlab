const getNumericScanObject = async (fieldInfo) => {

	return ({
		attrName : fieldInfo.Field,
		attrType : fieldInfo.Type,
	/*	numOfNullRecords : ,
	 *	portionOfNullRecords :,
	 *	numOfDistinct : ,
	 *	max : 
	 *	min : 
	 *	numOfZero :
	 *	portionOfZero :,
	 *	repAttr : 
	 *	joinKeyCandidate:
	 *	repJoinKey :
	 */
	})
};

export default getNumericScanObject;
