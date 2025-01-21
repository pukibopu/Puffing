const axios = require('axios');
const { chromium } = require('playwright-chromium');
const sendEmail = require('./emailService');

const getAvailabilityUrls = async () => {
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    const foundUrls = []
    await page.route('**/*', (route, req) => {
        if (req.method() == 'POST' && req.url().includes('Availability') &&
            req.url().includes('AT=')) {
            const postData = req.postData()
            if (postData && postData.includes('category=LAKE')) {
                console.log(`Found URL With LAKE: ${req.url()}`);
                foundUrls.push(req.url());
            }
        }
        route.continue();
    })
    await page.goto('https://puffingbilly.com.au/buy-tickets/excursion/');
    await page.waitForTimeout(10000); // Wait for 10 seconds
    await browser.close();

    return foundUrls;

}

const modifyUrl = (url) => {
    const atParam = url.match(/AT=([^&]+)/)[1];
    const localtimeParam = url.match(/localtime=([^&]+)/)[1];
    return `https://apps.customlinc.com.au/puffingbillyrailways/BookingCat/Availability/?AT=${atParam}&changeDate&localtime=${localtimeParam}`;
}

const checkAva = async (url, newDate) => {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-GB,en;q=0.9',
        Origin: 'https://apps.customlinc.com.au',
        Referer:
            'https://apps.customlinc.com.au/puffingbillyrailways/BookingCat/Availability/?changeDate&localtime=2024-07-29,%2010:30:30:535',
        'X-Requested-With': 'XMLHttpRequest',
    };

    // const cookies = {
    //     currentBrandWAFApplicationBookingCat: 'PUFFING%20BILLY',
    //     oidToken: '12594595.467180---EKKRegvApR6n5FLpf6Rj',
    // };

    const data = new URLSearchParams({
        newDate, // 替换为你需要的日期
        direction: '-1',
    });

    try {
        const res = await axios.post(url, data.toString(), {
            headers,
            withCredentials: true,
            // cookies
        })
        const htmlContent = res.data;
        const currentTime = new Date().toISOString();
        let avaHTML = htmlContent.availabilityHTML;
        if (!avaHTML) {
            console.log(`${currentTime} - No availability data found.`);
            return false;
        }
        avaHTML=avaHTML.replace(/\s+/g, "")
        
        
        const regex = /onclick="changeScheduledEventAT\('([^']*)','([^']*)'\)".*?(LimitedSeats\s*<br>\s*\d+\s*Available|BookNow)/gs;

// 使用 matchAll 提取所有匹配的分组
        const matches = [...avaHTML.matchAll(regex)];

        
        
        if (matches) {
            matches.forEach((match, index) => {
                
                if (match[2]==newDate){
                    console.log(match[1]);
                    console.log(match[2]);
                    console.log();
                    
                    
                    
                }
                
                // if (match[1]===newDate){
                //     console.log(match[2]);
                //     console.log(match[3]);
                // }
                
            });
        } else {
            console.log("未找到符合条件的片段");
        }


    } catch (err) {
        console.error('Error checking availability:', err);
        return false
    }


};


(async function a(){
    const availabilityUrls = await getAvailabilityUrls();
    const modi=modifyUrl(availabilityUrls[0])
    checkAva(modi,'18/01/2025')
    
    
})();