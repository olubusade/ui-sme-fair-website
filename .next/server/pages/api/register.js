"use strict";(()=>{var a={};a.id=88,a.ids=[88],a.modules={1572:a=>{a.exports=require("nodemailer")},5463:(a,b,c)=>{c.r(b),c.d(b,{config:()=>o,default:()=>n,handler:()=>q});var d={};c.r(d),c.d(d,{default:()=>k});var e=c(9046),f=c(8667),g=c(3480),h=c(6435),i=c(1572),j=c.n(i);async function k(a,b){if("POST"!==a.method)return b.status(405).json({message:"Method Not Allowed"});let c=a.body;if(!c.businessName||!c.email||!c.contactPerson||!c.registrationType||!c.declarationName||!c.paymentReceipt)return b.status(400).json({message:"Missing critical registration fields. Please check all required sections."});if(["Exhibitor","Studentpreneur"].includes(c.registrationType)&&(!c.boothFee||!c.paymentReceipt))return b.status(400).json({message:"Payment information (Fee and Receipt) is required for your selected registration type."});let d="Link to be generated after secure upload/storage...",e=j().createTransport({host:process.env.EMAIL_HOST,port:parseInt(process.env.EMAIL_PORT||"587",10),secure:"true"===process.env.EMAIL_SECURE,auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}});try{let a=`
      <p>A <strong>NEW ${c.registrationType.toUpperCase()}</strong> has registered for the UI 77th Anniversary SME Fair.</p>
      <p><strong>Registration Status:</strong> PENDING REVIEW (Payment Receipt Attached/Linked)</p>
      <hr>

      <h3>1. Company / Business Information</h3>
      <p><strong>Business Name:</strong> ${c.businessName}</p>
      <p><strong>Industry:</strong> ${c.businessType}</p>
      <p><strong>Address:</strong> ${c.businessAddress}</p>

      <h3>2. Contact Information</h3>
      <p><strong>Contact Person:</strong> ${c.contactPerson} (${c.designation})</p>
      <p><strong>Email:</strong> ${c.email}</p>
      <p><strong>Primary Phone:</strong> ${c.phoneWhatsapp}</p>
      <p><strong>Website/Social:</strong> ${c.websiteHandle||"N/A"}</p>

      <h3>3. Exhibition Details</h3>
      <p><strong>Type:</strong> <strong>${c.registrationType}</strong></p>
      <p><strong>Products/Services:</strong> ${c.productsServices}</p>
      <p><strong>Booth Size:</strong> ${c.boothSize} (Exhibition for 2 days)</p>
      <p><strong>Fee Paid:</strong> ₦${c.boothFee.toLocaleString()}</p>
      <p><strong>Payment Receipt Link:</strong> <a href="${d}">${d}</a></p>
      
      <h3>4. Participation Details</h3>
      <p><strong>Exhibited Before:</strong> ${c.exhibitedBefore}</p>
      <p><strong>Staff Count:</strong> ${c.staffCount}</p>
      <p><strong>Additional Support Required:</strong> ${c.additionalSupport} - ${c.supportSpecification||"None specified"}</p>
      
      <hr>
      <p><strong>Declaration Signed By:</strong> ${c.declarationName} on ${c.declarationDate}</p>
    `;return await e.sendMail({from:`"UI SME Fair Registration" <${process.env.EMAIL_USER}>`,to:process.env.EMAIL_TO,subject:`[ACTION REQUIRED] New ${c.registrationType} Registration: ${c.businessName}`,html:a}),b.status(200).json({message:`Thank you, ${c.businessName}! Your registration and payment receipt have been successfully submitted for review.`})}catch(a){return console.error("Nodemailer error:",a),b.status(500).json({message:"Server error: Failed to process your registration. Please check your network and try again."})}}var l=c(8112),m=c(8766);let n=(0,h.M)(d,"default"),o=(0,h.M)(d,"config"),p=new g.PagesAPIRouteModule({definition:{kind:f.A.PAGES_API,page:"/api/register",pathname:"/api/register",bundlePath:"",filename:""},userland:d,distDir:".next",projectDir:""});async function q(a,b,c){let d=await p.prepare(a,b,{srcPage:"/api/register"});if(!d){b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve());return}let{query:f,params:g,prerenderManifest:h}=d;try{let c=a.method||"GET",d=(0,l.getTracer)(),e=d.getActiveScopeSpan(),i=p.instrumentationOnRequestError.bind(p),j=async e=>p.render(a,b,{query:{...f,...g},params:g,allowedRevalidateHeaderKeys:void 0,multiZoneDraftMode:!0,trustHostHeader:void 0,previewProps:h.preview,propagateError:!1,dev:p.isDev,page:"/api/register",projectDir:"",onError:(...b)=>i(a,...b)}).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let f=d.getRootSpanAttributes();if(!f)return;if(f.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${f.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let g=f.get("next.route");if(g){let a=`${c} ${g}`;e.setAttributes({"next.route":g,"http.route":g,"next.span_name":a}),e.updateName(a)}else e.updateName(`${c} ${a.url}`)});e?await j(e):await d.withPropagatedContext(a.headers,()=>d.trace(m.BaseServerSpan.handleRequest,{spanName:`${c} ${a.url}`,kind:l.SpanKind.SERVER,attributes:{"http.method":c,"http.target":a.url}},j))}catch(a){if(p.isDev)throw a;(0,e.sendError)(b,500,"Internal Server Error")}finally{null==c.waitUntil||c.waitUntil.call(c,Promise.resolve())}}},5600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")}};var b=require("../../webpack-api-runtime.js");b.C(a);var c=b.X(0,[169],()=>b(b.s=5463));module.exports=c})();