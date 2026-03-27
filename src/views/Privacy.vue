<template>
  <div class="privacy page">
    <h2>Privacy</h2>
    <p>Your privacy is very important to us. This privacy policy applies to this website and the server powering it. 
      <br />
      <br />
      Since very few people actually read these, I will keep it short.
      <br />
      <br />
      Blabber itself does not store anything &ndash; no chat logs, no user accounts, no message history. All state is ephemeral and lives only in memory while you are connected.
      <br />
      <br />
      We use <a href="https://uguu.se/">Uguu.se</a> for file hosting. They have a similar policy of not storing user data beyond temporary file hosting.
      <br />
      <br />
      <b>Render</b> — Our API is hosted on <a href="https://render.com">Render</a> (render.com), a cloud infrastructure provider based in the United States. Network traffic, including IP addresses and connection metadata, may be logged by Render's infrastructure as part of normal operations. Render's data practices are governed by their <a href="https://render.com/privacy">Privacy Policy</a>.
      <br />
      <br />
      We could in the future switch to another host, but will always disclose what third-party infrastructure is in use.
    </p>
    
    <h3>Consent</h3>
    <p>By using our website and services, you hereby consent to the Privacy Policy and agree to its <router-link to="/terms">Terms and Conditions</router-link>.</p>

    <p class="sub">If you have any questions or need more information about the privacy policy, please contact me at <a href="mailto:hello@emilcarlsson.se">hello@emilcarlsson.se</a>.</p>
  </div>
</template>

<script>
export default {
  name: 'privacy'
}
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 30px;
}

h3 {
  margin: 40px 0 20px; 
}

p {
  margin-bottom: 15px;

  &.sub {
    margin-top: 30px;
  }
}
</style>