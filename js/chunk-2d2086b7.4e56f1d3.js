(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2086b7"],{a55b:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-layout",{staticClass:"blue darken-1",attrs:{"fill-height":"",fluid:""}},[a("v-row",{attrs:{align:"center",justify:"center"}},[a("v-card",{staticClass:"px-10 py-5 blue darken-1",attrs:{align:"center",elevation:"0"}},[a("LoginDialog",{attrs:{"button-text":"Accedi Come Paziente","headline-text":"Accesso Pazienti","login-call-back":this.patientLogin}}),a("LoginDialog",{attrs:{"button-text":"Accedi Come Dottore","headline-text":"Accesso Dottori","login-call-back":this.doctorLogin}}),a("LoginDialog",{attrs:{"button-text":"Accedi Come Operatore Sanitario","headline-text":"Accesso Operatori Sanitari","login-call-back":this.operatorLogin}})],1)],1)],1)},i=[],o=(a("96cf"),a("1da1")),r=a("19f6"),l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-dialog",{attrs:{"max-width":"600px"},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on,i=e.attrs;return[a("div",{staticClass:"my-5 light-blue--text"},[a("v-btn",t._g(t._b({attrs:{color:"primary lighten-1",dark:""}},"v-btn",i,!1),n),[t._v(" "+t._s(t.buttonText)+" ")])],1)]}}]),model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v(t._s(t.headlineText))])]),a("v-card-text",[a("v-container",[a("v-row",[a("v-col",{attrs:{cols:"12"}},[a("v-text-field",{attrs:{label:"Email",required:"",type:"email"},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}})],1),a("v-col",{attrs:{cols:"12"}},[a("v-text-field",{attrs:{label:"Password",type:"password",required:""},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1)],1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.login()}}},[t._v("Accedi")])],1)],1)],1)},s=[],c={name:"LoginDialog",props:{buttonText:null,headlineText:null,loginCallBack:null},methods:{login:function(){this.dialog=!1,this.loginCallBack(this.email,this.password)}},data:function(){return{dialog:!1,email:null,password:null}}},u=c,d=a("2877"),p=a("6544"),h=a.n(p),g=a("8336"),b=a("b0af"),f=a("99d9"),v=a("62ad"),m=a("a523"),x=a("169a"),w=a("0fd9"),k=a("2fa4"),C=a("8654"),_=Object(d["a"])(u,l,s,!1,null,null,null),V=_.exports;h()(_,{VBtn:g["a"],VCard:b["a"],VCardActions:f["a"],VCardText:f["b"],VCardTitle:f["c"],VCol:v["a"],VContainer:m["a"],VDialog:x["a"],VRow:w["a"],VSpacer:k["a"],VTextField:C["a"]});var L=a("2f62"),y={name:"Login",components:{LoginDialog:V},mounted:function(){if(this.user&&this.user.id)switch(this.user.type){case"patient":this.$router.push({path:"/patient_home"});break;default:break}},computed:Object(L["b"])(["user"]),watch:{user:function(t){if(t&&t.id)switch(t.type){case"patient":this.$router.push({path:"/patient_home"});break;default:break}}},methods:{patientLogin:function(t,e){var a=this;return Object(o["a"])(regeneratorRuntime.mark((function n(){var i;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,r["a"].login(t,e);case 2:return i=n.sent,a.$store.commit("setUser",i),n.next=6,a.$router.push({path:"/patient_home"});case 6:case"end":return n.stop()}}),n)})))()},doctorLogin:function(){},operatorLogin:function(){}}},A=y,D=a("a722"),T=Object(d["a"])(A,n,i,!1,null,"55bdc9ac",null);e["default"]=T.exports;h()(T,{VCard:b["a"],VLayout:D["a"],VRow:w["a"]})}}]);
//# sourceMappingURL=chunk-2d2086b7.4e56f1d3.js.map