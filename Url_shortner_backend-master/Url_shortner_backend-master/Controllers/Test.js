const pool =require("../db")


const Test = async(req,res)=>{
    try {
      // Query all users from the 'users' table
      const result = await pool.query('SELECT * FROM users');
  
      // Send the result as JSON
      res.json(result.rows);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).send('Internal Server Error');
    }
  }

module.exports =Test