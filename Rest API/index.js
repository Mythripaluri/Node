const express = require("express");
const fs=require('fs');
const users=require('./MOCK_DATA.json');
const app = express();
const PORT=8000;

//MiddleWare routes
app.use(express.urlencoded({extended: false}));

// GET /api/users

app.get("/users",(req,res) =>{
    const html=`
    <ul>
    ${users.map((user) => `<li>${user.first_name} - ${user.email}</li>`).join("")}
    </ul>`;
    res.send(html)
});

//REST API
app.get("/api/users",(req,res) =>{
    return res.json(users);
});

app
   .route("/api/users/:id")
   .get((req,res) => {
        const id=Number(req.params.id);
        const user = user.find((user) => user.id===id);
        res.json(user);
    })
    // Add PATCH, DELETE methods here...
    .patch((req,res)=>{
           return res.json({status: "Pending"})
    })
    .delete((req,res)=>{
            return res.json({status: "Pending"});
    })
app.post("/api/users",(req,res)=>{
    const body=req.body;
    users.push({...body, id: users.length+1});
    fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users), (err,data)=>{
        return res.json({status: "success", id: users.length+1});
     });
    // console.log("Body",body);
    // return res.json({success})
    // users.push({...body, id: users.length+1});
    // fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users), (err,data)=>{
    //     return res.json({status: "success", id: users.length+1});
    // });
});


app.listen(PORT, () => console.log(`listening on port:${PORT}`));