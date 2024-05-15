const config = require("config")
const knex = require("knex")
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

async function create_table() {
    try {
        const result = await data_base.raw(`CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        First_Name VARCHAR(255) NOT NULL,
        Last_Name VARCHAR(255),
        Email VARCHAR(255) NOT NULL,
        Date_Of_Birth DATE NOT NULL,
        Address VARCHAR(255),
        password VARCHAR(255) NOT NULL,
                CHECK (char_length(password) >= 6),
        UNIQUE(email) );`)
        console.log('create finished successfully');
        return {
            status: "success"
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in create user table (${e.message})`)
        console.log(e.message);
        return {
            status: 'failed to create table',
            error: error.message
        }
    }
}

async function insert_5users() {
    try {
        `INSERT INTO users (First_Name, Last_Name, Email, Date_Of_Birth,Address ,password) VALUES ('Arya', 'Stark', 'arya.stark@example.com','1969-02-02', 'Winterfell' , '123456');
    INSERT INTO users (First_Name, Last_Name, Email, Date_Of_Birth,Address ,password) VALUES ('Jon ', 'Snow', 'jon.snow@example.com','1975-03-05', 'The Wall' , 'jonsnow');
    INSERT INTO users (First_Name, Last_Name, Email, Date_Of_Birth,Address ,password) VALUES ('Daenerys ', 'Targaryen', 'daenerys.targaryen@example.com','1983-11-02', 'Dragonstone' , '1234567');
    INSERT INTO users (First_Name, Last_Name, Email, Date_Of_Birth,Address ,password) VALUES ('Tyrion ', 'Lannister', 'tyrion.lannister@example.com','1963-10-04', 'King’s Landing' , 'tyrion');
    INSERT INTO users (First_Name, Last_Name, Email, Date_Of_Birth,Address ,password) VALUES ('Sansa ', 'Stark', 'sansa.stark@example.com','1990-09-12', 'Winterfell' , 'sansastark');`
            .replaceAll('\n    ', '')
            .split(';')
            .filter(query => query)
            .forEach(async query => { await data_base.raw(query + ';') })
        return {
            status: "success"
        }
    }
    catch (e) {
        console.log(e);
        return {
            status: "failed to insert users",
            error: e.message
        }
    }
}

async function get_all_users() {
    try {
        const users = await data_base.raw("select * from users")
        console.log(users.rows.map(u => `[${u.id}]`));
        return {
            status: "success",
            data: users.rows
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in get all users (${e.message})`)
        //console.log(e);
        return {
            staus: 'failed to get users',
            error: e.message
        }
    }
}

async function get_user_by_id(id) {
    try {
        const user = await data_base.raw(`select * from users where id = ${id}`)
        return {
            status: "success",
            data: user.rows
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in get user by id (${e.message})`)
        return {
            status: "failed to get user",
            error: e.message
        }
    }
}

async function insert_user(new_user) {
    try {
        console.log(new_user);
        delete new_user.id
        const result_ids = await data_base('users').insert(new_user).returning('id');
        console.log(result_ids[0]);

        const id = result_ids[0].id
        return {
            status: "success",
            data: { id, ...new_user }
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in insert user (${e.message})`)
        return {
            status: "failed to add a new user",
            error: e.message
        }
    }
}

async function try_login(email, password) {
    const user = await data_base.raw(`select id from users where Email LIKE '${email}' AND password LIKE '${password}'`)
    console.log(user);
    if (user.rowCount > 0) {
        console.log(user.rowCount);
         return {
        status: "success",
        id: user.rows[0].id
    }
    }
    else{
        return user.rowCount
    }
}


async function patch_user(id, updated_user) {
    try {
        const query_arr = []
        for (let key in updated_user) {
            query_arr.push(`"${key}"='${updated_user[key]}'`)
        }
        console.log(query_arr);

        if (query_arr.length > 0) {
            const query = `UPDATE users set ${query_arr.join(', ')} where id=${id}`
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
        logger.error(`case number : (${case_number}) error in patch user (${e.message})`)
        return {
            staus: "failed to patch",
            error: e.message
        }
    }
}

async function delete_user(id) {
    try {
        const result = await data_base.raw(`DELETE from users where id=${id}`)
        console.log(result.rowCount);
        return {
            status: "success",
            data: result.rowCount
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in deleting user  (${e.message})`)
        return {
            status: "failed to delete user",
            error: e.message
        }
    }
}

async function delete_table() {
    try {
        await data_base.raw(`DROP table users CASCADE`)
        return {
            status: "success"
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in deleting users table (${e.message})`)
        return {
            status: "failed to delete table",
            error: e.message
        }
    }
}

module.exports = {
    get_all_users, get_user_by_id, insert_user,
    patch_user, delete_user, delete_table,
    create_table, insert_5users, try_login, data_base
}