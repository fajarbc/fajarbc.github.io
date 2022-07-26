import{_ as p,o as i,c as r,a as e,u as f,F as m,r as b,t as _,b as h,d as c,e as g}from"./entry-699429ad.mjs";const y={},w={class:"w-6 h-6 text-gray-600 hover:text-gray-800 button--github",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},v=e("path",{d:"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"},null,-1),x=[v];function k(l,a){return i(),r("svg",w,x)}var j=p(y,[["render",k]]);const P=()=>f("color-mode").value,T={__name:"ThemeOption",setup(l,{expose:a}){a();const s=P(),o=["light","dark","cupcake","cyberpunk","valentine","aqua","wireframe","dracula","night","coffee"];function u(t,n){s.preference=n}const d={colorMode:s,themes:o,changeTheme:u};return Object.defineProperty(d,"__isScriptSetup",{enumerable:!1,value:!0}),d}},$={class:"flex gap-4"},A={class:"dropdown dropdown-top"},L=e("label",{tabindex:"0",class:"btn btn-sm"},"Theme",-1),M={tabindex:"0",class:"dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"},C=["onClick"];function G(l,a,s,o,u,d){return i(),r("div",$,[e("div",A,[L,e("ul",M,[(i(),r(m,null,b(o.themes,t=>e("li",{key:t,onClick:n=>o.changeTheme(n,t),class:"cursor-pointer hover:bg-base-200 px-2 rounded"},_(t),9,C)),64))])])])}var I=p(T,[["render",G]]);const R=[{demo:"https://github.fajarbc.com/learn-vue-fundamentals/",title:"Learn Vue Fundamentals - Shopping List",description:"Created with Vue2 to learn the Vue fundamentals, especially on two ways data binding.",reposiory:"https://github.com/fajarbc/learn-vue-fundamentals/",reposiory_title:"Learn Vue Fundamentals"},{demo:"https://github.fajarbc.com/learn-vue3-basic/",title:"Learn Vue3 Basic - Task Reminder",open_description:!0,description:"Created with Vue3 to learn the Vue3 basic and consumes API from backend endpoint that included in the project using json-server, especially on two ways data binding & fetching API. <br />Because it has backend, the data is persistent. So please be wise \u{1F44C}, thanks. <br>I also add Github Action (Workflows) to automatically deploy compiled static files to Github Pages.",reposiory:"https://github.com/fajarbc/learn-vue3-basic/",reposiory_title:"Learn Vue3 Basic"},{demo:"#",title:"Typescript Monorepo - Chat App",description:"Learning Monorepo by using Typescript with Express & React to create simple chat app. This project also implement tRPC and WebSockets for real-time feature. Also there is branch called basic-chat-app that using tRPC with React Query to pooling data as an alternative for WebSockets.",reposiory:"https://github.com/fajarbc/typescript-monorepo",reposiory_title:"Typescript Monorepo"},{demo:"#",title:"GraphQL Basic - Chat App",description:"Learning GraphQL with Apollo Server as backend and local database for simplification using lowdb (local json file adapter). Have type User and enum of Gender. Query: get all users, get user by id, and follow (add following and followers data to user in action).",reposiory:"https://github.com/fajarbc/graphql-basic",reposiory_title:"GraphQL Basic"},{demo:"https://www.npmjs.com/package/anagram-words",title:"Anagram Words - NPM Package",description:"Repository of NPM Package I published with simple function, to return anagram words if existed from the given string/text, check if two strings are anagram word. There are 2 functions: findPattern & isAnagram that described well in the readme section.",reposiory:"https://github.com/fajarbc/anagram-words",reposiory_title:"Anagram Words"},{demo:"#",title:"ReactPHP Project - Websocket Chats",description:"Example ReactPHP Project : Websocket Chats. With the help of Thruway as PHP Router Library for Autobahn (use autobahn-browser as a client) Real-Time Application Messaging.",reposiory:"https://github.com/fajarbc/reactphp-thruway-websocket-chats",reposiory_title:"ReactPHP Thruway - Websocket Chats"},{demo:"#",title:"Image Augmentation for ML",open_description:!0,description:"Image augmentation for machine learning experiments. Based on aleju/imgaug and implemetation of asetkn. It basically Jupyter Notebook with ready to use script which supposed to create augmentation of the given images. The images need to be labelled or annotated. The output is augmented version of the images and its annotation files in .xml PASCAL POC format.",reposiory:"https://github.com/fajarbc/imgaug-bbox",reposiory_title:"Image Augmentation for ML"}],V={__name:"Home",setup(l,{expose:a}){a();const s={IconGithub:j,ThemeOption:I,projects:R};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}},B={class:"relative flex items-top justify-center min-h-screen sm:items-center sm:pt-0"},S={class:"max-w-4xl mx-auto px-6 lg:px-8"},H=e("div",{class:"flex justify-center gap-4"},[e("a",{class:"flex justify-center pt-8 sm:pt-2 uppercase text-2xl md:text-4xl",href:"https://github.fajarbc.com",target:"_blank"}," github.fajarbc.com ")],-1),W={class:"mt-8 bg-base-200 overflow-hidden shadow sm:rounded-lg p-6"},N=e("h2",{class:"text-2xl leading-7 font-semibold"},"Hi there,",-1),F={class:"mt-3"},O=c(" My name is "),z=e("span",{class:"underline decoration-wavy decoration-blue",title:"@fajarbc"},"Fajar",-1),Q=c(" and I'm planning to build something here, just for fun. "),D=e("br",null,null,-1),E=c("FYI, this page is built with Nuxt 3 (Vue 3) as frontend framework, Tailwind as styling, Vite as the build tool and uses Github Action Workflows for the deployments. "),q={class:"flex items-center gap-1"},J=c(" Github Repository: "),U=e("a",{href:"https://github.com/fajarbc/fajarbc.github.io/",class:"underline",target:"_blank",title:"fajarbc.github.io"}," fajarbc.github.io ",-1),Y={class:"mt-4 pt-4 border-t border-dashed"},K=c(" For now you can try to open: "),X={class:"py-2"},Z=["open"],ee=["href","title"],te=["innerHTML"],oe={class:"flex items-center gap-1"},se=c(" Github Repository: "),ae=["href","title"],ie={class:"flex justify-center pt-4 space-x-2 pb-4 md:pb-2"},ne={href:"https://github.com/fajarbc",target:"_blank"},re=e("a",{href:"https://linkedin.com/in/fajarbc",target:"_blank"},[e("svg",{class:"w-6 h-6 button--github",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},[e("path",{d:"M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"})])],-1),ce={class:"flex justify-center mb-4"};function le(l,a,s,o,u,d){return i(),r("div",B,[e("div",S,[H,e("div",W,[N,e("div",F,[O,z,Q,D,E,e("div",q,[h(o.IconGithub),J,U])]),e("div",Y,[K,(i(!0),r(m,null,b(o.projects,t=>{var n;return i(),r("ul",{key:t.title},[e("li",X,[e("details",{open:t.open_description},[e("summary",null,[e("a",{href:`${(n=t.demo)!=null?n:"#"}`,class:"underline ml-4 md:ml-0",target:"_blank",title:`${t.title?"Demo of "+t.title:"No Demo"}`},_(t.title),9,ee)]),e("div",null,[e("span",{innerHTML:t.description},null,8,te),e("div",oe,[h(o.IconGithub),se,e("a",{href:t.reposiory,class:"underline",target:"_blank",title:`${t.reposiory_title} - Github Repository`},_(t.reposiory_title),9,ae)])])],8,Z)])])}),128))])]),e("div",ie,[e("a",ne,[h(o.IconGithub)]),re]),e("div",ce,[h(o.ThemeOption)])])])}var de=p(V,[["render",le]]);const he={};function pe(l,a){const s=de;return i(),g(s)}var _e=p(he,[["render",pe]]);export{_e as default};