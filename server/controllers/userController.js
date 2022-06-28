const mysql = require('mysql');
const { connect } = require('../routes/user');
//connect to mysql
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASSWORD,
    database        : process.env.DB_NAME
});

//view users
exports.view = (req, res) => {
    
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        console.log('Connected as ID'+connection.threadId);
        //use the connection
        connection.query('SELECT * FROM user WHERE status = "active"', (err, row)=>{
            connection.release();
            if(!err){
                let removedUser = req.query.removed;
                res.render('home',  {row, removedUser} );
            }else{
                console.log(err)
            }            
            console.log('The data from user table : \n', row);

        });
    });
}
//find user by search
exports.find = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        console.log('Connected as ID'+connection.threadId);

        let searchTerm = req.body.search;
        //use the connection
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?',['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, row)=>{
            connection.release();
            if(!err){
                res.render('home',  {row} );
            }else{
                console.log(err)
            }            
            console.log('The data from user table : \n', row);

        });
    });

}
exports.form = (req, res) => {
    res.render('add-user');
}
//add new user
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        console.log('Connected as ID'+connection.threadId);
        let searchTerm = req.body.search;
        //use the connection
        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?',[first_name, last_name, email, phone, comments], (err, row)=>{
            connection.release();
            if(!err){
                res.render('add-user',  { alert: 'User added' } );
            }else{
                console.log(err)
            }            
            console.log('The data from user table : \n', row);

        });
    });
}
//edit user
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        console.log('Connected as ID'+connection.threadId);
        //use the connection
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, row)=>{
            connection.release();
            if(!err){
                res.render('edit-user',  {row} );
            }else{
                console.log(err)
            }            
            console.log('The data from user table : \n', row);

        });
    });
}
//update user
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        console.log('Connected as ID'+connection.threadId);
        //use the connection
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?',[first_name, last_name, email, phone, comments, req.params.id], (err, row)=>{
            connection.release();
            if(!err){
                pool.getConnection((err, connection) => {
                    if (err) throw err; //not connected
                    console.log('Connected as ID'+connection.threadId);
                    //use the connection
                    connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, row)=>{
                        connection.release();
                        if(!err){
                            res.render('edit-user',  {row, alert: `${first_name} has been updated`} );
                        }else{
                            console.log(err)
                        }            
                        console.log('The data from user table : \n', row);
            
                    });
                });
            }else{
                console.log(err)
            }            
            console.log('The data from user table : \n', row);

        });
    });
}
//delete user
exports.delete = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        console.log('Connected as ID'+connection.threadId);
        //use the connection
        connection.query('UPDATE user SET status = ? WHERE id = ?',['removed',req.params.id], (err, row)=>{
            connection.release();
            if(!err){
                let removedUser = encodeURIComponent('User successfully removed')
                res.redirect('/?removed='+removedUser);
            }else{
                console.log(err)
            }            
            console.log('The data from user table : \n', row);

        });
    });
}
exports.viewAll = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        console.log('Connected as ID'+connection.threadId);
        //use the connection
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, row)=>{
            connection.release();
            if(!err){
                res.render('view-user',  {row} );
            }else{
                console.log(err)
            }            
            console.log('The data from user table : \n', row);

        });
    });
}