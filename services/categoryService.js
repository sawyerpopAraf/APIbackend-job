class CategoryService{
    constructor(db){
        this.client=db.sequelize
        this.category=db.Category
        this.todo=db.Todo
    }

    async getAll(userId){
        return await this.category.findAll({
            where:{
                UserId:userId
            },
            })
        }
    
     
    async creteCategory(name,userId){
      return await this.category.create({
            name:name,
            UserId:userId
        })
      }

      async deleteCategory(id, userId) {
        const category = await this.category.findOne({
            where: {
                id: id,
                UserId: userId
            }
        });
    
        if (!category) {
            throw new Error("Category does not belong to the user");
        }
    
        const todosCount = await this.todo.count({
            where: {
                categoryId: id
            }
        });
    
        if (todosCount > 0) {
            throw new Error("Category is in use");
        }
    
        return this.category.destroy({
            where: {
                id: id,
                UserId: userId
            }
        });
    }

     async updateCategory(id,newName,userId){
        //to check if the category belongs to the user
        const category=await this.category.findOne({
            where:{
                id:id,
                UserId:userId
            }
        })
        if(!category){
            throw new Error("Category does not belong to the user")
        }
        //to check if the category already exists
        const allCategory=await this.category.findAll({
            where:{
                UserId:userId
            }
        })
        const categoryNames=allCategory.map((category)=>category.name)
        if(categoryNames.includes(newName)){
            throw new Error("Category already exists")
        }
        //to update the category
        return await this.category.update({
            name:newName
        },{
            where:{
                id:id,
                Userid:userId
            }
        })
    }
}








module.exports=CategoryService
