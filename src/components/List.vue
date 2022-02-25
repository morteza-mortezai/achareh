<template>
  <div>
    <v-data-table :items="items" :headers="headers" :loading="loading">
    </v-data-table>
    <v-btn @click="$emit('change', 1)">back</v-btn>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      loading: false,
      items: [],
      headers: [
        {
          text: "id",
          value: "id",
          align: "left",
          sortable: true,
        },
        {
          text: "first_name",
          value: "first_name",
          align: "left",
          sortable: true,
        },
        {
          text: "last_name",
          value: "last_name",
          align: "left",
          sortable: true,
        },
        {
          text: "gender",
          value: "gender",
          align: "left",
          sortable: true,
        },
        {
          text: "address",
          value: "address",
          align: "left",
          sortable: true,
        },
        {
          text: "lat",
          value: "lat",
          align: "left",
          sortable: true,
        },
        {
          text: "lng",
          value: "lng",
          align: "left",
          sortable: true,
        },
        {
          text: "coordinate_mobile",
          value: "coordinate_mobile",
          align: "left",
          sortable: true,
        },
        {
          text: "coordinate_phone_number",
          value: "coordinate_phone_number",
          align: "left",
          sortable: true,
        },
      ],
    };
  },

  methods: {
    async get() {
      this.loading = true;
      try {
        const res = await this.axios.get(
          "http://stage.achareh.ir/api/karfarmas/address",
          {
            headers: {
              Authorization: "Basic MDk4MjIyMjIyMjI6c2FuYTEyMzQ=",
            },
          }
        );
        this.items = res.data;
        this.$swal.fire({
          icon: "success",
          title: "اطلاعات با موفقیت دریافت شد",
          showConfirmButton: false,
        });
      } catch (err) {
        console.log(err);
        this.$swal.fire({
          icon: "error",
          title: "Oops...",
          text: "خطایی رخ داده است !!",
        });
      }
      this.loading = false;
    },
  },
  mounted() {
    this.get();
  },
};
</script>
