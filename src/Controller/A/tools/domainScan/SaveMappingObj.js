import dbConnectQuery from "../../../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../../../Common/tools/user/getServerLoginInfo";

export class SaveMapping
{
	#serverInfo

	#tableSeq;
	#attrSeqObj;
	#rAttrSeqObj;
	#rKeySeqObj;

	constructor(tableSeq)
	{
		this.#tableSeq = tableSeq;
		this.#serverInfo = getServerLoginInfo();
		this.#attrSeqObj = {};
		this.#rAttrSeqObj = {};
		this.#rKeySeqObj = {};
	};

	async init()
	{
		await this.#setAttrSeqObj();//현재 table_seq를 기준으로 {attr_name : attr_seq, ... }로 객체를 생성한다.
		await this.#setRattrSeqObj();//서버에 저장된 모든 {rattr_name : rattr_seq, ... }로 객체를 생성한다.
		await this.#setRkeySeqObj();//서버에 저장된 모든 {rkey_name : rkey_seq, ...}로 객체를 생성한다.
	}

	async save(mappingRep)
	{
		const keys = Object.keys(mappingRep);
		for (let i = 0; i < keys.length; i++)
		{
			await this.#saveRepAttrMapping(keys[i], mappingRep[keys[i]][0]);
			await this.#saveRepJoinKeyMapping(keys[i], mappingRep[keys[i]][1]);
		}
	}

	async #saveRepAttrMapping(attrName, mapAttrName)
	{
		const attr_seq = this.#attrSeqObj[attrName];
		let rattr_seq = this.#rAttrSeqObj[mapAttrName];
		if (mapAttrName == '-') //mapping하고자하는 속성값이 -인경우 null로 대체
			rattr_seq = null;
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
			WHERE attr_seq = ${attr_seq};
		`)
		if (mapAttrName != '-') //매핑하고자하는 대표 결합키가 -인경우 삽입X
			await dbConnectQuery(this.#serverInfo,
			`
				INSERT tb_mapping ( #새로 삽입
					rkey_seq, 
					attr_seq
				) VALUES (
					${rkey_seq},
					${attr_seq}
				);
			`)
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
	}

};
