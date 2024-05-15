const knex = require("knex")
const config = require("config")
const logger = require("../logger/my_logger")

const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        user: config.db_connection.user,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

async function create_table_poll() {
    try {
        const result = await data_base.raw(`CREATE TABLE poll (
        Answer_number SERIAL PRIMARY KEY,
        user_id integer NOT NULL,
        question_id INT REFERENCES questions(id) ON DELETE CASCADE,
        date_time timestamp with time zone,
        selected_answer VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, question_id)
     );`)
        console.log('create finished successfully');
        return {
            status: "success"
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in create poll table(${e.message})`)
        return {
            status: "failed to create table",
            error: e.message
        }
    }
}

async function insert_poll(new_poll) {
    try{
    console.log(new_poll);
    const result_ids = await data_base('poll').insert(new_poll);

    return {
        status: "success",
        data: { ...new_poll }
    }
}
catch(e){
    const case_number = Math.floor(Math.random() * 1000000) + 1000000
    logger.error(`case number : (${case_number}) error in insert user (${e.message})`)
    return {
        status: "failed to add a new user",
        error: e.message
    }
}
}

async function delete_table_poll() {
    try {
        await data_base.raw(`DROP table poll`)
        return {
            status: "success"
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in delete poll table (${e.message})`);
        return {
            status: "cants delete table",
            error: e.message
        }
    }
}

module.exports = {
    create_table_poll, insert_poll, delete_table_poll
}