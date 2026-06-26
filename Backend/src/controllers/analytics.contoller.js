import Analytics from "../models/analytics.model.js";

const GetAnalyticsSummary = async(req,res) => {
    try{
        const {apiId} = req.params;

        const logs = await Analytics.find({
            apiId,
            owner: req.user._id
        })

        const totalRequests = logs.length;

        const  blockedRequests = logs.filter(log => log.blocked === true).length;

        const successRequests = logs.filter(
            log => log.statusCode >= 200 && log.statusCode < 400
        ).length;

        const failedRequests = logs.filter(
            log => log.statusCode >=400
        ).length;

        const totalLatency = logs.reduce((sum,log)=>{
            return sum + (log.latency || 0);
        },0)

        const averageLatency = totalRequests === 0 ? 0 : totalLatency / totalRequests;

        return res.status(200).json({
            message: "Analytics summary fetched successfully",
            success: true,
            summary: {
                totalRequests,
                successRequests,
                failedRequests,
                blockedRequests,
                averageLatency
            }
        });

    }catch(err){
        console.log("error in fetching analytics summary",err);
        return res.status(500).json({
            message: "Error fetching analytics summary",
            success: false
        });
    }
}


export {GetAnalyticsSummary};