<template>
  <div :align="align">
    <span class="text-md-body-1 text-sm-body-2 text-body-2 font-weight-bold">
      {{datum? datum.displayName: displayName}}
    </span>
    <br v-if="!datum || datum.fullWidth"/>
    <span class="text-md-body-1 text-sm-body-2 text-body-2 font-weight-regular">
      <span v-if="!value && !datum.extractor">{{profile[datum.field]}}</span>
      <span v-else-if="!value">{{datum.extractor(profile)}}</span>
      <span v-else>{{value}}</span>
    </span>
  </div>
</template>
<script>
export default {
  name: 'ProfileField',
  props: {
    datum: null,
    profile: null,
    value: null,
    displayName: null,
    align: {
      type: String,
      required: false,
      default: 'left',
    },
  },
};

</script>
