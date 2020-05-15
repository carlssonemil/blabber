<template>
  <div>
    <ul id="users">
      <li class="user" v-for="(user, index) in users" :key="index">
        {{ user.username }} 
        <span v-if="user.typing">is typing...</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'users',
  props: ['users']
}
</script>

<style lang="scss" scoped>
ul {
  cursor: default;

  li {
    padding: 2px 0;

    span {
      opacity: .5;
    }

    + li {
      margin-top: 15px;
    }
  }
}
</style>