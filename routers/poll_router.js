const express = require("express")
const poll_dal = require("../dals/poll_dal")

const router = express.Router()

router.post('', async (request, response) => {
    //console.log(request.cookie);
    console.log(request.body);
    const {selected_answer , question_id}= request.body
    const user_id = request.cookies.auth.split('_')[1]
    const date = new Date()
    const formattedTimestamp = date.toISOString();
    const new_poll = {user_id : user_id,question_id: question_id , date_time: formattedTimestamp , selected_answer : selected_answer }
    const result = await poll_dal.insert_poll(new_poll)
    if (result.status === "success") {
        response.status(201).json({ new_poll: result.data })
    }
    else if (result.error.includes("duplicate key value")) {
        response.status(400).json({ error: result.error.split("-")[1] })
    }
    else {
        response.status(500).json({ error: "Internal error. please contact support " })
    }
})

router.post('/table/poll-create-table', async (request, response) => {
    const result = await poll_dal.create_table_poll()
    if (result.status === "sucess") {
        response.status(201).json({ status: "table-created" })
    }
    else if (result.error.includes("already exist")) {
        response.status(400).json({ status: result.status, error: result.error })
    }
    else {
        response.status(500).json({ status: result.status, error: `Internal error. please contact support ` })
    }
})

router.delete('/table/poll-delete-table', async (request, response) => {
    const result = await poll_dal.delete_table_poll()
    if (result.status === "success") {
        response.status(200).json({ status: "table-deleted" })  
      }
      else if (result.error.includes("does not exist")) {
          response.status(400).json({status : `${result.error}`})
      }
      else{
          response.status(500).json({ error : "Internal error. please contact support " })
      }
})

module.exports = router