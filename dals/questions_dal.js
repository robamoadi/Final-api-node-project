const knex = require("knex")
const config = require("config")
const logger = require('../logger/my_logger')

const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        user: config.db_connection.user,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

async function create_table2() {
    try {
        const result = await data_base.raw(`CREATE TABLE questions (
        id SERIAL PRIMARY KEY,
        question_title VARCHAR(255) NOT NULL,
        first_answer VARCHAR(255),
        second_answer VARCHAR(255),
        third_answer VARCHAR(255),
        fourth_answer VARCHAR(255),
        UNIQUE(question_title) );`)
        return {
            status: "success"
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in creating questions table (${e.message})`);
        return {
            status: 'failed to create table',
            error: e.message
        }
    }
}

async function insert_4questions() {
    try {
        const queries = `
            INSERT INTO questions (question_title, first_answer, second_answer, third_answer, fourth_answer)
            VALUES ('Where is your preferred place to travel', 'Thailand', 'Brazil', 'Israel', 'Spain'),
                   ('What is your favorite means of transport to travel', 'Bus', 'Yacht', 'Airplane', 'Car'),
                   ('What is the season of the year in which you prefer to travel', 'Spring', 'Summer', 'Fall', 'Winter'),
                   ('Where do you prefer to stay', 'Hotels', 'Hostels', 'Cabins', 'Apartment Rentals');
        `;
        const queriesArray = queries.split(';').filter(query => query.trim() !== ''); // Split queries and remove empty strings
        for (const query of queriesArray) {
            await data_base.raw(query.trim()); // Execute each query
        }
        return { status: "success" }; // Return success status
    } catch (error) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in creating questions table (${error.message})`);
        console.error("Error inserting questions:", error);
        return { status: "error", message: error.message }; // Return error status with message
    }
}

async function get_all_questions() {
    try {
        const questions = await data_base.raw("select * from questions")
        return {
            status: "success",
            data: questions.rows
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in get all questions (${e.message})`);
        return {
            status: "failed to get questions",
            error: e.message
        }
    }
}

async function get_question_by_id(id) {
    try {
        const question = await data_base.raw(`select * from questions where id = ${id}`)
        //console.log(question.rows[0]);
        return {
            status: "success",
            data: question.rows[0]
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in get question by id (${e.message})`)
        return {
            status: "failed to get question",
            error: e.message
        }
    }
}

async function insert_question(new_question) {
    try {
        delete new_question.id
        const result_ids = await data_base('questions').insert(new_question).returning('id');
        const id = result_ids[0].id // the new id
        return {
            status: "success",
            data: { id, ...new_question }
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in adding question (${e.message})`)
        return {
            status: "failed to add a new student",
            error: e.message
        }
    }
}

async function patch_question(id, updated_question) {
    try {
        const query_arr = []
        for (let key in updated_question) {
            query_arr.push(`${key}='${updated_question[key]}'`)
        }

        if (query_arr.length > 0) {
            const query = `UPDATE questions set ${query_arr.join(', ')} where id=${id}`
            const result = await data_base.raw(query)
            return {
                status: "success",
                data: result.rowCount
            }
        }
        return {
            status: "success",
            data: query_arr.length
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in patch question(${e.message})`)
        return {
            staus: "failed to patch",
            error: e.message
        }
    }
}

async function delete_question(id) {
    try {
        const result = await data_base.raw(`DELETE from questions where id=${id}`)
        console.log(result.rowCount);
        return {
            status: "success",
            data: result.rowCount
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in deleting question (${e.message})`);
        return {
            status: "failed to delete user",
            error: e.message
        }
    }
}

async function delete_table1() {
    try {
        await data_base.raw(`DROP table questions CASCADE`)
        return {
            status: "success"
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in delete question table (${e.message})`);
        return {
            status: "failed to delete table",
            error: e.message
        }
    }
}

module.exports = {
    get_all_questions, get_question_by_id, insert_question, delete_question,
     delete_table1,create_table2, insert_4questions, patch_question
}