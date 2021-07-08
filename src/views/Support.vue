<template>
  <div class="support page">
    <h2>Support</h2>
    <p>Feel free to contact me with any questions, bugs or feature requests.</p>
    <a href="mailto:hello@emilcarlsson.se"><eva-icon name="email-outline" /><span>hello@emilcarlsson.se</span></a>
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
  align-items: center;
  display: flex;
  font-size: 20px;
  justify-content: center;

  @include mobile {
    font-size: 16px;
  }

  i {
    margin-right: 8px;
    opacity: .5;
    position: relative;
    top: 2px;
  }
}
</style>