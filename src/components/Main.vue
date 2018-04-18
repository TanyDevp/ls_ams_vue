<template>
  <Row>
    <Col span="20" class="baseModal">
    </Col>
    <Col span="4" class="baseModal">
    <Alert>
      <h3>在线人数：89</h3>
    </Alert>
    <ul class="onlineuser_ul">
      <li>
        <Icon type="chatbubbles onlineIcon"></Icon>
        <span>路人甲</span>
      </li>
      <li>
        <Icon type="chatbubbles onlineIcon"></Icon>
        <span>路人乙</span>
      </li>
      <li>
        <Icon type="chatbubbles onlineIcon"></Icon>
        <span>路人丙</span>
      </li>
      <li>
        <Icon type="chatbubbles onlineIcon"></Icon>
        <span>路人丁</span>
      </li>
    </ul>

    </Col>
  </Row>
</template>

<script>
export default {
  data() {
    return {
      // msg: 'Welcome to Your Vue.js App'
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ivu-alert {
  padding: 8px 48px;
}

.onlineuser_ul {
  text-align: left;
  list-style: none;
  padding: 5px 10px;
}

.onlineuser_ul li {
  padding: 5px 0;
  cursor: pointer;
}

.onlineuser_ul li:hover {
 background-color: #eee;
}

.onlineIcon {
  color: #13b394;
  padding-right: 10px;
}
</style>
