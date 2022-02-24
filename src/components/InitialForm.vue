<template>
  <div>
    <v-container>
      <ValidationObserver v-slot="{ invalid }" ref="observer">
        <form @submit.prevent="onSubmit">
          <v-row>
            <!-- first name -->
            <v-col cols="12" md="6">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|min:3|alpha"
              >
                <v-text-field
                  :disabled="loading"
                  dense
                  label="نام"
                  v-model="form.first_name"
                  :error-messages="errors[0]"
                  :hide-details="errors.length === 0"
                >
                </v-text-field>
              </ValidationProvider>
            </v-col>
            <!-- last name -->
            <v-col cols="12" md="6">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|min:3|alpha"
              >
                <v-text-field
                  :disabled="loading"
                  :error-messages="errors[0]"
                  :hide-details="errors.length === 0"
                  dense
                  label="نام خانوادگی"
                  v-model="form.last_name"
                >
                </v-text-field>
              </ValidationProvider>
            </v-col>
            <!-- mobile -->
            <v-col cols="12" md="6">
              <ValidationProvider
                v-slot="{ errors }"
                :rules="{ required: true, regex: /^9\d{9}$/ }"
              >
                <v-text-field
                  :disabled="loading"
                  :error-messages="errors[0]"
                  :hide-details="errors.length === 0"
                  dense
                  label="تلفن همراه"
                  v-model.number="form.coordinate_mobile"
                >
                  <template slot="append">98+</template>
                </v-text-field>
              </ValidationProvider>
            </v-col>
            <!-- phone line -->
            <v-col cols="12" md="6">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|digits:10"
              >
                <v-text-field
                  :disabled="loading"
                  :error-messages="errors[0]"
                  :hide-details="errors.length === 0"
                  dense
                  label="تلفن ثابت"
                  v-model="form.coordinate_phone_number"
                >
                  <template slot="append">0</template>
                </v-text-field>
              </ValidationProvider>
            </v-col>
            <!-- address -->
            <v-col cols="12" md="6">
              <ValidationProvider v-slot="{ errors }" rules="required|min:10">
                <v-textarea
                  :disabled="loading"
                  rows="1"
                  name="address"
                  data-vv-as="آدرس"
                  :error-messages="errors[0]"
                  :hide-details="errors.length === 0"
                  dense
                  label=" آدرس"
                  v-model="form.address"
                >
                </v-textarea>
              </ValidationProvider>
            </v-col>
            <!-- gender -->
            <v-col cols="12" md="6">
              <v-btn-toggle
                v-model="form.gender"
                mandatory
                rounded
                :disabled="loading"
              >
                <v-btn value="male" small color="primary" elevation="0">
                  آقا
                </v-btn>
                <v-btn value="female" small color="primary" elevation="0">
                  خانم
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <!-- map -->
            <v-col cols="12">
              <GmapMap
                :disabled="loading"
                :center="center"
                :zoom="18"
                map-style-id="roadmap"
                :options="mapOptions"
                style="width: 100vmin; height: 50vmin"
                ref="mapRef"
                @click="handleMapClick"
              >
                <GmapMarker
                  :position="marker.position"
                  :clickable="true"
                  :draggable="true"
                  @drag="handleMarkerDrag"
                  @click="panToMarker"
                />
              </GmapMap>
              <p>مختصات انتخاب شده: {{ marker.position }}</p>
            </v-col>
            <!-- actions -->
            <v-col cols="12" md="6">
              <v-btn type="submit"  :disabled="loading || invalid" color="success">
                ارسال
              </v-btn>
              
            </v-col>
          </v-row>
        </form>
      </ValidationObserver>
 
    </v-container>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import { required, regex, digits, min, alpha } from "vee-validate/dist/rules";
// import axios from "axios";
extend("required", {
  ...required,
  message: "پر کردن این فیلد الزامی است",
});
extend("regex", {
  ...regex,
  message: "لطفا شماره همراه معتبر وارد کنید",
});
extend("alpha", {
  ...alpha,
  message: "لطفا فقط کاراکتر حرفی وارد کنید",
});
extend("digits", {
  ...digits,
  message: "لطفا شماره ثابت معتبر وارد کنید",
});
extend("min", {
  ...min,
  message: "لطفا مقدار معتبر وارد کنید",
});

export default {
  name: "InitialForm",
  components: { ValidationProvider, ValidationObserver },
  data() {
    return {
      marker: { position: { lat: 10, lng: 10 } },
      center: { lat: 10, lng: 10 },
      mapOptions: {
        disableDefaultUI: true,
      },
      form_default: {
        region: 1,
        first_name: null,
        last_name: null,
        gender: null,
        lat: null,
        lng: null,
        address: null,
        coordinate_mobile: null,
        coordinate_phone_number: null,
      },
      form: null,
      loading: false,
    };
  },
  mounted() {
    this.geolocate();
  },

  methods: {
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.marker.position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.panToMarker();
      });
    },

    handleMarkerDrag(e) {
      this.marker.position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    },

    panToMarker() {
      this.$refs.mapRef.panTo(this.marker.position);
      this.$refs.mapRef.setZoom(18);
    },

    handleMapClick(e) {
      this.marker.position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      console.log(e);
    },
    async onSubmit() {
      const form_data = this.prepare();
      this.loading = true;
      try {
        await this.axios.post(
          "http://stage.achareh.ir/api/karfarmas/address",
          form_data,
          {
            headers: {
              Authorization: "Basic MDk4MjIyMjIyMjI6c2FuYTEyMzQ=",
            },
          }
        );
        this.$swal.fire({
          icon: "success",
          title: "اظلاعات با موفقیت ارسال شد",
          showConfirmButton: false,
        });
        this.reset();
      this.$emit('change',2)
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
    prepare() {
      let form_dup = Object.assign({}, this.form);
      // set lng and lot
      form_dup.lat = this.marker.position.lat;
      form_dup.lng = this.marker.position.lng;
      //
      form_dup.coordinate_mobile = "0" + form_dup.coordinate_mobile;
      form_dup.coordinate_phone_number = "0" + form_dup.coordinate_phone_number;
      return form_dup;
    },
    reset() {
      this.form = Object.assign({}, this.form_default);
      this.$refs.observer.reset();
    },
  },
  created() {
    this.form = Object.assign({}, this.form_default);
  },
};
</script>
