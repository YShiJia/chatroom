const Koa = require('koa');
const Router = require('koa-router');
const cors = require("koa2-cors");
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const app = new Koa();
const router = new Router();

const idleTime = 15 * 1000;
const UserList = new Map();
// UserList.set('Alice0', { lastAlive: '2024/10/27 11:02:23', room: 'aaa' });
// UserList.set('Alice1', { lastAlive: '2024/10/27 11:02:23', room: 'aaa' });
// UserList.set('Alice2', { lastAlive: '2024/10/27 11:02:23', room: 'bbb' });
// UserList.set('Alice3', { lastAlive: '2024/10/27 11:02:23', room: 'bbb' });
const RoomList = new Map();
RoomList.set('aaa', true);
RoomList.set('bbb', true);
const roomUserListMap = new Map();
// roomUserListMap.set('aaa', ['Alice0', 'Alice1']);
// roomUserListMap.set('bbb', ['Alice2', 'Alice3']);
const roomMsgListMap = new Map();
// roomMsgListMap.set('aaa', [
// 	{ id: 0, sender: 'Alice0', time: '2024/10/27 11:02:23', content: 'Hello there!' },
// 	{ id: 1, sender: 'Alice1', time: '2024/10/27 11:02:23', content: 'Hello there!' },
// ]);
// roomMsgListMap.set('bbb', [
// 	{ id: 0, sender: 'Alice2', time: '2024/10/27 11:02:23', content: 'Hello there!' },
// 	{ id: 1, sender: 'Alice3', time: '2024/10/27 11:02:23', content: 'Hello there!' },
// ]);

// 定义敏感词列表
const sensitiveWords = ['sb', 'cnm', 'cs'];
// 构建正则表达式
const sensitiveRegex = new RegExp(sensitiveWords.join('|'), 'gi');


//定时检查
setInterval(() => {
	var now = new Date();
	for (var [key, value] of UserList.entries()) {
		var lastTime = new Date(value.lastAlive);
		if (now - lastTime > idleTime) {
			UserList.delete(key);
			var tmpUserlist = roomUserListMap.get(value.room) || [];
			var index = tmpUserlist.indexOf(key)
			if (index != -1) {
				tmpUserlist.splice(index, 1);
			}
			roomUserListMap.set(value.room, tmpUserlist);

			// 添加离开消息
			var msg = {};
			msg.id = roomMsgListMap.get(value.room).length;
			msg.sender = '系统消息';
			msg.time = new Date().toLocaleString();
			msg.content = `${key}离开房间`;
			roomMsgListMap.get(value.room).push(msg);
		}
	}
}, idleTime / 3);
// user保活
router.get('/user/keepalive', async (ctx) => {
	const username = ctx.query.username;
	const roomname = ctx.query.roomname;
	UserList.set(username, { lastAlive: new Date().toLocaleString(), room: roomname });
	ctx.body = 'keepalive ' + username + ' success';
	ctx.state = 200;
});
// user加入房间
router.get('/user/joinroom', async (ctx) => {
	const username = ctx.query.username;
	const roomname = ctx.query.roomname;
	if (UserList.has(username)) {
		// console.log(username + '已存在')
		// 用户已存在，删除其他房间该用户信息
		var room = UserList.get(username).room;
		var tmpUserlist = roomUserListMap.get(room) || [];
		var index = tmpUserlist.indexOf(username)
		if (index != -1) {
			tmpUserlist.splice(index, 1);
		}
		roomUserListMap.set(room, tmpUserlist);
	}
	// 更新用户信息
	UserList.set(username, { lastAlive: new Date().toLocaleString(), room: roomname });
	// 房间不存在则创建房间
	if (!RoomList.has(roomname))
		RoomList.set(roomname, true);
	if (!roomUserListMap.has(roomname))
		roomUserListMap.set(roomname, []);
	if (!roomMsgListMap.has(roomname))
		roomMsgListMap.set(roomname, []);
	// 添加用户到房间
	roomUserListMap.get(roomname).push(username);
	// 添加欢迎消息
	var msg = {};
	msg.id = roomMsgListMap.get(roomname).length;
	msg.sender = '系统消息';
	msg.time = new Date().toLocaleString();
	msg.content = `欢迎${username}加入房间`;
	roomMsgListMap.get(roomname).push(msg);

	ctx.body = { info: "加入成功", msgId: msg.id };
	ctx.status = 200;
})
// 获取房间列表
router.get('/room/roomlist', async (ctx) => {
	var roomlist = [];
	for (const [key, value] of RoomList.entries()) {
		roomlist.push(key);
	}
	ctx.body = roomlist;
	ctx.status = 200;
});
// 获取房间用户列表
router.get('/room/userlist', async (ctx) => {
	const roomname = ctx.query.roomname;
	const res = roomUserListMap.get(roomname) || [];
	ctx.body = res;
	ctx.status = 200;
});
// 获取房间消息列表
router.get('/room/msglist', async (ctx) => {
	const msgId = ctx.query.msgId;
	const roomname = ctx.query.roomname;
	const res = roomMsgListMap.get(roomname) || [];
	ctx.body = res.slice(msgId);
	ctx.status = 200;
});
//敏感词过滤
function filterSensitiveWords(text) {
	return text.replace(sensitiveRegex, (match) => {
		// 返回替换后的字符串（用 * 代替敏感词）
		return '*'.repeat(match.length);
	});
}
// 发送消息
router.post('/room/sendmsg', async (ctx) => {
	const { msg, roomname } = ctx.request.body;
	if (!roomMsgListMap.has(roomname))
		roomMsgListMap.set(roomname, []);
	msg.id = roomMsgListMap.get(roomname).length;
	//敏感词过滤
	msg.content = filterSensitiveWords(msg.content);
	roomMsgListMap.get(roomname).push(msg);
	// console.log(msg.content);
	// //真正的 emoji 数据
	// fs.writeFile("./a.txt", msg.content, (err) => {
	// 	if (err) {
	// 	  console.error('Error writing file:', err);
	// 	  return;
	// 	}
	// 	console.log('File has been saved!');
	//   });
	ctx.body = { msg: msg, info: '发送消息成功' };
	ctx.state = 200;
});

app.use(cors());
app.use(bodyParser());
app.use(router.routes(), router.allowedMethods());

app.listen(3000, () => {
	console.log('Server is running at http://localhost:3000');
});
