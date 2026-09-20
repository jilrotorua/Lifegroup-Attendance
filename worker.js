function cors(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(x => x.trim()).filter(Boolean);
  return {
    "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : (allowed[0] || origin),
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,x-admin-pin",
    "Vary": "Origin",
    "Content-Type": "application/json"
  };
}
const clean=(value,max=500)=>typeof value==="string"?value.trim().slice(0,max):"";
export default {
  async fetch(request, env) {
    const headers=cors(request,env),url=new URL(request.url);
    if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
    if(url.pathname!=="/reports")return new Response(JSON.stringify({error:"Not found"}),{status:404,headers});
    if(request.method==="POST"){
      try{
        const p=await request.json(),id=clean(p.id,80),lifegroup=clean(p.lifegroup,120),leader=clean(p.leader,120),date=clean(p.date,10),type=clean(p.type,80),present=Array.isArray(p.present)?p.present.map(x=>clean(x,120)).filter(Boolean).slice(0,300):[];
        if(!id||!lifegroup||!leader||!/^\d{4}-\d{2}-\d{2}$/.test(date))return new Response(JSON.stringify({error:"Missing required details"}),{status:400,headers});
        await env.DB.prepare("INSERT OR IGNORE INTO lifegroup_reports (id,lifegroup,leader,meeting_date,meeting_type,present_json,first_time_visitors,returning_visitors,notes) VALUES (?,?,?,?,?,?,?,?,?)").bind(id,lifegroup,leader,date,type||"Weekly Lifegroup",JSON.stringify(present),Math.max(0,Number(p.first)||0),Math.max(0,Number(p.returning)||0),clean(p.notes,2000)).run();
        return new Response(JSON.stringify({ok:true}),{status:201,headers});
      }catch(e){return new Response(JSON.stringify({error:"Unable to save report"}),{status:500,headers});}
    }
    if(request.method==="GET"){
      if(!env.ADMIN_PIN||request.headers.get("x-admin-pin")!==env.ADMIN_PIN)return new Response(JSON.stringify({error:"Unauthorized"}),{status:401,headers});
      const result=await env.DB.prepare("SELECT * FROM lifegroup_reports ORDER BY meeting_date DESC, submitted_at DESC LIMIT 1000").all();
      const reports=(result.results||[]).map(r=>({id:r.id,lifegroup:r.lifegroup,leader:r.leader,date:r.meeting_date,type:r.meeting_type,present:JSON.parse(r.present_json||"[]"),first:r.first_time_visitors,returning:r.returning_visitors,notes:r.notes,submittedAt:r.submitted_at}));
      return new Response(JSON.stringify({reports}),{headers});
    }
    return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers});
  }
};
