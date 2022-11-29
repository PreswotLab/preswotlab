import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";

export class SaveMapping
{
	#tableName;
	#serverInfo

	#userSeq;
	#tableSeq;
	#attrSeqObj;
	#rAttrSeqObj;
	#rKeySeqObj;

	constructor(tableName, userSeq)
	{
		this.#tableName = tableName;
		this.#userSeq = userSeq;
		this.#serverInfo = getServerLoginInfo();
		this.#attrSeqObj = {};
		this.#rAttrSeqObj = {};
		this.#rKeySeqObj = {};
	};

	async init()
	{
		await this.#setTableSeq();
		await this.#setAttrSeqObj();
		await this.#setRattrSeqObj();
		await this.#setRkeySeqObj();
	}

	async save(mappingRep)
	{
		const keys = Object.keys(mappingRep);
		for (let i = 0; i < keys.length; i++)
		{
			if (mappingRep[keys[i]][0] != '-')
				await this.#saveRepAttrMapping(keys[i], mappingRep[keys[i]][0]);
			if (mappingRep[keys[i]][1] != '-')
				await this.#saveRepJoinKeyMapping(keys[i], mappingRep[keys[i]][1]);
		}
	}

	async #saveRepAttrMapping(attrName, mapAttrName)
	{
		const attr_seq = this.#attrSeqObj[attrName];
		const rattr_seq = this.#rAttrSeqObj[mapAttrName];
		await dbConnectQuery(this.#serverInfo,
		`
			UPDATE tb_attribute
			SET rattr_seq = ${rattr_seq}
			WHERE attr_seq = ${attr_seq};
		`);
	}

	async #saveRepJoinKeyMapping(attrName, mapAttrName)
	{
		const attr_seq = this.#attrSeqObj[attrName];
		const rkey_seq = this.#rKeySeqObj[mapAttrName];
		await dbConnectQuery(this.#serverInfo,
		`
			UPDATE tb_mapping
			SET rkey_seq = ${rkey_seq}, chg_yn = 'Y'
			WHERE 
			attr_seq = ${attr_seq} 
			AND table_seq = ${this.#tableSeq};
			;
		`)
	}

	async #setTableSeq()
	{
		const result = await dbConnectQuery(this.#serverInfo,
		`
			SELECT table_seq, table_name
			FROM tb_scan
			WHERE table_name = '${this.#tableName}'
			AND user_seq = ${this.#userSeq};
		`);
		this.#tableSeq = result[0]['table_seq'];
		console.log(result);
		console.log('tableSeq:', this.#tableSeq);
	}

	async #setAttrSeqObj()
	{
		const result = await dbConnectQuery(this.#serverInfo,
		`
			SELECT attr_seq, attr_name
			FROM tb_attribute
			WHERE table_seq = ${this.#tableSeq};
		`)
		console.log(
			"attrSeq, attrName : ", result
		)
		for (let i = 0; i < result.length; i++)
		{
			let attrName = result[i]['attr_name'];
			this.#attrSeqObj[attrName] = result[i]['attr_seq'];
		}
		console.log("attr seq obj: ",this.#attrSeqObj);
	}

	async #setRattrSeqObj()
	{
		const result = await dbConnectQuery(this.#serverInfo,
		`
			SELECT * FROM tb_rep_attribute;
		`);
		for (let i = 0; i < result.length; i++)
		{
			let rattr_name = result[i]['rattr_name'];
			this.#rAttrSeqObj[rattr_name] = result[i]['rattr_seq'];
		}
		console.log("rattr seq object:",this.#rAttrSeqObj);
	}

	async #setRkeySeqObj()
	{
		const result = await dbConnectQuery(this.#serverInfo,
		`
			SELECT * FROM tb_rep_key;
		`);
		for (let i = 0; i < result.length; i++)
		{
			let rkey_name = result[i]['rkey_name'];
			this.#rKeySeqObj[rkey_name] = result[i]['rkey_seq'];
		}
		console.log("rkey seq object: ",this.#rKeySeqObj);
	}

};
