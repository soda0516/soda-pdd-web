<template>
  <div class="app-container">
    <UploadComV1 :parent-item-title="itemTitle" :source-mall-type="sourceMallType" :get-item-info-url="getItemInfoUrl"/>
  </div>
</template>

<script>
import UploadComV1 from './components/upload-com-v1'
export default {
  name: 'TaobaoUpload',
  components: { UploadComV1 },
  data() {
    return {
      itemTitle: '淘宝商品',
      sourceMallType: '0',
      getItemInfoUrl: '/pinduoduo-task-copy-taobao-to-pinduoduo/taobao-json'
    }
  }
}
</script>

<style scoped>

</style>
