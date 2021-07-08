<template>
  <div class="privacy page">
    <h2>Privacy</h2>
    <p>Your privacy is very important to us. This privacy policy applies to this website and the server powering it. 
      <br />
      <br />
      Since very few people actually read these, I will keep it short.
      <br />
      <br />
      We do not store anything on our servers that could be directly linked to you &ndash; no logs, no IPs, <b>nothing</b>. 
      At the moment we use <a href="https://uguu.se/">Uguu.se</a> for the file hosting, which has the same policy of complete anonymity.
      <br />
      <br />
      We could in the future switch to another host, but will try as best we can to keep this strict anonymity policy.
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