<template>
  <div :align="align" :class="align === 'right'?'pl-10':''">
    <span class="text-md-body-1 text-sm-body-2 font-weight-bold">
      {{datum.displayName}}
    </span>
    <br v-if="datum.fullWidth"/>
    <span class="text-md-body-1 text-sm-body-2 font-weight-regular">
      <span v-if="!datum.extractor">{{profile[datum.field]}}</span>
      <span v-else>{{datum.extractor(profile)}}</span>
    </span>
  </div>
</template>
<script>
export default {
  name: 'ProfileField',
  props: {
    datum: null,
    profile: null,
    align: {
      type: String,
      required: false,
      default: 'left',
    },
  },
};

</script>
