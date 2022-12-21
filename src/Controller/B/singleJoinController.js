import {getRepAttrs} from "./tools/getRepAttrs";
import {getRepKeys} from "./tools/getRepKeys";
import {searchTable} from "./tools/searchTable";
import {sameRepKey} from "./tools/sameRepKey"
import {joinTable} from "./tools/joinTable";
import path from "path";

const fs = require('fs');
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

        searchResult = await searchTable(params);

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

        res.render('single-join', {repAttrJoinKey, searchResult, params, targetResult, sessionData})
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/logout');
    }
}

export const getSingleJoin = async (req, res) => {
    try {
        fs.mkdir(path.join(__dirname, '..', 'B', 'joinCSV'), (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
        });

        const loginInfo = req.session.loginInfo

        console.log("before joinTable");
        await joinTable(req, loginInfo);

        res.redirect(`/result/single?redirect=Y`);
//        res.render('single-join-result', {joinInfo});
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

