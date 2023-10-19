const { request, response } = require('express');
const usersModel = require('../models/users')
const pool = require('../db');

//endpoint---------------------------------------------------------------------------------------
const listUsers = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const users = await conn.query(usersModel.getAll, (err) =>{
            if(err){
                throw err
            }
        });
        
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}

//endpoint se utilizo el metodo params -----------------------------------------------------------
const listUserByID = async (req = request, res = response) => {
    const {id} = req.params;

    if (isNaN(id)){
        res.status(404).json({msg: 'Invalid ID'});
        return;
    }

    let conn;

    try {
        conn = await pool.getConnection();

        const [user] = await conn.query(usersModel.getByID, [id], (err) =>{
            if(err){
                throw err
            }
        });

        if (!user){
            res.status(404).json({msg:'User not found'});
            return;
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}

//se utiliza el metodo body para recibir parametros----------------------------------------------
 /**
     *  username: 'admin'
        email: 'admin@example.com'
        password: '123'
        name: 'Administrador'
        lastname: 'Del sitio'
        phone_number: '55555'
        role_id: '1'
        is_active: '1'
     */
const addUser = async (req = request, res = response)=>{
    
    const {
        username, 
        email, 
        password, 
        name, 
        lastname,
        phone_number = '',
        role_id,
        is_active = 1
    } =req.body;

if (!username || !email || !password || !name || !lastname || !role_id){
    res.status(400).json({msg: "Missing information"});
    return;
}

const user = [username, email, password, name, lastname, phone_number, role_id, is_active];
   
let conn ;

try{
    conn = await pool.getConnection();
//---------------------
    const [usernameUser] = await conn.query(
        usersModel.getByUsername,
        [username],
        (err)=>{if(err)throw err;}
    );
    if (usernameUser){
        res.status(409).json({msg: `User with username ${username} already exists`});
        return;
    }
//---------------------
    const [emailUser] = await conn.query(
        usersModel.getByEmail,
        [email],
        (err)=>{if(err)throw err;}
    );
    if (emailUser){
        res.status(409).json({msg: `User with username ${email} already exists`});
        return;
    }
//---------------------
    const userAdded = await conn.query(
        usersModel.addRow, 
        [...user], 
        (err)=>{if(err)throw err;
    });


    if (userAdded.affectecRows === 0)throw new Error ({message: 'Failed to add user'});
    res.json({msg: "User added successfully"});

}catch(error){
    console.log(error);
    res.status(500).json(error);
}finally{
    if (conn) conn.end();
}

/*
ENDPOINT 19/10/2023 =====================================================================================================
USERDELETED         =====================================================================================================
*/


}

const deleteUser = async ( req = request, res = response) => {
    let conn;
    const {id} = req.params;

    try {
       conn = await pool.getConnection(); 

       const [userExists] = await conn.query(
        usersModel.getByID,
        [id],
        (err) => { throw err; }
    )
    if(!userExists || userExists.is_active === 0){
        res.status(404).json({msg: 'user not found'});
        return;
    }

    const userDeleted = await conn.query(
        usersModel.deleteRow,
        [id],
        (err) => {if (err) throw err;}
    )

    if(userDeleted.affectedRows === 0){
        throw new Error({msg: 'User not found'})
    };
    

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}




module.exports = { listUsers, listUserByID, addUser, deleteUser };
