const {SearchDataAllStudents}= require("../models/user.model")
const SearchDataSubjectServices=async(id,subject,curse)=>{
   const returnAll = await SearchDataAllStudents(id,curse,subject)

   return returnAll

 

}
module.exports={SearchDataSubjectServices}