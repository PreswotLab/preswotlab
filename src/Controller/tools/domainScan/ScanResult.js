import dbConnectQuery from "../user/dBConnectQuery";
import getServerLoginInfo from "../user/getServerLoginInfo";

export class ScanResult
{
	#tableName;
	#loginInfo;
	#numOfRecords;

	#repAttrJoinKey;
	#numericResult;
	#categoryResult;


	constructor (tableName, loginInfo) {
		this.#tableName = tableName;
		this.#loginInfo = loginInfo;
		this.#numOfRecords = null;
		this.#numericResult = null;
		this.#categoryResult = null;
		console.log("set ScanResult", this.#tableName, this.#loginInfo);
	}

	async #setNumOfRecords () 
	{
		const result = await dbConnectQuery(this.#loginInfo, 
		`
		SELECT *
		FROM ${this.#tableName};
		`);
		this.#numOfRecords = result.length;
	}

	async #setNumeric () 
	{
		const result = await dbConnectQuery(this.#loginInfo, 
			`
			SHOW COLUMNS from ${this.#tableName} 
			WHERE TYPE LIKE '%int%' 
			OR TYPE LIKE 'double%' 
			OR TYPE LIKE 'float%'
			OR TYPE LIKE 'boolean'
			OR TYPE LIKE 'bit'
			OR TYPE LIKE 'decimal';
		`);
		const rtn = [];
		for (let i = 0; i < result.length; i++)
		{
			rtn.push(await this.#makeNumericScanObject(result[i]));
		}
		this.#numericResult = rtn;
	}

	async #setCategory () 
	{
		const result = await dbConnectQuery(this.#loginInfo, 
		`
		SHOW COLUMNS from ${this.#tableName} 
		WHERE TYPE LIKE '%char%' 
		OR TYPE LIKE '%text%' 
		OR TYPE LIKE '%date%' 
		OR TYPE LIKE '%time%'
		OR TYPE LIKE 'binary'
		OR TYPE LIKE 'enum';
		`);
		const rtn = [];
		for (let i = 0; i < result.length; i++)
		{
			rtn.push(await this.#makeCategoryScanObject(result[i]));
		}
		this.#categoryResult = rtn;
	};

	async #makeCommonScanData (fieldInfo)
	{
		const attrName = fieldInfo.Field;
		const attrType = fieldInfo.Type;
		const numOfNullRecords = this.#getNumOfNullRecords(attrName);
		const portionOfNullRecords = parseInt(numOfNullRecords) / parseInt(this.#numOfRecords);
		const numOfDistinct = this.#getNumOfDistinct(attrName);
		return ({
			attrName,
			attrType,
			numOfNullRecords,
			portionOfNullRecords,
			numOfDistinct
		});
	};

	async #getNumOfNullRecords (attrName)
	{
		const result = await dbConnectQuery(this.#loginInfo, 
		`
		SELECT COUNT(*) 
		FROM ${this.#tableName}
		WHERE ${attrName} IS NULL;
		`);
		console.log("#of null records : ",result, "\n");
	};

	async #getNumOfDistinct (attrName)
	{
		const result = await dbConnectQuery(this.#loginInfo,
		`
		SELECT DISTINCT ${attrName}
		FROM ${this.#tableName};
		;
		`);
		console.log("#of distinct", result, "\n");
		return (result.length);
	};

	async #makeMinMax (fieldInfo)
	{
		const result = await dbConnectQuery(this.#loginInfo,
		`
		SELECT MAX(${fieldInfo}), MIN(${fieldInfo})
		FROM ${this.#tableName};
		`);
		console.log("minmax result : ", result, "\n");
		return (result[0]);
	};

	async #makeNumericScanObject (fieldInfo)
	{
		console.log("fieldinformation : ",fieldInfo);
		return ({
			...this.#makeCommonScanData(fieldInfo),
			...this.#makeMinMax(fieldInfo) 
		/*	numOfZero : ,
		 *	portionOfZero : 
		 */
		});
	};

	async #makeCategoryScanObject (fieldInfo)
	{
		console.log("fieldinformation : ",fieldInfo);
		const commonScanData = this.#makeCommonScanData(fieldInfo);
		return ({
			...commonScanData,
		/*	numOfSpcRecords : ,
		 *	portionOfSpcRecords : 
		 */
		});
	};

	async #setRepAttrJoinKey ()
	{
		const repAttr = await dbConnectQuery(getServerLoginInfo(), 
		`
		SELECT rattr_name
		FROM tb_rep_attribute;
		`);
		const repKey = await dbConnectQuery(getServerLoginInfo(),
		`
		SELECT rkey_name
		FROM tb_rep_key;
		`);
		this.#repAttrJoinKey = {
			repAttr,
			repKey
		};
	};

	async getResult ()
	{
		await this.#setNumOfRecords();
		console.log("set num of records", this.#numOfRecords);
		await this.#setNumeric();
		await this.#setCategory();
		await this.#setRepAttrJoinKey();
		return ({
			repAttrJoinKey : this.#repAttrJoinKey,
			numericResult : this.#numericResult,
			categoryResult : this.#categoryResult
		});
	};
};
