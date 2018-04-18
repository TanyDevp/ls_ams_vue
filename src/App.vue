<template>
  <div id="app">
    <Navigation/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 800px;
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}


.baseModal {
  border: 1px solid #ccc;
  height: 600px;
  padding: 5px 10px;
}

.baseModal:first-child {
  border-right: 0px;
}
</style>
