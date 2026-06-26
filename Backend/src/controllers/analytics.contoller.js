import Analytics from "../models/analytics.model.js";

const GetAnalyticsSummary = async (req, res) => {
    try {
        const { apiId } = req.params;

        console.log("Summary API ID:", apiId);
        console.log("Logged-in User ID:", req.user._id);

        const logs = await Analytics.find({
            apiId,
            owner: req.user._id
        });

        console.log("Summary Logs Found:", logs.length);
        console.log("Summary Logs:", logs);

        const totalRequests = logs.length;

        const blockedRequests = logs.filter(log => log.blocked === true).length;

        const successRequests = logs.filter(
            log => log.statusCode >= 200 && log.statusCode < 400
        ).length;

        const failedRequests = logs.filter(
            log => log.statusCode >= 400
        ).length;

        const totalLatency = logs.reduce((sum, log) => {
            return sum + (log.latency || 0);
        }, 0);

        console.log("Total Latency:", totalLatency);

        const averageLatency = totalRequests === 0 ? 0 : totalLatency / totalRequests;

        console.log("Average Latency:", averageLatency);

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

    } catch (err) {
        console.log("error in fetching analytics summary", err);
        return res.status(500).json({
            message: "Error fetching analytics summary",
            success: false
        });
    }
};

const GetAnalyticsHistory = async (req, res) => {
    try {
        const { apiId } = req.params;

        console.log("History API ID:", apiId);
        console.log("Logged-in User ID:", req.user._id);

        const history = await Analytics.find({
            apiId,
            owner: req.user._id
        })
            .sort({ createdAt: -1 })
            .limit(50);

        console.log("History Logs Found:", history.length);
        console.log("History Logs:", history);

        const formattedHistory = history.map((log) => ({
            time: log.createdAt,
            latency: log.latency,
            statusCode: log.statusCode,
            blocked: log.blocked
        }));

        console.log("Formatted History:", formattedHistory);

        return res.status(200).json({
            message: "Analytics history fetched successfully",
            success: true,
            history: formattedHistory
        });

    } catch (err) {
        console.log("Error in fetching analytics history", err);

        return res.status(500).json({
            message: "Error fetching analytics history",
            success: false
        });
    }
};

export { GetAnalyticsSummary, GetAnalyticsHistory };