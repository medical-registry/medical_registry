<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on, attrs }">
       <span class="text-subtitle-2 capitalized">
         <v-icon color="black" small>mdi-map-marker</v-icon>
         <a v-bind="attrs" v-on="on">
           {{fullAddress}}
         </a>
       </span>
    </template>
    <v-card>
      <v-card-title class="pa-5">
        {{location.name}}
      </v-card-title>
      <v-card-text style="padding-left: 50px">
        <GmapMap
          :options="options"
          :center="center"
          :zoom="17"
          style="width: 700px; height: 450px;">
          <GmapMarker :clickable="true" :position="position"  v-on:click="showInfo = true"/>
          <GmapInfoWindow :position="position" :opened="showInfo" @closeclick="showInfo=false">
            {{location.address}}, {{location.zip_code}}, {{location.city}}
          </GmapInfoWindow>
        </GmapMap>
      </v-card-text>
      <v-card-actions class="pa-5">
        <v-spacer/>
        <v-btn>Apri su Google Maps</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'Map',
  props: {
    location: null,
  },
  data() {
    return {
      options: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: true,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false,
      },
      dialog: false,
      showInfo: true,
      center: {
        lat: this.location.lat,
        lng: this.location.lon,
      },
      position: {
        lat: this.location.lat,
        lng: this.location.lon,
      },
      fullAddress: `
        ${this.location.name},
        ${this.location.address},
        ${this.location.zip_code},
        ${this.location.city}`,
    };
  },
};
</script>
