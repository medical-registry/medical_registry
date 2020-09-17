<template>
  <div :align="align">
    <span class="text-md-body-1 text-sm-body-2 text-body-2 font-weight-bold">
      {{datum? datum.displayName: displayName}}
    </span>
    <br v-if="!datum || datum.fullWidth"/>
    <span class="text-md-body-1 text-sm-body-2 text-body-2 font-weight-regular">
      <span v-if="!value && datum && datum.field === 'blood_group'">
          <span
            style="font-family: Impact, Charcoal, sans-serif;"
            class="red--text font-weight-bold text-h7">{{profile[datum.field]}}</span>
      </span>
      <span v-else-if="!value && datum && datum.field === 'sex'">
          <i v-if="profile[datum.field] === 'F'"
             class="v-icon notranslate mdi mdi-human-female theme--light pink--text"></i>
          <i v-if="profile[datum.field] === 'M'"
             class="v-icon notranslate mdi mdi-human-male theme--light light-blue--text"></i>
      </span>
      <span v-else-if="!value && datum && !datum.extractor">{{profile[datum.field]}}</span>
      <span v-else-if="!value && datum.extractor">{{datum.extractor(profile)}}</span>
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
