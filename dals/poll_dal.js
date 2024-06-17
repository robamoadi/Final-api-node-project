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
    try {
        console.log(new_poll);
        const result_ids = await data_base('poll').insert(new_poll);

        return {
            status: "success",
            data: { ...new_poll }
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

async function checkUnansweredQuestions(userId) {
    try {
        const checkUser = await data_base.raw("SELECT id FROM users WHERE id = ?", [userId]);
        if (checkUser.rowCount > 0) {
            // Retrieve all questions
            const allQuestionsResult = await data_base.raw("SELECT id, question_title FROM questions");
            const allQuestions = allQuestionsResult.rows.map(question => ({ id: question.id, title: question.question_title }));

            // Retrieve questions the user has answered
            const userAnsweredQuestionsResult = await data_base.raw("SELECT DISTINCT question_id FROM poll WHERE user_id = ?", [userId]);
            const userAnsweredQuestions = userAnsweredQuestionsResult.rows.map(question => question.question_id);

            // Find unanswered questions 
            const unansweredQuestions = allQuestions.filter(question => !userAnsweredQuestions.includes(question.id));
            console.log(unansweredQuestions);

            // If there are unanswered questions, return them
            if (unansweredQuestions.length > 0) {
                return {
                    status: "success",
                    data: unansweredQuestions
                };
            } else {
                return {
                    status: "failed",
                    message: "User has answered all questions."
                };
            }
        }
        else {
            return {
                status: "failed",
                error: "User doesn't exist"
            };
        }
    } catch (error) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`case number : (${case_number}) error in checkUnansweredQuestions(${error.message})`);
        return {
            status: "failed",
            error: error.message
        };
    }
}
///poll statistics ---!!!

// returning question and user answer
async function question_answer(questionId) {
    try {
        const checkQuestionId = await data_base.raw("SELECT id FROM questions WHERE id = ?", [questionId])
        console.log(checkQuestionId);
        if (checkQuestionId.rowCount > 0) {
            const result = await data_base.raw(`SELECT
        q.question_title AS question,
        q.first_answer AS answer_1,
        COUNT(CASE WHEN p.selected_answer = q.first_answer THEN 1 END) AS answer_1_count,
        q.second_answer AS answer_2,
        COUNT(CASE WHEN p.selected_answer = q.second_answer THEN 1 END) AS answer_2_count,
        q.third_answer AS answer_3,
        COUNT(CASE WHEN p.selected_answer = q.third_answer THEN 1 END) AS answer_3_count,
        q.fourth_answer AS answer_4,
        COUNT(CASE WHEN p.selected_answer = q.fourth_answer THEN 1 END) AS answer_4_count
     FROM
        poll p
     JOIN
        questions q ON p.question_id = q.id
     WHERE
        q.id = ${questionId}
     GROUP BY
        q.question_title,
        q.first_answer,
        q.second_answer,
        q.third_answer,
        q.fourth_answer;
        `)
            if (result.rowCount > 0) {
                return {
                    status: "success",
                    data: result.rows
                }
            }
            else {
                return {
                    status: "failed",
                    message: "user didnt answer the question"
                }
            }
        }
        else {
            return {
                status: "failed",
                message: "question doesnt exisit"
            }
        }
    } catch (error) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`case number : (${case_number}) error in checkUnansweredQuestions(${error.message})`);
        return {
            status: "failed",
            error: error.message
        };
    }
}

//returning queston and how many users answered this question
async function question_user_count(questionId) {
    try {
        const checkQuestionId = await data_base.raw("SELECT id FROM questions WHERE id = ?", [questionId])
        if (checkQuestionId.rowCount > 0) {
            const result = await data_base.raw(`SELECT
    q.question_title AS question,
        COUNT(DISTINCT p.user_id) AS total_users_answered
    FROM
        poll p
    JOIN
        questions q ON p.question_id = q.id
    WHERE
        q.id = ${questionId}
        GROUP BY
    q.question_title;
    `)
            if (result.rowCount > 0) {
                return {
                    status: "success",
                    data: result.rows
                }
            }
            else {
                return {
                    status: "failed",
                    message: "no user answered the question"
                }
            }
        }
        else {
            return {
                status: "failed",
                message: "no such question"
            }
        }

    } catch (error) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`case number : (${case_number}) error in checkUnansweredQuestions(${error.message})`);
        return {
            status: "failed",
            error: error.message
        };
    }
}

// return user name and answer to each question he submitted
async function user_name_answer(userId) {
    try {
        const checkUserId = await data_base.raw("SELECT id FROM users WHERE id = ?", [userId])
        if (checkUserId.rowCount > 0) {
            const result = await data_base.raw(`SELECT
         u.First_Name AS user_name,
         q.question_title AS question_title,
         p.selected_answer AS user_answer
      FROM
         poll p
      JOIN
          users u ON p.user_id = u.id
      JOIN
          questions q ON p.question_id = q.id
      WHERE
          u.id = ${userId};
         `)
            if (result.rowCount > 0) {
                return {
                    status: "success",
                    data: result.rows
                }
            }
            else {
                return {
                    status: "failed",
                    message: "user didnt answer any question"
                }
            }
        }
        else {
            return {
                status: "failed",
                message: "user doesnt exisit"
            }
        }
    } catch (error) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`case number : (${case_number}) error in checkUnansweredQuestions(${error.message})`);
        return {
            status: "failed",
            error: error.message
        };
    }
}

//returning the user name and how many questions he answered
async function user_question(userId) {
    try {
        const checkUserId = await data_base.raw("SELECT id FROM users WHERE id = ?", [userId])
        if (checkUserId.rowCount > 0) {
            const result = await data_base.raw(`SELECT
             u.First_Name AS user_name,
             COUNT(DISTINCT p.question_id) AS num_questions_answered
           FROM
             poll p
           JOIN
             users u ON p.user_id = u.id
           WHERE
             u.id = ${userId}
          GROUP BY
             u.First_Name;
             `)
            if (result.rowCount > 0) {
                return {
                    status: "success",
                    data: result.rows
                }
            }
            else {
                return {
                    status: "failed",
                    message: "user didnt answer any question"
                }
            }
        }
        else {
            return {
                status: "failed",
                message: "user doesnt exisit"
            }
        }
    } catch (error) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`case number : (${case_number}) error in checkUnansweredQuestions(${error.message})`);
        return {
            status: "failed",
            error: error.message
        };
    }
}

//returning all questions and how many users choose each answer
async function all_questions() {
    try {
        const result = await data_base.raw(`SELECT
      q.question_title AS question_title,
      q.first_answer AS option_1,
      COUNT(CASE WHEN p.selected_answer = q.first_answer THEN 1 END) AS option_1_count,
      q.second_answer AS option_2,
      COUNT(CASE WHEN p.selected_answer = q.second_answer THEN 1 END) AS option_2_count,
      q.third_answer AS option_3,
      COUNT(CASE WHEN p.selected_answer = q.third_answer THEN 1 END) AS option_3_count,
      q.fourth_answer AS option_4,
      COUNT(CASE WHEN p.selected_answer = q.fourth_answer THEN 1 END) AS option_4_count
   FROM
      questions q
  LEFT JOIN
      poll p ON q.id = p.question_id
  GROUP BY
      q.question_title,
      q.first_answer,
      q.second_answer,
      q.third_answer,
      q.fourth_answer;
     `)
        return {
            status: "success",
            data: result.rows
        }
    } catch (error) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`case number : (${case_number}) error in checkUnansweredQuestions(${error.message})`);
        return {
            status: "failed",
            error: error.message
        };
    }
}

module.exports = {
    create_table_poll, insert_poll, delete_table_poll, all_questions,
    user_question, user_name_answer, question_answer, question_user_count,
    checkUnansweredQuestions
}