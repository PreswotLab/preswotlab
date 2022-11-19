const getCategoryScanObject = async (fieldInfo) => {

	return ({
		attrName : fieldInfo.Field,
		attrType : fieldInfo.Type,
	/*	numOfNullRecords : ,
	 *	portionOfNullRecords :,
	 *	numOfDistinct : ,
	 *	numOfSpcRecords : 
	 *	portionOfSpcRecords : 
	 *	repAttr : 
	 *	joinKeyCandidate:
	 *	repJoinKey :
	 */
	});
}

export default getCategoryScanObject;
