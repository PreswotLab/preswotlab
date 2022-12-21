import dbConnectQuery from "../Common/tools/user/dBConnectQuery";
import {getRepAttrs} from "./tools/getRepAttrs";
import {getRepKeys} from "./tools/getRepKeys";
import {searchTable} from "./tools/searchTable";
import {sameRepKey} from "./tools/sameRepKey"
import {joinTableMulti} from "./tools/joinTableMulti";
import path from "path";

const fs = require('fs');
let repAttrJoinKey;
let searchResult;
let params;


export const getMultiSearchForm = async (req, res) => {
    try {
        repAttrJoinKey = {
            repAttrArray : await getRepAttrs(),
            repKeyArray : await getRepKeys()
        };

        // console.log(repAttrJoinKey);

        params = {
            tableName : req.query.tableName === undefined ? '' : req.query.tableName,
            repKeySeq : req.query.repKeySeq === undefined ? '' : req.query.repKeySeq,
            repAttrSeq : req.query.repAttrSeq === undefined ? '' : req.query.repAttrSeq,
            attrName : req.query.attrName === undefined ? '' : req.query.attrName
        };

        searchResult = await searchTable(params);
        
        // console.log(params);
        // console.log("searchResult : \n" + searchResult);

        const targetResult = {};
        const sessionData = {};

        res.render('multi-join', {repAttrJoinKey, searchResult, params, targetResult, sessionData});
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}


export const getMultiPossibleResult = async (req, res) => {
    try {
        const parameters = {
            tableSeq : req.query.table_seq,
            repKeySeq : req.query.rkey_seq
        }

        const sessionData = {
            'tableNameA' : req.query.table_name,
            'tableSeqA' : req.query.table_seq,
            'attrNameA' : req.query.attr_name,
            'attrSeqA' : req.query.attr_seq
        }
        
        const targetResult = await sameRepKey(parameters);
        
        // console.log(sessionData);
        // console.log(targetResult.toString());

        res.render('multi-join', {repAttrJoinKey, searchResult, params, targetResult, sessionData})
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}


export const getMultiJoin = async (req, res) => {
    try {
        console.log("start multi join");
        console.log(req.body); 

        fs.mkdir(path.join(__dirname, '..', 'B', 'multiJoinCSV'), (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
        });
        
        if(Object.keys(req.body).length === 0) {
            console.log('empty');
        } else {
            const checkedSeqB = typeof req.body.multiCheck === 'string' ? [req.body.multiCheck] : req.body.multiCheck;
            const tableNameA = typeof req.body.tableNameA === 'string' ? req.body.tableNameA : req.body.tableNameA[0];
            const tableSeqA = typeof req.body.tableSeqA === 'string' ? req.body.tableSeqA : req.body.tableSeqA[0];
            const attrNameA = typeof req.body.attrNameA === 'string' ? req.body.attrNameA : req.body.attrNameA[0];
            const attrSeqA = typeof req.body.attrSeqA === 'string' ? req.body.attrSeqA : req.body.attrSeqA[0];
            const tableSeqB = typeof req.body.tableSeqB === 'string' ? [req.body.tableSeqB] : req.body.tableSeqB;
            const tableNameB = typeof req.body.tableNameB === 'string' ? [req.body.tableNameB] : req.body.tableNameB;
            const attrSeqB = typeof req.body.attrSeqB === 'string' ? [req.body.attrSeqB] : req.body.attrSeqB;
            const attrNameB = typeof req.body.attrNameB === 'string' ? [req.body.attrNameB] : req.body.attrNameB;
            const rkeySeq = typeof req.body.rkeySeq === 'string' ? [req.body.rkeySeq] : req.body.rkeySeq;

            const sessionData = {
                'tableNameA' : tableNameA,
                'tableSeqA' : tableSeqA,
                'attrNameA' : attrNameA,
                'attrSeqA' : attrSeqA
            }

            let ind;
            let tmp;
            let merged;      
            const loginInfo = req.session.loginInfo
            let joinInfo = []
            

            console.log("######## start ######## ");
            for (const i of checkedSeqB) {
                ind = req.body.tableSeqB.indexOf(i);
                tmp = {
                    'tableNameB' : tableNameB[ind],
                    'tableSeqB' : tableSeqB[ind],
                    'attrSeqB' : attrSeqB[ind],
                    'attrNameB' : attrNameB[ind],
                    'rkeySeq' : rkeySeq[ind]
                }
                merged = {...sessionData, ...tmp}
                console.log("merged");
                console.log(merged);
                joinInfo.push(joinTableMulti(merged, loginInfo));
            }

            console.log(joinInfo);
            console.log("######## end ######## ");
        }

        res.redirect(`/result/multi?redirect=Y`);
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}
// resultController로 이동

// export const getMultiJoinResult = async (req, res) => {
//     const joinInfo = await dbConnectQuery(req.session.loginInfo, `
//         SELECT MAX(join_seq), a_table_name, a_attr_name, b_table_name, b_attr_name, a_count, b_count, rkey_name, result_count, success_rate_A, success_rate_B, state, view_name
//         FROM SERVER.tb_join
//         Where multi_yn = 'Y'
//         GROUP BY a_table_seq, a_attr_seq, b_table_seq, b_attr_seq
//     `);
//     res.render('multi-join-result', {joinInfo})
// }
