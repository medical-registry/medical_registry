(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d4660694"],{"1f4f":function(e,t,a){"use strict";a("a9e3");var r=a("5530"),l=(a("8b37"),a("80d2")),i=a("7560"),n=a("58df");t["a"]=Object(n["a"])(i["a"]).extend({name:"v-simple-table",props:{dense:Boolean,fixedHeader:Boolean,height:[Number,String]},computed:{classes:function(){return Object(r["a"])({"v-data-table--dense":this.dense,"v-data-table--fixed-height":!!this.height&&!this.fixedHeader,"v-data-table--fixed-header":this.fixedHeader},this.themeClasses)}},methods:{genWrapper:function(){return this.$slots.wrapper||this.$createElement("div",{staticClass:"v-data-table__wrapper",style:{height:Object(l["f"])(this.height)}},[this.$createElement("table",this.$slots.default)])}},render:function(e){return e("div",{staticClass:"v-data-table",class:this.classes},[this.$slots.top,this.genWrapper(),this.$slots.bottom])}})},"8b37":function(e,t,a){},9597:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-card",[a("v-card-title",[e._v("Allergie ")]),a("v-timeline",{attrs:{"align-top":"",dense:""}},e._l(e.items,(function(t){return a("v-timeline-item",{key:t.id_care,attrs:{small:""}},[e.editing?a("v-card",[a("td",{staticClass:"pa-0 px-2"},[a("AutocompleteSearch",{attrs:{"invalid-hint":"Seleziona Allergia",label:"Allergia",table:e.database.allergy_register,required:!0,"initial-value":e.def},on:{change:e.updateAllergy}})],1),a("td",{staticClass:"pa-0 px-2"},[a("v-text-field",{attrs:{label:"Severità",type:"text"},model:{value:t.severity,callback:function(a){e.$set(t,"severity",a)},expression:"item.severity"}})],1),a("td",[a("v-checkbox",{attrs:{label:"Intolleranza"},model:{value:t.intolerance,callback:function(a){e.$set(t,"intolerance",a)},expression:"item.intolerance"}})],1),a("td",{staticClass:"pa-0 px-2"},[a("v-text-field",{attrs:{label:"Note",type:"text"},model:{value:t.note,callback:function(a){e.$set(t,"note",a)},expression:"item.note"}})],1),a("td",{staticClass:"text-right"},[a("v-btn",{attrs:{color:"error",fab:"","x-small":"",dark:"",elevation:"0"},on:{click:function(t){e.editing=!1}}},[a("v-icon",[e._v("mdi-close")])],1),a("v-btn",{staticClass:"mr-0 ml-3",attrs:{color:"primary",fab:"","x-small":"",dark:"",elevation:"0"},on:{click:function(t){return e.save()}}},[a("v-icon",[e._v("mdi-content-save")])],1)],1)]):a("v-card",{key:e.allergy.id_care,attrs:{elevation:"0"}},[a("v-card",{staticClass:"elevation-3"},[a("v-card-title",{staticClass:"text-center"},[e._v(e._s(t.allergy.name)+" ("+e._s(t.allergy.category)+")")]),t.to?a("v-card-title",{staticClass:"headline capitalized"},[e._v("Dal "+e._s(e.formatDate(t.from))+" al "+e._s(e.formatDate(t.to))+" ")]):a("v-card-title",{staticClass:"headline capitalized"},[e._v(e._s(e.formatDate(t.from))+" ")]),a("v-card-text",[a("v-simple-table",{scopedSlots:e._u([{key:"default",fn:function(){return[a("thead",[a("tr",[a("th",{staticClass:"text-left"},[e._v("Intolleranza")]),a("th",{staticClass:"text-left"},[e._v("Severità")]),t.note?a("th",{staticClass:"text-left",staticStyle:{width:"500px"}},[e._v("Note")]):e._e(),a("th",{attrs:{colspan:"2"}})])]),a("tbody",[a("tr",["N"==t.intolerance?a("td",[e._v("No")]):a("td",[e._v("Si")]),a("td",[e._v(e._s(t.severity))]),t.note?a("td",[e._v(e._s(t.note))]):e._e(),a("td",{staticClass:"text-right"},[a("v-btn",{staticClass:"mr-2",attrs:{color:"primary",fab:"","x-small":"",dark:"",elevation:"0"},on:{click:function(t){e.editing=!0}}},[a("v-icon",[e._v("mdi-pencil")])],1),a("v-btn",{attrs:{color:"error",fab:"","x-small":"",dark:"",elevation:"0"},on:{click:e.deleteAllergy}},[a("v-icon",[e._v("mdi-close")])],1)],1),a("td",{attrs:{colspan:"4"}})])])]},proxy:!0}],null,!0)})],1)],1)],1)],1)})),1)],1)},l=[],i=(a("d81d"),a("b0c0"),a("d3b7"),a("6062"),a("3ca3"),a("ddb0"),a("5530")),n=a("2909"),s=(a("96cf"),a("1da1")),c=a("8527"),o=a("f773"),d=a("c1df"),u=a.n(d),v=a("b28a"),m={name:"Allergies",components:{AutocompleteSearch:v["a"]},props:{items:null,category:null,intolerance:null,severity:null,note:null},methods:{formatDate:function(e){return u()(e).format("LL")},fetchAllergies:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var a,r,l,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,o["a"].allergies.where({id_person:e.$store.state.user.id}).toArray();case 2:return a=t.sent,r=Object(n["a"])(new Set(a.map((function(e){return e.id_allergy})))),t.next=6,o["a"].allergy_register.bulkGet(r);case 6:l=t.sent,s=Object(c["keyBy"])(l,"id"),e.items=a.map((function(e){return Object(i["a"])(Object(i["a"])({},e),{},{allergy:s[e.id_allergy]})}));case 9:case"end":return t.stop()}}),t)})))()},deleteAllergy:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.database.allergies.where({id_care:e.allergy.id_care}).delete();case 2:e.$emit("delete");case 3:case"end":return t.stop()}}),t)})))()},save:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.parent&&(e.allergy.creation=u()().format()),e.exam.update=u()().format(),!e.allergy.id_care){t.next=7;break}return t.next=5,e.database.allergies.update(e.allergy.id_care,e.allergy);case 5:t.next=9;break;case 7:return t.next=9,e.database.allergies.put(e.allergy);case 9:e.editing=!1,e.$emit("update");case 11:case"end":return t.stop()}}),t)})))()},updateAllergy:function(e){e&&(this.def=e,this.allergy.id_allergy=e.id,this.allergy.name=e.name)}},data:function(){var e;return this.parent?(e=Object(i["a"])({},this.parent),delete e.id_care,delete e.id_allergy,delete e.intolerance,delete e.severity,delete e.name,delete e.category,delete e.note):e=Object(i["a"])({},this.item),delete e.allergy,{editing:void 0!==this.parent,def:this.item?this.item.allergy:null,database:o["a"],allergy:e}},created:function(){this.fetchAllergies()}},f=m,h=a("2877"),p=a("6544"),g=a.n(p),b=a("8336"),y=a("b0af"),x=a("99d9"),_=a("ac7c"),k=a("132d"),w=a("1f4f"),C=a("8654"),j=a("8414"),A=a("1e06"),O=Object(h["a"])(f,r,l,!1,null,"da9c4be2",null);t["default"]=O.exports;g()(O,{VBtn:b["a"],VCard:y["a"],VCardText:x["b"],VCardTitle:x["c"],VCheckbox:_["a"],VIcon:k["a"],VSimpleTable:w["a"],VTextField:C["a"],VTimeline:j["a"],VTimelineItem:A["a"]})}}]);
//# sourceMappingURL=chunk-d4660694.9dae8339.js.map