const assert = require('assert')
const questions_dal = require('./dals/questions_dal')

describe('testing questions dal' , ()=> {
    it('testing get all question' , async () =>{
        await questions_dal.delete_table1()
        await questions_dal.create_table2()
        await questions_dal.insert_4questions()

        const result = await questions_dal.get_all_questions()
        console.log(result);

        assert.strictEqual (result.status , 'success')
        assert.deepStrictEqual(result.data[1] , {
            id: 2,
            question_title: 'What is your favorite means of transport to travel ',
            first_answer: 'Bus',
            second_answer: 'Yacht',
            third_answer: 'Airplane',
            fourth_answer: 'Car'
          })
    })
    
    it('testing insert question' , async () =>{
        //arrange
        await questions_dal.get_all_questions()
        //act
        const result = await questions_dal.insert_question({
            question_title: 'Where are you from? ',
            first_answer: 'canada',
            second_answer: 'israel',
            third_answer: 'france',
            fourth_answer: 'italy'
          })
          console.log(result);

          assert.strictEqual(result.data.id , 5)
          assert.strictEqual(result.status , 'success')
    })
    after(async () => {
        await questions_dal.data_base.destroy()
    })
})