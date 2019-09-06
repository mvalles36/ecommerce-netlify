<template>
  <div id="app">
    <div v-if="cartUIStatus === 'idle'" class="payment">
      <h3>Please Enter Your Payment Information:</h3>
      <label for="email">Email</label>
      <br />
      <input id="email" type="email" v-model="stripeEmail" placeholder="name@example.com" />
      <br />
      <label for="card">Credit Card</label>
      <br />
      <small>
      </small>
      <card
        class="stripe-card"
        id="card"
        :class="{ complete }"
        stripe="pk_live_o9wuX7m3t4YeyzDRpV1sqTib002VMnqklN"
        :options="stripeOptions"
        @change="complete = $event.complete"
      />
      <button
        class="pay-with-stripe button"
        @click="pay"
        :disabled="!complete || !stripeEmail"
      >Pay with credit card</button>
    </div>

    <div v-else class="statussubmit">
      <div v-if="cartUIStatus === 'failure'">
        <h3>OH NO!</h3>
        <p>Something F!#%# Up!</p>
        <button @click="clearCart">Please Try Again</button>
      </div>

      <div v-else-if="cartUIStatus === 'loading'" class="loadcontain">
        <h4>Please hold, we're filling your cart up with a bunch of good stuff</h4>
        <p>Initiating the awesome!</p>
      </div>

      <div v-else-if="cartUIStatus === 'success'" class="loadcontain">
        <h4>Success!</h4>
      </div>
    </div>
  </div>
</template>
 
<script>
import { Card, createToken } from "vue-stripe-elements-plus";
import { mapState } from "vuex";
export default {
  components: { Card },
  computed: {
    ...mapState(["cartUIStatus"])
  },
  data() {
    return {
      complete: false,
      stripeOptions: {
        // you can configure that cc element. I liked the default, but you can
        // see https://stripe.com/docs/stripe.js#element-options for details
      },
      stripeEmail: ""
    };
  },
  methods: {
    pay() {
      createToken().then(data => {
        const stripeData = { data, stripeEmail: this.stripeEmail };
        this.$store.dispatch("postStripeFunction", stripeData);
      });
    },
    clearCart() {
      this.complete = false;
      this.$store.commit("clearCartCount");
    }
  }
};
</script> 
 
<style lang="scss" scoped>
input,
button {
  width: 100%;
}

button {
  margin-top: 20px;
}

.payment {
  margin-top: 20px;
}

.stripe-card {
  margin-top: 10px;
  width: 100%;
  border: 1px solid #ccc;
  padding: 5px 10px;
}

.stripe-card.complete {
  border-color: green;
}
</style> 
