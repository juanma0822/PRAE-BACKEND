const {FindOneStudentModels}=require("../models/user.model")
const {SearchDataAllStudents}= require("../models/user.model")
const SearchDataSubjectServices=async(id,subject,curse)=>{
   if (subject && curse){
      const returnAll = await SearchDataAllStudents(id,curse,subject)
      return returnAll
   }
   if(subject==null && curse==null ){
      const promedioCal= await FindOneStudentModels(id)
      console.log(promedioCal)
      return promedioCal
   }
}
module.exports={SearchDataSubjectServices}