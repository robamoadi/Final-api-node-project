const express = require('express')
const users_dal = require('../dals/users_dal')

const router = express.Router()

//main page
router.get('/', async (request, response) => {
    if (!request.cookies.auth) {
        response.status(200).redirect('./login.html')
        return
    }
    else {
        response.status(200).redirect('./questions.html')
        return
    }
})

router.post('/login_post' , async(request,response) =>{
    const {email , password} = request.body
    const result = await users_dal.try_login(email , password)
    console.log(result);
    if (result.status === 'success') {
        response.cookie('auth', `${email}_${result.id}_${result.first_name}`)
        response.status(200).redirect('./questions.html')
    }
    else {
        response.status(200).redirect(`./error_login.html?error=${result.status}`)
    }  
})

//submit post
router.post('/signup_post', async (request, response) => {
    const {first_name,last_name, email,  date_of_birth ,address , password } = request.body
    console.log(request.cookies);
    const new_user = {first_name,last_name, email,  date_of_birth ,address , password }
    const result = await users_dal.insert_user(new_user)
    if (result.status == "success") {
        //creating the cookie
        response.cookie('auth', `${email}_${result.data.id}`)
        response.redirect("./questions.html")
    }
    else {
        response.redirect('./error_signup.html')
    }
})

module.exports = router