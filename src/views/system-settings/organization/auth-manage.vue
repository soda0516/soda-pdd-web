<template>
  <div>
<!--    添加一个角色并分配权限-->
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple">
        <div class="app-container">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="角色名称">
              <el-input v-model="form.name" placeholder="请输入英文名称"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="form.name" placeholder="请输入中文名称"></el-input>
            </el-form-item>
            <el-form-item label="权限列表">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                <el-checkbox label="地推活动" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">新增角色</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      </el-col>
<!--      更改权限的列表-->
      <el-col :span="12">
        <div class="app-container">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="角色列表">
              <el-select v-model="form.region" placeholder="请选择要重置权限角色">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权限列表">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                <el-checkbox label="地推活动" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="warning">重置权限</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div><div class="grid-content bg-purple">
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AuthManage',
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
