import dbConnectQuery from "../user/dBConnectQuery";

export class ScanResult
{
	#tableName;
	#loginInfo;
	#numOfRecords;

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
		 /*	repAttr : ;
		 *	joinKeyCandidate: ;
		 *	repJoinKey : ;
			*/
	}

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
	}


	async #makeNumericScanObject (fieldInfo)
	{
		console.log("fieldinformation : ",fieldInfo);
		const commonScanData = this.#makeCommonScanData;
		return ({ 
			...commonScanData, 
		/*	max : ,
		 *	min : ,
		 *	numOfZero : ,
		 *	portionOfZero : 
		 */
		})
	};

	async #makeCategoryScanObject (fieldInfo)
	{
		console.log("fieldinformation : ",fieldInfo);
		const commonScanData = this.#makeCommonScanData;
		return ({
			...commonScanData,
		/*	numOfSpcRecords : ,
		 *	portionOfSpcRecords : 
		 */
		});
	}

	async getResult ()
	{
		await this.#setNumOfRecords();
		console.log("set num of records", this.#numOfRecords);
		await this.#setNumeric();
		await this.#setCategory();
		return ({
			numericResult : this.#numericResult,
			categoryResult : this.#categoryResult
		})
	}
}
