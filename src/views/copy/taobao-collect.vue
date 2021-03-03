<template >
  <div class="app-container">
    <CollectComV1 />
  </div>
</template>

<script>
import CollectComV1 from './components/collect-com-v1'
export default {
  name: 'TaobaoCollect',
  components: { CollectComV1 },
  data() {
    return {
      itemTitle: '淘宝店铺链接',
      sourceMallType: '0',
      getItemInfoUrl: '/pinduoduo-task-copy-taobao-to-pinduoduo/taobao-json',
      mallGoodsListUrl: '/pinduoduo-task-copy-taobao-to-pinduoduo/list/goods/mall-url'
    }
  }
}
</script>

<style scoped>

</style>
