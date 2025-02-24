const { SearchDataSubjectServices}= require("../services/notesbysubject.service")
const NotesBySubject=async (req,res)=>{
    try{
        const { id } = req.params
        const   {subject,curse}=req.query 
        const SearchDataSubject=await SearchDataSubjectServices(id,subject,curse)
        console.log(id,subject,curse)
        res.status(200).send(SearchDataSubject)

    }catch(e){
        res.status(400).send("erro en el controller",e)
    }


}
module.exports= {NotesBySubject}