const { createApp, ref } = Vue;
const YU = 0x3;
const HUO = 0x8;
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
function uuid(length = 8, radix) {
  const uuid = [];
  const $radix = radix || CHARS.length;
  let index;

  if (length) {
    for (index = 0; index < length; index++) {
      // radix参数作用
      uuid[index] = CHARS[0 | (Math.random() * $radix)];
    }
  } else {
    // rfc4122, version 4 form
    let random;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (index = 0; index < 36; index++) {
      if (!uuid[index]) {
        random = 0 | (Math.random() * 16);
        uuid[index] = CHARS[index === 19 ? (random & YU) | HUO : random];
      }
    }
  }
  return uuid.join("");
}

createApp({
  setup(props) {
    const socket = io.connect();
    const chatApp = new Chat(socket);
    const myName = ref("");

    const chatList = ref([
      {
        type: "mine",
        name: myName.value,
        msg: "这是一条消息",
        id: uuid(),
      },
      {
        type: "out",
        name: "这是外部信息",
        msg: "这是一条消息",
        id: uuid(),
      },
      {
        type: "sys",
        name: "系统消息",
        msg: "系统消息",
        id: uuid(),
      },
    ]);

    socket.on("nameResult", (result) => {
      let message;
      if (result.success) {
        message = "您当前的昵称为" + result.name;
        myName.value = result.name;
      } else {
        message = result.message;
      }
      chatList.value.push({
        name: "系统消息",
        msg: message,
      });
    });
    const text = ref("");
    const textRef = ref();
    const handlerSend = (e) => {
      console.log(text.value);
      text.value = "";
      e.srcElement.blur();
    };

    const processUserInput = (chatApp, socket, message) => {
      if (message.charAt(0) === "/") {
      }
    };
    return {
      handlerSend,
      text,
      textRef,
      chatList,
      myName,
    };
  },
}).mount("#app");
