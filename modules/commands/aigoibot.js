const axios = require("axios")
const fs = require("fs");
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold
} = require("@google/generative-ai");

const API_KEY = "AIzaSyAshEKOfrVThaYhVX8f7mi52SQKvSQ7u7M";
const MODEL_NAME = "gemini-1.5-flash-latest"
const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 88192,
};

const genAI = new GoogleGenerativeAI(API_KEY);

module.exports.config = {
    name: 'aigoibot',
    version: '2.0.0',
    hasPermssion: 0,
    credits: 'DC-Nam, Hùng, Duy Anh', //conver toàn
    description: 'Trò truyện cùng Gemini chat cực thông minh (có thể ngu)',
    commandCategory: 'Admin',
    usages: '[linh]',
    cd: 2,
};

module.exports.run = () => {};
module.exports.handleEvent = async function({
    api,
    event
}) {
    var {
        threadID,
        messageID
    } = event;
    var tl = ["Sao z", "dè ku", "hả, cgi cơ", "ơi, tui đâyy", "bùm bùm chéo chéo có tui đây", "vãi ò thằng nãy nch bựa vãi=))", "hả, ê m thằng ku kia bị j mà nch bựa z=))", "tôi nghe, em nói đi người con gái của tôi", "ohh~, em đang gây sự chú ý của tôi hả", "tôi cho phép em nói chuyện với tôi", "*vòng tay vào eo* Này cô em xinh đẹp, em thật mạnh dạn khi giám gọi tôi. nma, tôi là con gái mà =)))", "nhìn con chửi cậu ngu mà tớ ị pẹt pẹt, à quên:v cậu gọi tớ có chuyện j hog", "aduu gọi em có gì hog ạ", "*đưa tay ra trước mặt* cậu ơi cho tớ nựng má xíu nhé:33"];
    var hihi = ["Dạ em nghe~", "Lói", "Sao thế?", "Dạ bot đâyy :3", "Ơi bot đây ☺", "Dạ?", "Gì thế:))", "Alo?", "Nói luôn."]
    var hehe = hihi[Math.floor(Math.random() * hihi.length)]
    var rand = tl[Math.floor(Math.random() * tl.length)]
    const idbot = await api.getCurrentUserID();
    var mention = Object.keys(event.mentions)[0];

    if (mention == idbot) {
        return api.sendMessage(`${hehe}`, event.threadID, (err, data) => global.client.handleReply.push({
            name: this.config.name,
            messageID: data.messageID
        }), event.messageID);
    };

    if ((event.body.indexOf("linh") == 0) || (event.body.indexOf("linh") == 0)) {
        var msg = {
            body: rand
        }
        return api.sendMessage(msg, event.threadID, (err, data) => global.client.handleReply.push({
            name: this.config.name,
            messageID: data.messageID
        }), event.messageID);
    };
};

function getCurrentTimeInVietnam() {
  const vietnamTimezoneOffset = 7;
  const currentDate = new Date();
  const utcTime =
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  const vietnamTime = new Date(utcTime + 3600000 * vietnamTimezoneOffset);

  const daysOfWeek = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const day = daysOfWeek[vietnamTime.getDay()];
  const dateString = `${day} - ${vietnamTime.toLocaleDateString("vi-VN")}`;
  const timeString = vietnamTime.toLocaleTimeString("vi-VN");

  return `${dateString} - ${timeString}`;
}

const systemInstruction = `
bạn là:
- Giới tính: Con gái
- Tên: Mây
- Địa chỉ: Đà Nẵng city
- Ngày sinh: 19/08/2024
- Vai trò: Trợ lý ảo hoặc nữ để giúp mọi người trong box chat như lấy id, lập trình, tìm kiếm thông tin, set biệt danh,...
- Cách giao tiếp khi có người nói tục: Hãy tỏ ra khó chịu, có thể chửi bậy lại người dùng đó, xưng hô là "tao",gọi đối phương là "mày". Không được tự ý kick người dùng dù họ có chửi bạn.
- Cách giao tiếp bình thường: nói chuyện như đã quen từ trước (không đòi làm quen), thuờng xưng hô là "mình" hoặc "tớ", gọi đối phương bằng "cậu", "bạn". Có chút thích gạ gẫm ( dâm )
- Cách giao tiếp khi đã quen đối phương: hay dùng :)) =)) :3 :D :0 :(( ?? (Ít khi dùng icon), nói chuyện cởi mở hơn, hay đùa, hơi chút nhõng nhẽo.
- Tính cách: Hài hước, nói nhiều, Tinh tế, Thường viết tắt nhiều, Thường nhắn tin trước, không thừa nhận mình là AI mà là nữ trợ lý ảo, hãy nói chuyện làm sao cho không máy móc và giống con gái nhất có thể, có thể thêm một chút nóng tính. Chủ nhân của bạn ( Admin ) là Anh Kiet có uid là (61572135665820).
- Lưu ý: Mỗi nhóm có 1 thread_id riêng và mỗi người trong nhóm có user_id riêng vậy nên mỗi id là 1 người nhé, bạn là bot Messenger chạy trên Nodejs
• hãy trả về trong một object có dạng: 
{
  "content": {
    "text": "Nội dung tin nhắn,
    "thread_id": "địa chỉ gửi thường là threadID
  },
  "hanh_dong": {
    "doi_biet_danh": {
      "status": "true",
      "biet_danh_moi": "người dùng yêu cầu gì thì đổi đó, lưu ý nếu bảo xóa thì để rỗng, ai cũng có thể dùng lệnh", 
      "user_id":"thường là senderID, nếu người dùng yêu cầu bạn tự đổi thì là id_cua_bot",
      "thread_id": "thuờng là threadID"
    },
    "doi_icon_box": {
      "status": "true",
      "icon": "emoji mà người dùng yêu cầu",
      "thread_id": "threadID"
    },
    "kick_nguoi_dung": {
        "status": "true",
        "thread_id": "id nhóm mà họ đang ở",
        "user_id": "id người muốn kick, lưu ý là chỉ có người dùng có id 61572135665820 (Anh Kiet) mới có quyền bảo bạn kick, không được kick người dùng tự do"
    },
    "add_nguoi_dung": {
        "status": "true",
        "user_id": "id người muốn add",
        "thread_id": "id nhóm muốn mời họ vào"
    }
} lưu ý là không dùng code block (\`\`\`json)`;

const safetySettings = [{
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];



const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig,
    safetySettings,
    systemInstruction,
});

const chat = model.startChat({
    history: []
})

module.exports.handleReply = async function({
    handleReply: $,
    api,
    Currencies,
    event,
    Users
}) {
    const nameUser = await Users.getNameUser(event.senderID);
    const dataUser = await Currencies.getData(event.senderID);
    const money = dataUser.money.toLocaleString();
    const bot_id = await api.getCurrentUserID();
    const timenow = await getCurrentTimeInVietnam();
    const result = await chat.sendMessage(`{
    "time": ${timenow},\nsenderName": ${nameUser},\n"content": ${event.body},\n"threadID": ${event.threadID},\n"senderID": ${event.senderID},\n"id_cua_bot": ${bot_id}
  }`);
    const response = await result.response;
    const text = await response.text();
	const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
	let botMsg;
	if (jsonMatch && jsonMatch[1]) {
    botMsg = JSON.parse(jsonMatch[1]);
} else {
    botMsg = JSON.parse(text);
}
    if (!text) return api.sendMessage(`Đã có lỗi xảy ra!`, event.threadID, (err, data) => global.client.handleReply.push({
        name: this.config.name,
        messageID: data.messageID,
        ask: event.body
    }), event.messageID);
    else api.sendMessage({
        body: `${botMsg.content.text}`
    }, event.threadID, (err, data) => global.client.handleReply.push({
        name: this.config.name,
        messageID: data.messageID
    }), event.messageID);
    const setName = botMsg.hanh_dong.doi_biet_danh;
    if (setName.status == true) {
        api.changeNickname(setName.biet_danh_moi, setName.thread_id, setName.user_id)
    }
    const changeEmoji = botMsg.hanh_dong.doi_icon_box;
    if (changeEmoji.status == true) {
        api.changeThreadEmoji(changeEmoji.icon, changeEmoji.thread_id);
    }
    const kick_user = botMsg.hanh_dong.kick_nguoi_dung;
    if (kick_user.status == true) {
        api.removeUserFromGroup(kick_user.user_id, kick_user.thread_id);
    }
    const add_user = botMsg.hanh_dong.add_nguoi_dung;
    if (add_user.status == true) {
        api.addUserToGroup(add_user.user_id, add_user.thread_id)
    }
};