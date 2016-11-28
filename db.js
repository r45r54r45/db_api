function query(queryString, param){
    return new Promise(function(resolve, reject){
        var mysql=require('mysql');
        // var connection = mysql.createConnection({
        //     host     : 'localhost',
        //     user     : 'root',
        //     password : '',
        //     database: 'db'
        // });
        var connection = mysql.createConnection({
            host     : '104.198.26.254',
            user     : 'root',
            password : '',
            database: 'db'
        });

        connection.connect();
        if(param){
            connection.query(queryString, param,function(err, rows, fields) {
                if (err){
                    reject(err);
                }
                resolve(rows);
            });
        }else{
            connection.query(queryString, function(err, rows, fields) {
                if (err){
                    reject(err);
                }
                resolve(rows);
            });
        }
        connection.end();
    })
}
module.exports=query;