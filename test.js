const { checkAva,getAvailabilityUrls,modifyUrl } = require("./myUrl");
const datesToQuery = [
    '04/02/2025',
    '02/02/2025',
    '03/02/2025',
];

(async function monitorTickets() {
    console.log("Starting ticket monitoring...");

    while (true) {
        try {
            const availabilityUrls = await getAvailabilityUrls();
            if (availabilityUrls.length > 0) {
                console.log("Availability URLs found. Starting parallel checks...");
                
                // 使用 Promise.all 并行查询所有 URL 和日期
                const tasks = availabilityUrls.flatMap((availabilityUrl) => {
                    const modifiedUrl = modifyUrl(availabilityUrl);
                    console.log(`Modified URL: ${modifiedUrl}`);

                    return datesToQuery.map((date) => {
                        return checkAva(modifiedUrl, date).then((result) => {
                            if (result) {
                                console.log(`Tickets available for date: ${date} at URL: ${modifiedUrl}`);
                                // 在此发送通知或处理逻辑
                            }
                            return result;
                        });
                    });
                });

                // 等待所有并行任务完成
                const results = await Promise.all(tasks);

                // 检查是否有票
                if (results.some((found) => found)) {
                    console.log("Tickets found! Exiting monitoring...");
                    break; // 停止监控
                } else {
                    console.log("No tickets available for the specified dates.");
                }
            } else {
                console.log("No Availability URLs found during this check.");
            }
        } catch (error) {
            console.error("Error in main loop:", error);
        }

        // 每 60 秒检查一次
        console.log("Waiting for 60 seconds before the next check...");
        await new Promise((resolve) => setTimeout(resolve, 60000));
    }
})();