const {request, response} = require('express');


const listUsers = (req = request,res = response) => {
    res.json({msg: "Hola usuario"})

}

module.exports = {listUsers};