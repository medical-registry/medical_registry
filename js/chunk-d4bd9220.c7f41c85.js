(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d4bd9220"],{"1f4f":function(e,t,a){"use strict";a("a9e3");var s=a("5530"),i=(a("8b37"),a("80d2")),n=a("7560"),r=a("58df");t["a"]=Object(r["a"])(n["a"]).extend({name:"v-simple-table",props:{dense:Boolean,fixedHeader:Boolean,height:[Number,String]},computed:{classes:function(){return Object(s["a"])({"v-data-table--dense":this.dense,"v-data-table--fixed-height":!!this.height&&!this.fixedHeader,"v-data-table--fixed-header":this.fixedHeader},this.themeClasses)}},methods:{genWrapper:function(){return this.$slots.wrapper||this.$createElement("div",{staticClass:"v-data-table__wrapper",style:{height:Object(i["f"])(this.height)}},[this.$createElement("table",this.$slots.default)])}},render:function(e){return e("div",{staticClass:"v-data-table",class:this.classes},[this.$slots.top,this.genWrapper(),this.$slots.bottom])}})},6204:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-card",{attrs:{elevation:"0"}},[a("v-card-title",[e._v("Interventi ")]),a("v-timeline",{attrs:{"align-top":"",dense:""}},e._l(e.items,(function(t){return a("v-timeline-item",{key:t.id_care,attrs:{small:""}},[a("v-card",{staticClass:"elevation-3"},[a("v-card-title",{staticClass:"text-center"},[e._v(e._s(t.intervention.name))]),t.to?a("v-card-title",{staticClass:"headline capitalized"},[e._v("Dal "+e._s(e.formatDate(t.from))+" al "+e._s(e.formatDate(t.to))+" ")]):a("v-card-title",{staticClass:"headline capitalized"},[e._v(e._s(e.formatDate(t.from))+" ")]),a("v-card-text",[a("v-simple-table",{scopedSlots:e._u([{key:"default",fn:function(){return[a("thead",[a("tr",[a("th",{staticClass:"text-left"},[e._v("Causa (link)")]),t.note?a("th",{staticClass:"text-left",staticStyle:{width:"500px"}},[e._v("Note")]):e._e(),t.body_impacted?a("th",{staticClass:"text-left"},[e._v(" Parte del corpo")]):e._e(),a("th",{staticClass:"text-left"},[e._v("Informazioni ricovero")]),a("th",{attrs:{colspan:"2"}})])]),a("tbody",[a("tr",[t.trauma?a("td",[e._v(e._s(t.trauma.name))]):e._e(),t.disease?a("td",[e._v(e._s(t.diseaseRegister.name))]):e._e(),t.note?a("td",[e._v(e._s(t.note))]):e._e(),t.body_impacted?a("td",[e._v(" "+e._s(t.body_impacted))]):e._e(),a("td",[e._v("Link Ricovero")]),a("td",{attrs:{colspan:"4"}})])])]},proxy:!0}],null,!0)})],1)],1)],1)})),1),a("AutocompleteSearch",{attrs:{"invalid-hint":"Seleziona Intervento",label:"Intervento",table:e.database.intervention_register}})],1)},i=[],n=(a("d81d"),a("d3b7"),a("6062"),a("3ca3"),a("ddb0"),a("5530")),r=a("2909"),o=(a("96cf"),a("1da1")),d=a("8527"),l=a("f773"),c=a("c1df"),u=a.n(c),v=a("b28a"),h={name:"Interventions",components:{AutocompleteSearch:v["a"]},methods:{formatDate:function(e){return u()(e).format("LL")},fetchInterventions:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var a,s,i,o,c,u,v,h,_,m,f,p;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,l["a"].interventions.where({id_person:e.$store.state.user.id}).toArray();case 2:return a=t.sent,s=Object(r["a"])(new Set(a.map((function(e){return e.id_intervention})))),t.next=6,l["a"].intervention_register.bulkGet(s);case 6:return i=t.sent,o=Object(d["keyBy"])(i,"id"),t.next=10,l["a"].traumas.where({id_person:e.$store.state.user.id}).toArray();case 10:return c=t.sent,u=Object(d["keyBy"])(c,"id_trauma"),t.next=14,l["a"].diseases.where({id_person:e.$store.state.user.id}).toArray();case 14:return v=t.sent,h=Object(d["keyBy"])(v,"id_care"),t.next=18,l["a"].disease_register.toArray();case 18:return _=t.sent,m=Object(d["keyBy"])(_,"id"),t.next=22,l["a"].hospitalization.where({id_person:e.$store.state.user.id}).toArray();case 22:f=t.sent,p=Object(d["keyBy"])(f,"id_hospitalization"),e.items=a.map((function(e){var t,a;return Object(n["a"])(Object(n["a"])({},e),{},{intervention:o[e.id_intervention],trauma:u[e.id_trauma],disease:h[e.id_disease],hospitalization:p[e.id_hospitalization],diseaseRegister:m[null!==(t=null===(a=h[e.id_disease])||void 0===a?void 0:a.id_disease)&&void 0!==t?t:0]})}));case 25:case"end":return t.stop()}}),t)})))()}},data:function(){return{database:l["a"],items:null}},created:function(){this.fetchInterventions()}},_=h,m=a("2877"),f=a("6544"),p=a.n(f),b=a("b0af"),y=a("99d9"),x=a("1f4f"),w=a("8414"),g=a("1e06"),C=Object(m["a"])(_,s,i,!1,null,null,null);t["default"]=C.exports;p()(C,{VCard:b["a"],VCardText:y["b"],VCardTitle:y["c"],VSimpleTable:x["a"],VTimeline:w["a"],VTimelineItem:g["a"]})},"8b37":function(e,t,a){}}]);
//# sourceMappingURL=chunk-d4bd9220.c7f41c85.js.map