export const tryCatch = (controller:any) => {
 return async(req:any,res:any,next:any) =>{
   try{
     await controller(req,res)
   }catch(e){
    console.log(e)
       next(e)
   }
   }
}


