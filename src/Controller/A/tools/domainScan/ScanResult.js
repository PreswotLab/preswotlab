import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";
import {getRepAttrs} from "../editTable/getRepAttrs";
import {getRepKeys} from "../editTable/getRepKeys";
import {extractObjects} from "./extractObjects";
import {getCommonScanData} from "./getCommonScanData";
import {getGeneralChrNum} from "./getGeneralChrNum";
import {makeMinMax} from "./getMinMax";
import {getNumOfDistinct} from "./getNumOfDistinct";
import {getNumOfNullRecords} from "./getNumOfNullRecords";
import {getNumOfZero} from "./getNumOfZero";
import {getNumPortionSpcRecords} from "./getSpcRecords";

export class ScanResult
{
	#tableName;
	#loginInfo;
	#numOfRecords;
	#serverLoginInfo;
	#tableSeq;

	#repAttrJoinKey;
	#numericResult;
	#categoryResult;

	constructor (tableName, loginInfo) {
		this.#tableName = tableName;
		this.#loginInfo = loginInfo;
		this.#serverLoginInfo = getServerLoginInfo();
		this.#numOfRecords = null;
		this.#numericResult = null;
		this.#categoryResult = null;
	}

	/*
	 * repAttrJoinKey : API 요청당 1번만
	 * numericResult : API 요청 1번 -> 테이블 내의 모든 속성에 대해 요청
	 * categoryResult : API 요청 1번 -> 테이블 내의 모든 속성에 대해 요청
	 *
	 * */
	async getResult ()
	{
		//사용자 DB로부터 서버DB에 저장할 데이터를 객체 내부에 저장한다.
		await this.#setTableSeq();//tableSeq 세팅
		await this.#setNumOfRecords(); //현재 테이블의 전체 행 개수 세팅
		await this.#setRepAttrJoinKey();
		await this.#setNumeric(); //테이블 각 수치속성 scan
		await this.#setCategory();//테이블 각 범주속성 scan
		return ({
			repAttrJoinKey : this.#repAttrJoinKey,
			numericResult : this.#numericResult,
			categoryResult : this.#categoryResult
		});
	};

	async saveResult()
	{
		await this.#delExistMappingAndAttribute(); //이전에 스캔한 결과를 모두 삭제한다.
		await this.#saveNumericResult(); //객체에 저장된 수치속성 스캔결과를 서버에 저장한다.
		await this.#saveCategoryResult(); //객체의 범주속성 스캔결과를 서버에 서장.
		await this.#update_tb_scan_yn(); //테이블의 스캔 여부를 업데이트한다.
	};

	//이전에 스캔했던 결과를 모두 삭제.
	async #delExistMappingAndAttribute()
	{
		await dbConnectQuery(this.#serverLoginInfo,
		`
			DELETE
			FROM tb_mapping
			WHERE attr_seq IN (
				SELECT attr_seq
				FROM tb_attribute a 
				WHERE a.table_seq = ${this.#tableSeq}
			); 
		`);

		await dbConnectQuery(this.#serverLoginInfo,
		`
			DELETE 
			FROM tb_attribute
			WHERE table_seq = ${this.#tableSeq};
		`);
	}

	async #saveNumericResult()
	{
		for (let i = 0; i < this.#numericResult.length; i++)
		{
			await dbConnectQuery(this.#serverLoginInfo,
			`
				INSERT INTO tb_attribute (
				table_seq,
				attr_name,
				attr_type,
				d_type,
				null_num,
				diff_num,
				max_value,
				min_value,
				zero_num,
				key_candidate,
				rattr_seq
				) VALUES (
				${this.#tableSeq},
				'${this.#numericResult[i]['attrName']}',
				'N',
				'${this.#numericResult[i]['attrType']}',
				${this.#numericResult[i]['numOfNullRecords']},
				${this.#numericResult[i]['numOfDistinct']},
				${this.#numericResult[i]['max']},
				${this.#numericResult[i]['min']},
				${this.#numericResult[i]['numOfZero']},
				'${this.#numericResult[i]['recommended']}',
				NULL
				);
			`);
		}
	}

	async #saveCategoryResult()
	{
		for (let i = 0; i < this.#categoryResult.length; i++)
		{
			await dbConnectQuery(this.#serverLoginInfo,
			`
				INSERT INTO tb_attribute (
				table_seq,
				attr_name,
				attr_type,
				d_type,
				null_num,
				diff_num,
				special_num,
				general_chr_num,
				key_candidate,
				rattr_seq
				) VALUES (
				${this.#tableSeq},
				'${this.#categoryResult[i]['attrName']}',
				'C',
				"${this.#categoryResult[i]['attrType']}",
				${this.#categoryResult[i]['numOfNullRecords']},
				${this.#categoryResult[i]['numOfDistinct']},
				${this.#categoryResult[i]['numOfSpcRecords']},
				${this.#categoryResult[i]['numOfGenChrRecords']},
				'${this.#categoryResult[i]['recommended']}',
				NULL
				);
			`);

		}
	}

	async #update_tb_scan_yn()
	{
		await dbConnectQuery(this.#serverLoginInfo, 
			`
				UPDATE tb_scan
				SET scan_yn = 'Y'
				WHERE user_seq = ${this.#loginInfo.user_seq}
				AND table_name = '${this.#tableName}';
			`);
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
		OR TYPE LIKE '%set%'
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

	async #setTableSeq ()
	{
		const result_1 = await dbConnectQuery(this.#serverLoginInfo,
		`
			SELECT table_seq
			FROM tb_scan
			WHERE user_seq = '${this.#loginInfo.user_seq}'
			AND table_name = '${this.#tableName}'; 
		`);

		this.#tableSeq = result_1[0]['table_seq'];
	}

	async #setNumOfRecords () 
	{
		const result_2 = await dbConnectQuery(this.#loginInfo, 
		`
		SELECT *
		FROM ${this.#tableName};
		`);
		this.#numOfRecords = parseInt(result_2.length);

		await dbConnectQuery(this.#serverLoginInfo, 
		`
		UPDATE tb_scan
		SET row_num = ${this.#numOfRecords}
		WHERE table_seq = ${this.#tableSeq};
		`)
	}

	async #setRepAttrJoinKey ()
	{
		const repAttrResult =  await getRepAttrs();
		const repKeyResult = await getRepKeys();

		this.#repAttrJoinKey = {
			repAttrArray : extractObjects(repAttrResult, 'rattr_name'),
			repKeyArray : extractObjects(repKeyResult, 'rkey_name')

		};
	};

	async #makeNumericScanObject (fieldInfo)
	{
		return ({
			... await getCommonScanData(this.#loginInfo, this.#tableName, fieldInfo, this.#numOfRecords),
			... await makeMinMax(this.#loginInfo, this.#tableName, fieldInfo.Field),
			... await getNumOfZero(this.#loginInfo, this.#tableName, fieldInfo.Field, this.#numOfRecords)
		});
	};

	async #makeCategoryScanObject (fieldInfo)
	{
		return ({
			... await getCommonScanData(this.#loginInfo, this.#tableName, fieldInfo, this.#numOfRecords),
			... await getNumPortionSpcRecords(this.#loginInfo, this.#tableName, fieldInfo.Field, this.#numOfRecords),
			... await getGeneralChrNum(this.#loginInfo, this.#tableName, fieldInfo.Field)
		});
	};
};
