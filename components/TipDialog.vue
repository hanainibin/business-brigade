<template>
  <el-dialog title="提示" :visible.sync="tipDialogVisible" width="30%" :close-on-click-modal="false"
             :close-on-press-escape="false" :show-close="false">
    <span>{{tipText}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="clickEvent">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'TipDialog',
  props: {
    tipText: String,
    clickEvent: Function,
    tipDialogVisible: Boolean
  }
}
</script>
