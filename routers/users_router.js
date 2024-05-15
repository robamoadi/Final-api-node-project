const express = require("express")
const users_dal = require("../dals/users_dal")

const router = express.Router()

/**
*  @swagger
*  components:
*     schemas:
*       user:
*         type: object
*         required:
*           - id
*           - First_Name
*           - Last_Name
*           - Email
*           - Date_Of_Birth
*           - Address
*           - password 
*         properties:
*           id:
*             type: number
*             description: The auto-generated id of the user.
*           First_Name:
*             type: string
*             description: The First_Name of the user.
*           Last_Name:
*             type: string
*             description: The Last_Name of the user.
*           Email:
*             type: string
*             description: Email of the user
*           Date_Of_Birth:
*             type: date
*             description: The Date_Of_Birth of the user.
*           Address:
*             type: string
*             description: Address of the user
*           password:
*             type: string
*             description: password of the user
*         example:
*           First_Name: Kim
*           Last_Name: john
*           Email: kim.2@gmail.com
*           Date_Of_Birth: 02/02/1997
*           Address: soul
*           password: 123456
*/




// '/api/users'
// GET 
/**
*  @swagger
*   /api/users/:
*     get:
*       summary: List all of the users
*       responses:
*         "200":
*           description: The list of users.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/users'
*/

router.get('', async (request, response) => {
    const result = await users_dal.get_all_users()
    if (result.status === "success") {
        response.status(200).json({ users: result.data })
    }
    else {
        response.status(500).json({ status: result.status, error: "Internal error. please contact support " })
    }
})

router.get('/:id', async (request, response) => {
    const id = request.params.id
    const result = await users_dal.get_user_by_id(id)
    if (id == 0) {
        response.status(400).json({ error: "no such user" })
    }
    else if (result.status === "success") {
        response.status(200).json({ student: result.data })
    }

    else if (result.error.includes("does not exist")) {
        response.status(400).json({ student: `${id} not a number` })
    }
    else {
        response.status(500).json({ error: "Internal error. please contact support " })
    }
})

// POST
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user record with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *           First_Name:
 *             type: string
 *             description: The First_Name of the user.
 *           Last_Name:
 *             type: string
 *             description: The Last_Name of the user.
 *           Email:
 *             type: string
 *             description: Email of the user
 *           Date_Of_Birth:
 *             type: date
 *             description: The Date_Of_Birth of the user.
 *           Address:
 *             type: string
 *             description: Address of the user
 *           password:
 *             type: string
 *             description: password of the user
 *         example:
 *               First_Name: Kim
 *               Last_Name: john
 *               Email: kim.2@gmail.com
 *               Date_Of_Birth: 02/02/1997
 *               Address: soul
 *               password: 123456
 *     responses:
 *       201:
 *         description: user created successfully.
 *         content:
 *           application/json:
 *             example:
 *                 First_Name: Kim
 *                 Last_Name: john
 *                 Email: kim.2@gmail.com
 *                 Date_Of_Birth: 02/02/1997
 *                 Address: soul
 *                 password: 123456
 *       400:
 *         description: Bad request. Ensure all required fields are provided.
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request. Missing required fields.
 */

router.post('', async (request, response) => {
    const new_user = request.body
    const result = await users_dal.insert_user(new_user)
    if (result.status === "success") {
        response.status(201).json({ new_user: result.data, url: `/api/users/${result.data.id}` })
    }
    else if (result.error.includes("duplicate key value")) {
        response.status(400).json({ error: result.error.split("-")[1] })
    }
    else {
        response.status(500).json({ error: "Internal error. please contact support " })
    }
})

router.patch('/:id', async (request, response) => {
    const id = request.params.id
    const updated_user = request.body
    const result = await users_dal.patch_user(id, updated_user)
    if (id == 0) {
        response.status(400).json({ result: "user not found" })
    }
    else if (result.status === "success") {
        response.status(200).json({ result: result.data ? "user updated" : "user not found" })
    }
    else if (result.error.includes("duplicate key value")) {
        response.status(400).json({ error: result.error.split("-")[1] })
    }
    else if (result.error.includes("does not exist")) {
        response.status(400).json({ student: `${id} not a number` })
    }
    else {
        response.status(500).json({ error: `Internal error. please contact support ` })
    }
})

// DELETE
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete an user by ID
 *     description: Delete the user record with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: user deleted successfully.
 *       400:
 *         description: user not found with the specified ID.
 *         content:
 *           application/json:
 *             example:
 *               error: cannot find user with id {id}
 */

router.delete('/:id', async (request, response) => {
    const id = request.params.id
    const result = await users_dal.delete_user(id)
    console.log(result);
    if (id == 0) {
        response.status(400).json({ error: "no such user" })
    }
    else if (result.status === "success") {
        response.status(200).json({ result: result.data ? "user deleted" : "user not found" })
    }
    else if (result.error.includes("does not exist")) {
        response.status(400).json({ student: `${id} not a number` })
    }
    else {
        response.status(500).json({ error: "Internal error. please contact support " })
    }
})

router.delete('/table/users-delete-table', async (request, response) => {
    const result = await users_dal.delete_table()
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


router.post('/table/users-create-table', async (request, response) => {
    const result = await users_dal.create_table()
    if (result.status === "sucess") {
        response.status(201).json({ status: "table-created" })
    }
    else if (result.error.includes("already exists")) {
        response.status(404).json({ status: result.error })
    }
    else {
        response.status(500).json({ status: result.status, error: `Internal error. please contact support ` })
    }

})

router.post('/table/users-created5', async (request, response) => {
    const result = await users_dal.insert_5users()
    if (result.status === "success") {
        response.status(201).json({ result: "5 new users created" })
    }
    else {
        response.status(500).json({ result: result.error })
    }
})

module.exports = router