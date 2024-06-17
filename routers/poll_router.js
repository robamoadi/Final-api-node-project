const express = require("express")
const poll_dal = require("../dals/poll_dal")

const router = express.Router()

router.post('', async (request, response) => {
    //console.log(request.cookie);
    console.log(request.body);
    const { selected_answer, question_id } = request.body
    const user_id = request.cookies.auth.split('_')[1]
    const date = new Date()
    const formattedTimestamp = date.toISOString();
    const new_poll = { user_id: user_id, question_id: question_id, date_time: formattedTimestamp, selected_answer: selected_answer }
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
    if (result.status === "success") {
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
        response.status(400).json({ status: `${result.error}` })
    }
    else {
        response.status(500).json({ error: "Internal error. please contact support " })
    }
})

//poll statistics

//question_answer statistic
router.get('/user_answer/:id', async (request, response) => {
    const id = request.params.id;
    const result = await poll_dal.question_answer(id);
    if (result.status === "success") {
        response.status(200).json(result.data);
    } else if (result.status === "failed" && result.message === "user didnt answer the question") {
        response.status(400).json(result.message);
    } else if (result.status === "failed" && result.message === "question doesnt exisit") {
        response.status(400).json(result.message);
    } else if (result.status === "failed" && result.error.includes("invalid input syntax for type integer")) {
        response.status(400).json({ message: `${id} is not a valid question ID` });
    } else {
        response.status(500).json({ error: "Internal error. Please contact support." });
    }
});

//question_user_count statistic
router.get('/user_count/:id', async (request, response) => {
    const id = request.params.id
    const result = await poll_dal.question_user_count(id)
    if (result.status === "success") {
        response.status(200).json(result.data);
    } else if (result.status === "failed" && result.message === "no user answered the question") {
        response.status(400).json(result.message);
    } else if (result.status === "failed" && result.message === "no such question") {
        response.status(400).json(result.message);
    } else if (result.status === "failed" && result.error.includes("invalid input syntax for type integer")) {
        response.status(400).json({ message: `${id} is not a valid question ID` });
    } else {
        response.status(500).json({ error: "Internal error. Please contact support." });
    }
})

//user_name_answer statistic
router.get('/user_name_answer/:id', async (request, response) => {
    const id = request.params.id
    const result = await poll_dal.user_name_answer(id)
    if (result.status === "success") {
        response.status(200).json(result.data);
    } else if (result.status === "failed" && result.message === "user didnt answer any question") {
        response.status(400).json(result.message);
    } else if (result.status === "failed" && result.message === "user doesnt exisit") {
        response.status(400).json(result.message);
    } else if (result.status === "failed" && result.error.includes("invalid input syntax for type integer")) {
        response.status(400).json({ message: `${id} is not a valid user ID` });
    } else {
        response.status(500).json({ error: "Internal error. Please contact support." });
    }
})

//user_question statistic
router.get('/user_name_question/:id', async (request, response) => {
    const id = request.params.id
    const result = await poll_dal.user_question(id)
    console.log(result);
    if (result.status === "success") {
        response.status(200).json(result.data);
    } else if (result.status === "failed" && result.message === "user didnt answer any question") {
        response.status(400).json(result.message);
    } else if (result.status === "failed" && result.message === "user doesnt exisit") {
        response.status(400).json(result.message);
    } else if (result.status === "failed" && result.error.includes("invalid input syntax for type integer")) {
        response.status(400).json({ message: `${id} is not a valid user ID` });
    } else {
        response.status(500).json({ error: "Internal error. Please contact support." });
    }
})

//all_questions statistic
router.get('/get/all_questions', async (request, response) => {
    const result = await poll_dal.all_questions()
    if (result.status === "success") {
        response.status(200).json(result.data ? result.data : []);
    } else {
        response.status(500).json({ error: "Internal error. please contact support " });
    }
})

router.get('/check_questions/:id', async (request, response) => {
    const id = request.params.id;
    const result = await poll_dal.checkUnansweredQuestions(id);
    console.log(result);
    if (result.status === "success") {
        response.status(200).json(result.data);
    } else if (result.status === "failed" && result.message === "User has answered all questions.") {
        response.status(404).json({ message: result.message });
    } else if (result.status === "failed" && result.error === "User doesn't exist") {
        response.status(404).json({ error: result.error });
    } else if (result.error.includes("invalid input syntax for type integer")) {
        response.status(400).json({ error: "invalid id number" });
    } else {
        response.status(500).json({ error: "Internal error. please contact support " });
    }
});

module.exports = router