class UserService{
    constructor(db){
        this.client=db.sequelize
        this.user=db.User
    }
     
    async getOne(email){
        return await this.user.findOne(
            {
                where:{
                    email:email
                }   
            }
        )
    }

    async create(name,email,encryptedPassword,salt){
        return await this.user.create({
            name:name,
            email:email,
            encryptedPassword:encryptedPassword,
            salt:salt
        })
    }

    async deleteUser(id){
        return this.user.destroy({
            where:{
                id:id
            }
        })
    }
}

module.exports=UserService

