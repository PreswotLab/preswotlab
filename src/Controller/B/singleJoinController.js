import {Parser} from "json2csv";
import dbConnectQuery from "../Common/tools/user/dBConnectQuery";
import getServerLoginInfo from "../Common/tools/user/getServerLoginInfo";
import {getRepAttrs} from "./tools/getRepAttrs";
import {getRepKeys} from "./tools/getRepKeys";
import {searchTable} from "./tools/searchTable";
import {sameRepKey} from "./tools/sameRepKey"
import {joinTable} from "./tools/joinTable";

let repAttrJoinKey;
let searchResult;
let params;

export const getSearchForm = async (req, res) => {
    try {
        repAttrJoinKey = {
            repAttrArray : await getRepAttrs(),
            repKeyArray : await getRepKeys()
        };

        params = {
            tableName : req.query.tableName === undefined ? '' : req.query.tableName,
            repKeySeq : req.query.repKeySeq === undefined ? '' : req.query.repKeySeq,
            repAttrSeq : req.query.repAttrSeq === undefined ? '' : req.query.repAttrSeq,
            attrName : req.query.attrName === undefined ? '' : req.query.attrName
        };

        console.log(params);

        searchResult = await searchTable(params);

        console.log("searchResult : \n" + searchResult);
        const targetResult = {};
        const sessionData = {};

        res.render('single-join', {repAttrJoinKey, searchResult, params, targetResult, sessionData});
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}

export const getPossibleResult = async (req, res) => {
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

        console.log(targetResult.toString());
        res.render('single-join', {repAttrJoinKey, searchResult, params, targetResult, sessionData})
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}

export const getSingleJoin = async (req, res) => {
    try {
        console.log("Let's Do single Join!!!");
        console.log(req.body);
        const joinInfo = await joinTable(req.body);

        res.render('single-join-result', {joinInfo});
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}

//
// export const searchTable = async (req, res) => {
//     const loginInfo = req.session.loginInfo;
//
//
//     res.render('search-form', {repAttrJoinKey})
//
// }

