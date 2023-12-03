const pool = require('../db')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const Signup = async(req,res)=>{
    const {email,password} = req.body
    const hash_password = await bcrypt.hash(password,1)

    try {
      
      // need to check if user already exits or not let me write that at the end 

      const result = await pool.query(
        'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *',
        [email, hash_password]
      );
        console.log(result);
        res.json("user created sucessfully");
      } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
      }
    
}


const Signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rowCount === 1) {
      const hashedPasswordFromDatabase = userResult.rows[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPasswordFromDatabase);
      
      if (passwordMatch) {
        const id =  userResult.rows[0].id;
        const token = jwt.sign({ email }, 'five'); 

        res.status(200).json({ token,id,message: "User authentication successful" });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
};



module.exports = {Signup,Signin}