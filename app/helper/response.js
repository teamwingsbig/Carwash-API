
exports.sendSuccessmsg = (res,message,additional={}) =>{

    let obj={
        status:true,
        messsage:message
    }
    return res.send({...obj,...additional})
}



exports.sendFailedmsg = (res,message,error) =>{

    let obj={
        status:false,
        messsage:message,
        error:error
    }
    return res.send(obj)
}



