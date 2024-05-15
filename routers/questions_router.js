const express = require("express")
const questions_dal = require("../dals/questions_dal")

const router = express.Router()

/**
*  @swagger
*  components:
*     schemas:
*       question:
*         type: object
*         required:
*           - id
*           - question_title
*           - first_answer
*           - second_answer
*           - third_answer
*           - fourth_answer
*         properties:
*           id:
*             type: number
*             description: The auto-generated id of the questions.
*           question_title:
*             type: string
*             description: The title of the questions.
*           first_answer:
*             type: number
*             description: first_answer
*           second_answer:
*             type: string
*             description: second_answer
*           third_answer:
*             type: number
*             description: third_answer
*           fourth_answer:
*             type: number
*             description: fourth_answer
*         example:
*           question_title: Where is your preferred place to travel($1$2)",
*           first_answer: Thailand ,
*           second_answer: Brazil,
*           third_answer: Israel,
*           fourth_answer: Spain
*/


// '/api/questions'
// GET 
/**
*  @swagger
*   /api/questions/:
*     get:
*       summary: List all of the questions
*       responses:
*         "200":
*           description: The list of questions.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/questions'
*/

router.get('', async (request, response) => {
    const result = await questions_dal.get_all_questions()
    if (result.status === "success") {
        response.status(200).json(result.data)
    }
    else {
        response.status(500).json({ status: result.status, error: "Internal error. please contact support " })
    }
})

// GET by ID
/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     description: Retrieve question details based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the question to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the question details.
 *         content:
 *           application/json:
 *             example:
 *               ID: 1
 *               question_title: what you like to do on your spare time?
 *               first_answer: travel
 *               second_answer: reading books
 *               third_answer: surfing
 *               fourth_answer: riding horses
 *       404:
 *         description: question not found with the specified ID.
 *         content:
 *           application/json:
 *             example:
 *               error: cannot find question with id {id}
 */

router.get('/:id', async (request, response) => {
    const id = request.params.id
    const result = await questions_dal.get_question_by_id(id)
    if(id == 0 ){
        response.status(400).json({error : "no such question"})
    }
    else if (result.status === "success") {
        response.status(200).json(result.data ? result.data : {})
    }
     
    else if (result.error.includes("does not exist")) {
         response.status(400).json({ student: `${id} not a number` })
    }
    else{
        response.status(500).json({ error : "Internal error. please contact support " })
    }
})

router.post('', async (request, response) => {
    const new_question = request.body
    const result = await questions_dal.insert_question(new_question)
    if (result.status === "success") {
        response.status(201).json({ new_question: result.data, url: `/api/questions/${result.data.id}` })
    }
    else if (result.error.includes("duplicate key value")) {
        response.status(400).json({ error : result.error.split("-")[1] })
    }
    else{
        response.status(500).json({ error : "Internal error. please contact support " })
    }
})

router.patch('/:id', async (request, response) => {
    const id = request.params.id
    const updated_question = request.body
    const result = await questions_dal.patch_question(id, updated_question)
    if (id == 0) {
        response.status(400).json({ result: "question not found" })
    }
    else if (result.status === "success") {
        response.status(200).json({ result: result.data ? "question updated" : "question not found" })  
    }
    else if(result.error.includes("duplicate key value")){
        response.status(400).json({ error : result.error.split("-")[1]  })
    }
    else if(result.error.includes("does not exist")){
        response.status(400).json({ student: `${id} not a number` })
    }
    else {
        response.status(500).json({ error : `Internal error. please contact support ` })
    }
})

router.delete('/:id', async (request, response) => {
    const id = request.params.id
    const result = await questions_dal.delete_question(id)
    if(id == 0 ){
        response.status(400).json({error : "no such question"})
    }
    else if (result.status === "success") {
        response.status(200).json({ result: result.data ? "question deleted" : "question not found" })
    }
    else if (result.error.includes("does not exist")) {
         response.status(400).json({ student: `${id} not a number` })
    }
    else{
        response.status(500).json({ error : "Internal error. please contact support " })
    }
})

router.delete('/table/questions-delete-table', async (request, response) => {
    const result = await questions_dal.delete_table1()
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

router.post('/table/questions-create-table', async (request, response) => {
    const result = await questions_dal.create_table2()
    if (result.status === "sucess") {
        response.status(201).json({ status: "table-created" })
    }
    else if (result.error.includes('already exists')) {
        response.status(400).json({ status: result.status, error: result.error.replaceAll("\n     ", "'") })
    }
    else {
        response.status(500).json({ status: result.status, error: `Internal error. please contact support ` })
    }
})

router.post('/table/questions-created4', async (request, response) => {
    const result = await questions_dal.insert_4questions()
    response.status(201).json({ result: "4 new questions created" })
})

module.exports = router