<template>
  <div class="login">
    <div class="login__container">
      <h1>Simple login form</h1>
      <form class="form" @submit.prevent="onSubmit()">
        <div class="form__input">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="$v.form.email.$model"
            type="email"
            placeholder="Enter your email..."
          />
          <template v-if="errors">
            <div v-if="!$v.form.email.required" class="form__error">
              Email is required
            </div>
            <div v-else-if="!$v.form.email.email" class="form__error">
              Email is invalid
            </div>
          </template>
        </div>
        <div class="form__input">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="$v.form.password.$model"
            type="password"
            placeholder="Enter your password..."
          />
          <template v-if="errors">
            <div v-if="!$v.form.password.required" class="form__error">
              Password is required
            </div>
          </template>
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? "Loading..." : "Login" }}
        </button>
      </form>
      <div style="text-align: left; margin-top: 10px">
        <div>Demo email: admin@gmail.com</div>
        <div>Demo password: 12345678</div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "LoginVue",
  middleware: "protected",
  data: () => ({
    form: {
      email: "",
      password: "",
    },
    loading: false,
    errors: false,
  }),
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    async onSubmit() {
      this.$v.$touch();
      this.errors = this.$v.$anyError;
      if (!this.$v.$invalid) {
        this.loading = true;
        await this.onLogin();
        this.loading = false;
      } else {
        alert("Form is invalid!");
      }
    },
    async onLogin() {
      try {
        const { data } = await this.$axios.$post("/api/login", this.form);
        await this.$store.commit("auth/SET_TOKEN", data.token.token);
        await this.$store.commit("auth/SET_USER", data.user);
        const { form } = this.$route.query;
        if (form) {
          await this.$router.push({ path: form.toString() });
        } else {
          await this.$router.push({ path: "/profile" });
        }
      } catch (e) {
        alert("Error!");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  text-align: center;
  color: #000000;
  &__container {
    background-color: #52c7ac;
    border: 1px solid #2b5d51;
    color: #ffffff;
    padding: 40px 20px;
    border-radius: 5px;
    width: 100%;
    max-width: 300px;
    h1 {
      text-transform: uppercase;
      font-size: 20px;
      margin: 0 0 20px 0;
    }
  }
}
.form {
  &__error {
    display: block;
    text-align: left;
    font-size: 12px;
    color: #d02d2d;
    font-weight: 600;
  }
  &__input {
    margin-bottom: 5px;
    label {
      display: block;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    input {
      width: 100%;
      height: 30px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 3px;
      padding: 0 5px;
      border: 1px solid #2b5d51;
      background-color: #ffffff;
    }
  }
  button[type="submit"] {
    border-radius: 3px;
    cursor: pointer;
    margin-top: 20px;
    width: 100%;
    height: 30px;
    background-color: #257967;
    border: 1px solid #2b5d51;
    color: #ffffff;
  }
}
</style>
