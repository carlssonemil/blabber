<template>
  <div class="support page">
    <h2>Support</h2>
    <p>Feel free to contact me with any questions, bugs or feature requests.</p>
    <a href="mailto:hello@emilcarlsson.se">hello@emilcarlsson.se</a>
  </div>
</template>

<script>
export default {
  name: 'support'
}
</script>

<style lang="scss" scoped>
.support {
  text-align: center;
}

h2 {
  margin-bottom: 30px;
}

h3 {
  margin: 40px 0 20px; 
}

p {
  margin-bottom: 25px;

  &.sub {
    font-size: 16px;
    margin-top: 75px;
  }
}

a {
  font-size: 20px;
}
</style>