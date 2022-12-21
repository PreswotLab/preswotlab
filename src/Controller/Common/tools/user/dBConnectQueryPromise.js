// import getDbConfigByLoginInfo from "./getDbConfigByLoginInfo";

// const dbconfig = getDbConfigByLoginInfo(loginInfo);
// console.log(dbconfig);



const dBConnectQueryPromise = async(pool, queryParam) => {
	return new Promise((resolve, reject)=>{
        pool.query(queryParam, (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
}
export default dBConnectQueryPromise;
