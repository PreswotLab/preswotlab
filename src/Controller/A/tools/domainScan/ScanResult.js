import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";
import {getRepAttrs} from "../editTable/getRepAttrs";
import {getRepKeys} from "../editTable/getRepKeys";
import {extractObjects} from "./extractObjects";
import { getNumericScanObject } from "./getNumericScanObject";
import { getCategoryScanObject } from "./getCategoryScanObject";
import {getNumOfRecords} from "./getNumOfRecords";

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

	constructor (tableName, tableSeq, loginInfo) {
		this.#tableName = tableName;
		this.#loginInfo = loginInfo;
		this.#tableSeq = tableSeq;
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
		await this.#setNumOfRecords(); //현재 테이블의 전체 행 개수 세팅
		await this.#setNumeric(); //테이블 각 수치속성 scan
		await this.#setCategory();//테이블 각 범주속성 scan
		await this.#setRepAttrJoinKey();//서버
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
			FROM tb_join
			WHERE a_table_seq = ${this.#tableSeq} 
			OR b_table_seq = ${this.#tableSeq};
		`
		)

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
				'${this.#numericResult[i]['attrName'].toUpperCase()}',
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
				key_candidate,
				rattr_seq
				) VALUES (
				${this.#tableSeq},
				'${this.#categoryResult[i]['attrName'].toUpperCase()}',
				'C',
				"${this.#categoryResult[i]['attrType']}",
				${this.#categoryResult[i]['numOfNullRecords']},
				${this.#categoryResult[i]['numOfDistinct']},
				${this.#categoryResult[i]['numOfSpcRecords']},
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
				WHERE table_seq = '${this.#tableSeq}';
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
			rtn.push(await getNumericScanObject(this.#loginInfo, this.#tableName, result[i], this.#numOfRecords));
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
			rtn.push(await getCategoryScanObject(this.#loginInfo, this.#tableName, result[i], this.#numOfRecords));
		}
		this.#categoryResult = rtn;
	};

	async #setNumOfRecords () 
	{
		this.#numOfRecords = await getNumOfRecords(this.#loginInfo, this.#tableName);

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
};
