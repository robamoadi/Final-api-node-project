const assert = require('assert')
const users_dal = require('./dals/users_dal')

describe('testing users dal', () => {
    it('testing get user by id', async () => {
        //arrange
        await users_dal.delete_table()
        await users_dal.create_table()
        await users_dal.insert_5users()

        //act
        const result = await users_dal.get_user_by_id(1)
        console.log(result);
        
        assert.strictEqual(result.status, 'success')
        assert.strictEqual(result.data.length, 1)

    })

    it('testing get all users', async () => {
        //arrange
        await users_dal.delete_table()
        await users_dal.create_table()
        await users_dal.insert_5users()

        //act
        const result = await users_dal.get_all_users()
        console.log(result);
        //assert
        assert.strictEqual(result.status, 'success')
        assert.strictEqual(result.data.length, 5)

        users_dal.data_base.destroy()
    })

    after(async () => {
        await users_dal.data_base.destroy()
    })
})