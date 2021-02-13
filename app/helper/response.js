
exports.sendSuccessmsg = (res,message,additional={}) =>{

    let obj={
        status:true,
        message:message
    }
    return res.send({...obj,...additional})
}



exports.sendFailedmsg = (res,message,error) =>{

    let obj={
        status:false,
        message:message,
        error:error
    }
    return res.send(obj)
}



