<template>
  <v-app dir="rtl">
    <div>
      <v-container>
        <v-alert>
          سلام وقت بخیر من معمولا با typescript و propertydecorators کد میزنم و
          axios رو هم کانفیگ میکنم و رویس ها رو هم تو ی فایل جداگونه میزارم ولی
          الان بدلیل محدودیت زمان نرسیدم این کارا رو انجام بدم .
        </v-alert>
        <initial-form @change="step = $event" v-if="step === 1" />
        <list v-if="step === 2" @change="step = $event" />
      </v-container>
    </div>
  </v-app>
</template>

<script>
import InitialForm from "./components/InitialForm.vue";
import List from "./components/List.vue";
export default {
  name: "App",
  components: { InitialForm, List },
  data() {
    return {
      step: 1,
    };
  },
  mounted() {},
};
</script>
