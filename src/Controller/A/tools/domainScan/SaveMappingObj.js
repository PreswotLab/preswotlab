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
		await this.#setTableSeq(); //user_seq를 가진 table_seq를 tb_scan에서 가져온다.
		await this.#setAttrSeqObj();//현재 table_seq를 기준으로 {attr_name : attr_seq, ... }로 객체를 생성한다.
		await this.#setRattrSeqObj();//서버에 저장된 모든 {rattr_name : rattr_seq, ... }로 객체를 생성한다.
		await this.#setRkeySeqObj();//서버에 저장된 모든 {rkey_name : rkey_seq, ...}로 객체를 생성한다.
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
		/*
		 * tb_mapping에서 기존 정보를 업데이트해야한다.
		 *
		 * */
		const attr_seq = this.#attrSeqObj[attrName];
		const rkey_seq = this.#rKeySeqObj[mapAttrName];
		await dbConnectQuery(this.#serverInfo,
		`
			UPDATE tb_mapping
			SET chg_yn = 'Y' #기존에 현재 테이블과 속성을 매핑하는 튜플을 'Y'로 변경.
			WHERE 
			attr_seq = ${attr_seq}
			AND table_seq = ${this.#tableSeq};
		`)
		await dbConnectQuery(this.#serverInfo,
		`
			INSERT tb_mapping ( #새로 삽입
				rkey_seq, 
				attr_seq,
				table_seq
			) VALUES (
				${rkey_seq},
				${attr_seq},
				${this.#tableSeq}
			);
		`)
	}

	async #setTableSeq()
	{
		const result = await dbConnectQuery(this.#serverInfo,
		`
			SELECT table_seq
			FROM tb_scan
			WHERE table_name = '${this.#tableName}'
			AND user_seq = ${this.#userSeq};
		`);
		this.#tableSeq = result[0]['table_seq'];
	}

	async #setAttrSeqObj()
	{
		const result = await dbConnectQuery(this.#serverInfo,
		`
			SELECT attr_seq, attr_name
			FROM tb_attribute
			WHERE table_seq = ${this.#tableSeq};
		`)
		for (let i = 0; i < result.length; i++)
		{
			let attrName = result[i]['attr_name'];
			this.#attrSeqObj[attrName] = result[i]['attr_seq'];
		}
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
