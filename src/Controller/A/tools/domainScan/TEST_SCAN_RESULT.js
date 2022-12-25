import getDbConfigByLoginInfo from '../../../Common/tools/user/getDbConfigByLoginInfo';
import getServerLoginInfo from '../../../Common/tools/user/getServerLoginInfo';
import {queryByDbConnObj} from '../../../Common/tools/user/queryByConnObj';
import {getRepAttrsByConn} from '../editTable/getRepAttrs';
import {getRepKeysByConn} from '../editTable/getRepKeys';
import {extractObjects} from './extractObjects';
import {getCategoryScanObjectByConn} from './getCategoryScanObject';
import {getNumericScanObjectByConn} from './getNumericScanObject';
import {getNumOfRecordsByConn} from './getNumOfRecords';

const mariadb = require('mariadb')

export const test_scan = async (req) => {
	const rtn = {};
	const { tableName, tableSeq } = req.params;
	const { loginInfo } = req.session;
	let numOfRecords;
	const numericResult = [];
	const categoryResult = [];

	console.log("userconn")
	const userConn = await mariadb.createConnection(
	getDbConfigByLoginInfo(loginInfo)
	);
	try {

		//table 개수 확인
		numOfRecords = await getNumOfRecordsByConn(userConn, tableName);

		//setNumeric
		console.log("setnumeric")
		const numericColumns = await userConn.query(
			`
			SHOW COLUMNS from ${tableName} 
			WHERE TYPE LIKE '%int%' 
			OR TYPE LIKE 'double%' 
			OR TYPE LIKE 'float%'
			OR TYPE LIKE 'boolean'
			OR TYPE LIKE 'bit'
			OR TYPE LIKE 'decimal';
			`
		);
		for (let i = 0; i < numericColumns.length; i++)
		{
			numericResult.push(await getNumericScanObjectByConn(userConn, tableName, numericColumns[i], numOfRecords));
		}

		//setcategory
		console.log("setcategory")
		const categoryColumns = await userConn.query(
		`
		SHOW COLUMNS from ${tableName} 
		WHERE TYPE LIKE '%char%' 
		OR TYPE LIKE '%text%' 
		OR TYPE LIKE '%date%'
		OR TYPE LIKE '%set%'
		OR TYPE LIKE '%time%'
		OR TYPE LIKE 'binary'
		OR TYPE LIKE 'enum';
		`
		)
		for (let i = 0; i < categoryColumns.length; i++)
		{ 
			categoryResult.push(await getCategoryScanObjectByConn(userConn, tableName, categoryColumns[i], numOfRecords));
		}
	} catch (e) {
		console.log(e);
		throw(e);
	} finally {
		await userConn.end();
	}

	console.log("serverconn")
	const serverConn = await mariadb.createConnection(
		getDbConfigByLoginInfo(getServerLoginInfo())
	);
	try {

		//setRepattrjoinkey
		console.log("setrep")
		const repAttrResult = await getRepAttrsByConn(serverConn);
		const repKeyResult = await getRepKeysByConn(serverConn);
		const repAttrJoinKey = {
			repAttrArray : extractObjects(repAttrResult, 'rattr_name'),
			repKeyArray : extractObjects(repKeyResult, 'rkey_name')
		}
		rtn['repAttrJoinKey'] = repAttrJoinKey;
		rtn['numericResult'] = numericResult;
		rtn['categoryResult'] = categoryResult;

		////saveResult

		//tb_scan rownum 업데이트
		await serverConn.query(`
			UPDATE tb_scan
			SET row_num = ${numOfRecords}
			WHERE table_seq = ${tableSeq};
		`)
		//1.delExistMappingAndAttribute
		console.log("serverconn")
		await queryByDbConnObj(serverConn,
		`
			DELETE
			FROM tb_mapping
			WHERE attr_seq IN (
				SELECT attr_seq
				FROM tb_attribute a 
				WHERE a.table_seq = ${tableSeq}
			); 
		`);

		await queryByDbConnObj(serverConn,
		`
			DELETE 
			FROM tb_attribute
			WHERE table_seq = ${tableSeq};
		`);
		//2.saveNumericResult
		for (let i = 0; i < numericResult.length; i++)
		{
			await queryByDbConnObj(serverConn,
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
				${tableSeq},
				'${numericResult[i]['attrName']}',
				'N',
				'${numericResult[i]['attrType']}',
				${numericResult[i]['numOfNullRecords']},
				${numericResult[i]['numOfDistinct']},
				${numericResult[i]['max']},
				${numericResult[i]['min']},
				${numericResult[i]['numOfZero']},
				'${numericResult[i]['recommended']}',
				NULL
				);
			`);
		}
		//3.saveCategoryResult
		for (let i = 0; i < categoryResult.length; i++)
		{
			await queryByDbConnObj(serverConn,
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
				${tableSeq},
				'${categoryResult[i]['attrName']}',
				'C',
				"${categoryResult[i]['attrType']}",
				${categoryResult[i]['numOfNullRecords']},
				${categoryResult[i]['numOfDistinct']},
				${categoryResult[i]['numOfSpcRecords']},
				'${categoryResult[i]['recommended']}',
				NULL
				);
			`);
		}
		//4.update_tb_scan_yn
		await queryByDbConnObj(serverConn,
			`  
				UPDATE tb_scan
				SET scan_yn = 'Y'
				WHERE table_seq = '${tableSeq}';
			`);
		console.log("end")
	} catch (e) {
		console.log(e);
		throw(e);
	} finally {
		serverConn.end();
	}
	return (rtn);
}
