const { createApp, ref } = Vue;

createApp({
  data() {
    return {
      message: "Hello Vue!",
    };
  },
  setup(props) {
    const text = ref("");
    const textRef = ref();
    const handlerSend = (e) => {
      console.log(text.value);
      text.value = "";
      e.srcElement.blur();
    };
    return {
      handlerSend,
      text,
      textRef,
    };
  },
}).mount("#app");
