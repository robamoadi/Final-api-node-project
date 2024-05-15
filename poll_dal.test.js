const assert = require("assert")
const poll_dal = require("./dals/poll_dal")

describe('testing poll dal' , () =>{
    it('testing create table', async () =>{
        //arrange
        await poll_dal.delete_table_poll()

        //act
        const result = await poll_dal.create_table_poll()
        console.log(result);

        assert.strictEqual(result.status , 'success')
    })

    it('testing delete table' , async () =>{
        //arrange
        await poll_dal.create_table_poll()

        //act
        const result = await poll_dal.delete_table_poll()
        console.log(result);

        assert.strictEqual(result.status , 'success')
    })
})
