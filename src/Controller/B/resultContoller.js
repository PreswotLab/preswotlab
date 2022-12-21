import dbConnectQuery from "../Common/tools/user/dBConnectQuery"
import getServerLoginInfo from "../Common/tools/user/getServerLoginInfo";
import {getRepAttrs} from "../A/tools/editTable/getRepAttrs";
import {getRepKeys} from "../A/tools/editTable/getRepKeys";

let scanResult = {};
let singleResult = {};
let multiResult = {};

export const getResult = async (req, res) => {
    try {
        res.render('result', {scanResult, singleResult, multiResult});
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}

export const getScanResult = async (req, res) => {
    try {
        singleResult = {};
        multiResult = {};
        scanResult = {};

        scanResult = await dbConnectQuery(getServerLoginInfo(), `
            SELECT *
            FROM tb_scan
            WHERE scan_yn = 'Y' AND user_seq=${req.session.loginInfo.user_seq};
        `)

        for ( let i = 0 ; i < scanResult.length ; i++ ) {
            const attrNameList = await dbConnectQuery(getServerLoginInfo(), `
                SELECT attr_name, attr_type
                FROM tb_attribute
                WHERE table_seq = ${scanResult[i].table_seq};
            `);
            console.log("attrNameList");
            console.log(attrNameList);
            let numList = ``;
            let cateList = ``;

            for ( let j = 0 ; j < attrNameList.length ; j++  ) {
                if ( attrNameList[j].attr_type === 'N' ) {
                    numList += `${attrNameList[j].attr_name}, `;
                } else {
                    cateList += `${attrNameList[j].attr_name}, `;
                }
            }

            numList = numList.slice(0, -2);
            cateList = cateList.slice(0, -2);

            scanResult[i].numList = numList;
            scanResult[i].cateList = cateList;
        }

        console.log(scanResult);

        res.render('result', {scanResult, singleResult, multiResult});
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}

export const getScanDetail = async (req, res) => {
    const { tableName, tableSeq } = req.params;

    try {
        const detailResult = await dbConnectQuery(getServerLoginInfo(), `
            select
                tb.attr_seq,
                tb.table_seq,
                tb.table_name,
                tb.attr_name,
                tb.attr_type,
                tb.d_type,
                tb.null_num,
                tb.null_num / tb.row_num AS null_portion,
                tb.diff_num,
                tb.max_value,
                tb.min_value,
                tb.zero_num,
                tb.zero_num / tb.row_num AS zero_portion,
                tb.special_num,
                tb.special_num / tb.row_num AS special_portion,
                m.mapping_seq,
                tb.key_candidate,
                IFNULL(ra.rattr_name, '-') AS rattr_name,
                IFNULL(rk.rkey_name, '-') AS rkey_name
                from
                (select
                a.attr_seq,
                a.table_seq,
                sc.table_name,
                sc.row_num,
                a.attr_name,
                a.attr_type,
                a.d_type,
                a.null_num,
                a.diff_num,
                a.max_value,
                a.min_value,
                a.zero_num,
                a.special_num,
                a.rattr_seq,
                a.key_candidate
                from tb_attribute a
                inner join tb_scan sc 
                on a.table_seq = sc.table_seq
                WHERE sc.table_seq = '${tableSeq}'
                AND sc.scan_yn = 'Y') tb
                LEFT OUTER JOIN tb_rep_attribute ra on ra.rattr_seq = tb.rattr_seq
                LEFT OUTER JOIN tb_mapping m on m.attr_seq = tb.attr_seq
                AND m.chg_yn = 'N'
                LEFT OUTER JOIN tb_rep_key rk on rk.rkey_seq = m.rkey_seq;`
		);

        const numericResult = [];
        const categoryResult = [];
        for (let i = 0; i < detailResult.length; i++)
        {
            if (detailResult[i]['attr_type'] === 'C')
                categoryResult.push(detailResult[i]);
            else
                numericResult.push(detailResult[i]);
        }
        const repAttrJoinKey = {
            repAttrArray : await getRepAttrs(),
            repKeyArray : await getRepKeys()
        };
        res.render('result-scan-detail', { tableName, tableSeq, numericResult, categoryResult, repAttrJoinKey });

        res.render('result', {scanResult, singleResult, multiResult});
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}

export const getSingleResult = async (req, res) => {
    try {
        scanResult = {};
        multiResult = {};
        singleResult = {};

        singleResult = await dbConnectQuery(getServerLoginInfo(), `
            SELECT
                *
            FROM tb_join
                WHERE multi_yn = 'N';
        `);

        res.render('result', {scanResult, singleResult, multiResult});
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}

export const getMultiResult = async (req, res) => {
    try {
        scanResult = {};
        singleResult = {};
        multiResult = {};

        multiResult = await dbConnectQuery(req.session.loginInfo, `
            SELECT MAX(join_seq), a_table_name, a_attr_name, b_table_name, b_attr_name, a_count, b_count, rkey_name, result_count, success_rate_A, success_rate_B, state, view_name
            FROM SERVER.tb_join
            Where multi_yn = 'Y'
            GROUP BY a_table_seq, a_attr_seq, b_table_seq, b_attr_seq
        `);
        // res.render('multi-join-result', {joinInfo})

        res.render('result', {scanResult, singleResult, multiResult});
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}