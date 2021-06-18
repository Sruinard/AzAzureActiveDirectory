<template>
  <v-container class="mt-5">
    <v-row class="text-center pa-xl">
      <v-col>
        <h3>Search for cabs in city</h3>
        <v-text-field v-model="search" label="Search" required></v-text-field>
        <v-text-field
          v-model="max_hourly_price"
          label="Max Price"
          required
        ></v-text-field>
        <v-btn color="primary" @click="Fetch">Fetch</v-btn>
        <v-card
          class="mx-auto pa-2 ma-2"
          max-width="344"
          outlined
          v-for="item in all_items"
          :key="item.id"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">
                {{ item.city }} -- {{ item.brand}}
              </div>
              <v-list-item-subtitle>
                {{ item.hourly_price }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item> </v-card
        ><v-card></v-card> </v-col
      ><v-col>
        <h3>Create a cab for the city of your likings.</h3>
        <form>
          <v-text-field v-model="city" label="City" required></v-text-field>
          <v-text-field v-model="brand" label="Brand" required></v-text-field>
          <v-text-field
            v-model="hourly_price"
            label="Price per hour"
            required
          ></v-text-field>
          <v-btn color="primary" @click="submit">Submit</v-btn>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CabPage",
  mounted() {
    this.Fetch();
  },
  data: function () {
    return {
      city: "Amsterdam",
      brand: "",
      max_hourly_price: 100,
      hourly_price: 100,
      search: "Amsterdam",
      items: [],
    };
  },
  computed: {
    all_items() {
      return this.$store.state.cabs;
    },
  },
  methods: {
    Fetch() {
      this.$store.dispatch("getCabs", { city: this.search, max_price: this.max_hourly_price });
    },
    submit() {
      this.$store.dispatch("postCab", { city: this.city, brand: this.brand, hourly_price: this.hourly_price });
    },
  },
};
</script>
