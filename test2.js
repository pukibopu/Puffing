const axios = require('axios');

const getAvailabilityUrls = async () => {
    const foundUrls = [];

    try {
        // POST 请求 URL
        const url = 'https://puffingbilly.com.au/buy-tickets/excursion/#belgrave-lakeside';

        // 模拟 POST 请求数据
        const postData = {
            category: 'LAKE', // 根据实际需求替换
        };

        // 发送 POST 请求
        const response = await axios.post(url, postData, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            },
        });

        // 解析响应内容
        const data = response.data;

        // 提取包含 "AT=" 的 URL
        console.log(data);
        
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
    }

    return foundUrls;
};

// 调用函数
getAvailabilityUrls().then((urls) => {
    console.log('Found URLs:', urls);
});