const axios = require('axios');
const fs = require('fs');
const cache = {};

function fbflpost(url, cookie, callback) {
    try {
        axios({
            method: 'get',
            url: url,
            headers: {
                "accept": "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8",
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                "encoding": "gzip",
                "cookie": cookie,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
            },
        }).then(response => {
            if (response.status === 200) {
                const data = cache[url] || response.data.split(/data\-sjs>|<\/script>/)
                    .filter(data => /^\{"require":/.test(data))
                    .map(data => JSON.parse(data));

                cache[url] = data;

                const repData = processData(data, url);

                callback(null, repData);
            } else {
                callback(`Lỗi: Phản hồi có trạng thái HTTP ${response.status}`, null);
            }
        }).catch(error => {
            callback(`Lỗi khi truy xuất dữ liệu: ${error.message}`, null);
        });
    } catch (error) {
        callback(`Lỗi khi truy xuất dữ liệu: ${error.message}`, null);
    }
}

function processData(data, url) {
    const returnData = {
        message: '',
        attachment: [],
        name: '', // Thêm trường mới để lưu trữ 'name'
    };

    const _ = allValueByKey(data, [['attachment'], ['attachments'], ['message'], ['unified_stories'], ['video'], ['five_photos_subattachments']]);
    const msg = (i, m = _.message) => m?.[i]?.story?.message?.text || m?.[i]?.text;
    returnData.message = msg(2) || msg(0) || null;

    if (/(\/reel\/|watch)/.test(url)) {
        if (_.attachments.length > 0 && _.attachments[0][0]?.media && typeof _.attachments[0][0].media === 'object') {
            returnData.attachment.push(_.attachments[0][0].media);
        } else if (_.video.length > 0) {
            returnData.attachment.push({ __typename: 'Video', ..._.video[0] });
        }
    }

    if (/\/stories|share\//.test(url)) {
        for (const i of _.unified_stories) {
            for (const e of i.edges) {
                const media_story = e?.node?.attachments?.[0]?.media;

                if (!!media_story) {
                    returnData.attachment.push(media_story);
                }
            }
        }
    }

    if (/\/((post|share|permalink|videos)\/|story\.php)/.test(url)) {
        const a = _.attachment;
        const fpsa = _.five_photos_subattachments[0]?.nodes;
        const b = a?.[0]?.all_subattachments?.nodes || (fpsa?.[0] ? fpsa : fpsa) || (a?.[0] ? [a[0]] : []);

        returnData.attachment.push(
            ...b.map($ => {
                const vd = $?.media?.video_grid_renderer;

                if (!!vd && $.media) delete $.media.video_grid_renderer;

                return {
                    ...$.media,
                    ...(vd?.video || {}),
                };
            })
        );

        if (_.attachments.length > 0) {
            returnData.attachment.push(_.attachments[0][0]?.media);
        }
    }

    returnData.attachment = returnData.attachment.filter($ => !!$).map($ => newObjByKey($, ['__typename', 'id', 'preferred_thumbnail', 'browser_native_sd_url', 'browser_native_hd_url', 'image', 'photo_image', 'owner']));

    // Thêm đoạn mã để lấy 'name' từ dữ liệu
    try {
        returnData.name = data[58]?.require[0][3][0]?.__bbox?.require[17][3][1]?.__bbox?.result?.data?.attachments[0]?.media?.owner?.name;
    } catch (error) {
        console.error('Error extracting name:', error);
    }

    return returnData; // Trả về 'returnData'
}

function allValueByKey(obj, allKey) {
    const returnData = {};

    function check(obj, key) {
        if (!returnData[key]) returnData[key] = [];
        for (const [$key, $value] of Object.entries(obj)) {
            if ($key === key && !returnData[key].some($1 => JSON.stringify($1) === JSON.stringify($value))) {
                returnData[key].push($value);
            }
            if (!!$value && typeof $value === 'object') {
                check($value, key);
            }
        }
    }

    allKey.forEach($ => check(obj, $[0]));

    return returnData;
}

function newObjByKey(obj, key) {
    const data = {};

    for (const $ of key) {
        if (!!obj[$]) data[$] = obj[$];
    }

    return data;
}

module.exports = { fbflpost };
