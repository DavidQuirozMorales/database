const {Router} = require('express');
const {listUsers, listUserByID, addUser,updateUser, deleteUser} = require ('../controllers/users')

const router = Router();

//http://localhost:3000/api/v1/users/??
router.get('/',listUsers);
//se coloca dos puntos porque id es un valor variable
router.get('/:id',listUserByID);
//router.post('/',listUsers);
router.put('/',addUser);
router.patch('/:id',updateUser);
router.delete('/:id',deleteUser);

module.exports= router;