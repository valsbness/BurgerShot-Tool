const products=[['Comida','Hamburguesa',200],['Comida','Cubo de Alitas',200],['Comida','Burrito',200],['Comida','Nuggets',200],['Bebidas','Cola-Shot',100],['Extras','Helado',100],['Extras','Papitas Fritas',100],['Cajitas','Cajita Infantil',400],['Cajitas','Cajita Médicos / Policías',250]];
const comboTypes=[['Hamburguesa','hamburguesa','🍔'],['Nuggets','nuggets','🍗'],['Alitas','cubo de alitas','🍗'],['Burrito','burrito','🌯']],COMBO_PRICE_PER_5=1200;
const $=x=>document.getElementById(x),money=n=>'$'+Math.round(Number(n)||0).toLocaleString('en-US');
const SUPABASE_URL='https://cibmabtwcxdpczyexbap.supabase.co';

const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZXMiLCJyZWYiOiJjaWJtYWJ0d2N4ZHBjenlleHhiYXAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4NzQyMzc4OSwiZXhwIjoyMTAyOTk5Nzg5fQ.w1YxLpRzUT1YmR8O5qETBk4DFtqshJUbg9ND4sfJpQw';

const supabaseClient=window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
function render(){let root=$('rows'),last='';root.innerHTML='';products.forEach((p,i)=>{if(p[0]!==last){root.innerHTML+=`<div class="cat">${p[0]}</div>`;last=p[0]}let r=document.createElement('div');r.className='row';r.dataset.i=i;r.innerHTML=`<span class="pname">${p[1]}</span><span><input type="number" min="0" value="0"></span><span class="price">${money(p[2])}</span><span class="ptotal">$0</span>`;r.querySelector('input').oninput=update;root.appendChild(r)})}
function update(){let sub=0;document.querySelectorAll('.row').forEach(r=>{let p=products[r.dataset.i],q=Math.max(0,+r.querySelector('input').value||0),t=q*p[2];sub+=t;r.querySelector('.ptotal').textContent=money(t)});$('sub').textContent=money(sub);let d=+document.querySelector('input[name=disc]:checked').value,total=sub*(1-d/100);$('total').textContent=money(total);$('q5').textContent=money(sub*.95);$('q10').textContent=money(sub*.9);$('sq').textContent=(+document.querySelector('.row[data-i="8"] input').value||0)+' unidades';saveCalc()}
function saveCalc(){let q={d:+document.querySelector('input[name=disc]:checked').value,items:{}};document.querySelectorAll('.row').forEach(r=>q.items[r.dataset.i]=r.querySelector('input').value);localStorage.setItem('bsCalc',JSON.stringify(q))}
function loadCalc(){try{let q=JSON.parse(localStorage.getItem('bsCalc')||'{}');document.querySelectorAll('.row').forEach(r=>{if(q.items&&q.items[r.dataset.i]!=null)r.querySelector('input').value=q.items[r.dataset.i]});let rd=document.querySelector(`input[name=disc][value="${q.d??0}"]`);if(rd)rd.checked=true}catch(e){}update()}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>$('toast').classList.remove('show'),1700)}
$('copy').onclick=()=>{let v=$('total').textContent.replace('$','').trim();if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(v).then(()=>toast('Monto copiado: '+$('total').textContent));else{let t=document.createElement('textarea');t.value=v;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(e){}t.remove();toast('Monto copiado: '+$('total').textContent)}};
function reset(){document.querySelectorAll('.row input').forEach(x=>x.value=0);document.querySelector('input[name=disc][value="0"]').checked=true;update();toast('Calculadora reiniciada')}$('reset').onclick=reset;$('clear').onclick=reset;$('specialBtn').onclick=()=>{let x=document.querySelector('.row[data-i="8"] input');x.value=(+x.value||0)+1;update();toast('Cajita especial agregada')};document.querySelectorAll('input[name=disc]').forEach(x=>x.onchange=update);
function renderCombos(){
  const q=$('comboQty'), choice=$('comboChoiceText'), title=$('comboBoxTitle'), drink=$('comboDrinkText');
  const icons={Hamburguesas:'🍔',Nuggets:'🍗',Alitas:'🍗',Burritos:'🌯'};
  const cards=[...document.querySelectorAll('.comboChoiceCard')];
  let selected='Hamburguesas';
  function calc(){
    let n=Math.max(5,Math.floor(+q.value||5));
    q.value=n;
    const total=(n/5)*COMBO_PRICE_PER_5;
    const icon=icons[selected]||'🍔';
    choice.textContent=icon+' '+selected;
    title.textContent=icon+' '+selected+' • '+n+' × '+n;
    drink.textContent=n+' × '+n;
    $('comboGrandTotal').textContent=money(total);
    $('comboNormalTotal').textContent=money(total);
    $('comboDisc5').textContent=money(total*.95);
    $('comboDisc10').textContent=money(total*.90);
    cards.forEach(c=>c.classList.toggle('selected',c.dataset.food===selected));
    localStorage.setItem('bsCombo',JSON.stringify({food:selected,qty:n}));
  }
  cards.forEach(c=>c.onclick=()=>{selected=c.dataset.food;calc()});
  q.oninput=calc; q.onchange=calc;
  try{const saved=JSON.parse(localStorage.getItem('bsCombo')||'null');if(saved){if(Number(saved.qty)>=5)q.value=saved.qty;if(saved.food&&icons[saved.food])selected=saved.food}}catch(e){}
  calc();
}

function renderMenuPrices(){let r=$('menuPriceGrid');r.innerHTML=products.map(p=>`<article class="menuPrice"><h3>${p[1]}</h3><b>${money(p[2])}</b></article>`).join('')}

const WEEKLY_VERSION='supabase-v1';

let workersCloud=[];
let conveniosCloud=[];
let currentWorker=-1;
let currentWorkerId=null;
let realtimeChannel=null;

function ensureWorkerData(w){
  if(!Array.isArray(w.invoices))w.invoices=[];
  if(!Array.isArray(w.tips))w.tips=[];
  return w;
}

function workerTotals(w){
  ensureWorkerData(w);

  let f=w.invoices.reduce(
    (s,x)=>s+(Number(x.v)||0),
    0
  );

  let t=w.tips.reduce(
    (s,x)=>s+(Number(x.v)||0),
    0
  );

  return{
    f,
    t,
    forty:f*.4,
    pay:f*.4+t
  };
}

function escapeHtml(s){
  return String(s).replace(
    /[&<>"']/g,
    m=>({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#039;'
    }[m])
  );
}


/* =========================
   SUPABASE
========================= */

async function loadWorkers(){

  const {data:workers,error}=await supabaseClient
    .from('workers')
    .select('*')
    .order('created_at',{ascending:true});

  if(error){
    console.error('Error workers:',error);
    toast('❌ Error cargando trabajadores');
    return;
  }

  workersCloud=[];

  for(const worker of workers||[]){

    const {data:entries,error:entryError}=await supabaseClient
      .from('worker_entries')
      .select('*')
      .eq('worker_id',worker.id)
      .order('position',{ascending:true});

    if(entryError){
      console.error('Error entries:',entryError);
      continue;
    }

    const invoices=[];
    const tips=[];

    (entries||[]).forEach(entry=>{

      const item={
        id:entry.id,
        v:Number(entry.amount)||0,
        position:entry.position
      };

      if(entry.entry_type==='invoice'){
        invoices.push(item);
      }

      if(entry.entry_type==='tip'){
        tips.push(item);
      }

    });

    workersCloud.push({
      id:worker.id,
      n:worker.name,
      invoices,
      tips
    });
  }

  renderWeekly();

  if(currentWorker>=0){
    renderWorkerDetail();
  }
}


async function loadConvenios(){

  const {data,error}=await supabaseClient
    .from('convenios')
    .select('*')
    .order('created_at',{ascending:true});

  if(error){
    console.error('Error convenios:',error);
    toast('❌ Error cargando convenios');
    return;
  }

  conveniosCloud=(data||[]).map(x=>({
    id:x.id,
    n:x.name,
    b:x.benefit
  }));

  renderC();
}


/* =========================
   REALTIME
========================= */

function startRealtime(){

  if(realtimeChannel){
    supabaseClient.removeChannel(realtimeChannel);
  }

  realtimeChannel=supabaseClient
    .channel('burgershot-realtime')

    .on(
      'postgres_changes',
      {
        event:'*',
        schema:'public',
        table:'workers'
      },
      ()=>{
        loadWorkers();
      }
    )

    .on(
      'postgres_changes',
      {
        event:'*',
        schema:'public',
        table:'worker_entries'
      },
      ()=>{
        loadWorkers();
      }
    )

    .on(
      'postgres_changes',
      {
        event:'*',
        schema:'public',
        table:'convenios'
      },
      ()=>{
        loadConvenios();
      }
    )

    .subscribe(status=>{
      console.log('Supabase Realtime:',status);
    });
}


/* =========================
   WORKERS
========================= */

function getWorkers(){
  return workersCloud;
}

function saveWorkers(a){
  workersCloud=a;
}

function renderWeekly(){

  let a=getWorkers();

  a.forEach(ensureWorkerData);

  let root=$('workerList');

  root.innerHTML='';

  if(!a.length){

    root.innerHTML=`
      <div class="emptyWorkers">
        <div class="emptyIcon">📁</div>
        <h2>No hay trabajadores todavía</h2>
        <p>
          Agrega una carpeta con el nombre del trabajador
          y luego entra para registrar sus facturas y propinas.
        </p>
      </div>
    `;
  }

  a.forEach((w,i)=>{

    let z=workerTotals(w);

    let card=document.createElement('article');

    card.className='workerCard';

    card.innerHTML=`
      <div class="workerCardTop">
        <h2>👤 ${escapeHtml(w.n)}</h2>

        <div class="workerActions">
          <span class="folder">📁</span>

          <button
            class="deleteWorker"
            title="Eliminar carpeta">
            🗑
          </button>
        </div>
      </div>

      <div class="workerStats">

        <div>
          <span>FACTURAS</span>
          <b>${money(z.f)}</b>
        </div>

        <div>
          <span>40% A PAGAR</span>
          <b>${money(z.forty)}</b>
        </div>

        <div class="pay">
          <span>TOTAL A PAGAR</span>
          <b>${money(z.pay)}</b>
        </div>

      </div>
    `;

    card.onclick=()=>{
      openWorker(i);
    };

    card.querySelector('.deleteWorker').onclick=async ev=>{

      ev.stopPropagation();

      openPin('weekly',async()=>{

        if(!confirm(
          `¿Eliminar la carpeta de ${w.n}? También se eliminarán sus facturas y propinas.`
        )){
          return;
        }

        const {error}=await supabaseClient
          .from('workers')
          .delete()
          .eq('id',w.id);

        if(error){

          console.error(error);

          toast('❌ No se pudo eliminar');

          return;
        }

        await loadWorkers();

        toast('Carpeta eliminada');

      });

    };

    root.appendChild(card);

  });

  updateWeeklyTotals();
}


function updateWeeklyTotals(){

  let f=0;
  let t=0;

  getWorkers().forEach(w=>{

    let z=workerTotals(w);

    f+=z.f;
    t+=z.t;

  });

  $('wFacturas').textContent=money(f);
  $('wForty').textContent=money(f*.4);
  $('wTips').textContent=money(t);
  $('wPay').textContent=money(f*.4+t);
}


/* =========================
   ADD WORKER
========================= */

$('addWorker').onclick=()=>{

  let n=$('workerName').value.trim();

  if(!n){

    toast('Escribe el nombre del trabajador');

    return;
  }

  openPin('weekly',async()=>{

    const {data,error}=await supabaseClient
      .from('workers')
      .insert({
        name:n
      })
      .select()
      .single();

    if(error){

      console.error(error);

      toast('❌ No se pudo crear la carpeta');

      return;
    }

    $('workerName').value='';

    await loadWorkers();

    toast('Carpeta creada');

  });

};


/* =========================
   CLEAR WEEK
========================= */

$('clearWeekly').onclick=()=>{

  openPin('weekly',async()=>{

    if(!confirm(
      '¿Limpiar todos los datos de la semana? Esto eliminará las facturas y propinas registradas.'
    )){
      return;
    }

    const workers=getWorkers();

    for(const worker of workers){

      const {error}=await supabaseClient
        .from('worker_entries')
        .delete()
        .eq('worker_id',worker.id);

      if(error){

        console.error(error);

        toast('❌ No se pudo limpiar la semana');

        return;
      }

    }

    await loadWorkers();

    toast('Semana limpiada');

  });

};


/* =========================
   PIN
========================= */

const ACCESS_CODES={
  weekly:'2580',
  convenios:'7744'
};

let pendingAccess=null;
let pinResolve=null;

function openPin(kind,action){

  pendingAccess=kind;
  pinResolve=action;

  $('pinTitle').textContent=
    kind==='weekly'
      ?'🔒 Pago semanal'
      :'🔒 Administrar convenios';

  $('pinText').textContent=
    kind==='weekly'
      ?'Solo los jefes tienen acceso a esta sección. Introduce el código de jefe.'
      :'Todos pueden ver los convenios, pero necesitas autorización para agregar o eliminar.';

  $('pinInput').value='';
  $('pinError').textContent='';

  $('pinModal').classList.add('show');

  setTimeout(()=>{
    $('pinInput').focus();
  },50);

}

function closePin(){

  $('pinModal').classList.remove('show');

  pendingAccess=null;
  pinResolve=null;

  $('pinInput').value='';
  $('pinError').textContent='';

}

function checkPin(){

  let val=$('pinInput').value.trim();

  if(val===ACCESS_CODES[pendingAccess]){

    let fn=pinResolve;

    closePin();

    if(fn)fn();

    return true;
  }

  $('pinError').textContent='❌ Código incorrecto';

  $('pinInput').select();

  return false;
}

$('pinEnter').onclick=checkPin;
$('pinCancel').onclick=closePin;
$('pinClose').onclick=closePin;

$('pinInput').addEventListener(
  'keydown',
  e=>{
    if(e.key==='Enter')checkPin();
    if(e.key==='Escape')closePin();
  }
);


/* =========================
   WORKER DETAIL
========================= */

function openWorker(i){

  currentWorker=i;

  const w=getWorkers()[i];

  currentWorkerId=w?w.id:null;

  showView('workerDetail');

  renderWorkerDetail();

}

function current(){

  let w=getWorkers()[currentWorker];

  if(!w)return null;

  ensureWorkerData(w);

  return w;

}

function renderWorkerDetail(){

  let w=current();

  if(!w)return;

  $('detailName').textContent=w.n;

  renderEntries(
    'invoiceList',
    w.invoices,
    'invoice'
  );

  renderEntries(
    'tipList',
    w.tips,
    'tip'
  );

  updateDetailTotals();

}


/* =========================
   ENTRIES
========================= */

function renderEntries(id,arr,type){

  let root=$(id);

  root.innerHTML='';

  arr.forEach((entry,i)=>{

    let row=document.createElement('div');

    row.className='entryRow';

    row.innerHTML=`
      <span class="num">#${i+1}</span>

      <input
        type="number"
        min="0"
        step="1"
        value="${Number(entry.v)||0}"
        placeholder="0">

      <button class="deleteEntry">
        🗑 ELIMINAR
      </button>
    `;

    let input=row.querySelector('input');

    input.oninput=async()=>{

      let value=Math.max(
        0,
        +input.value||0
      );

      entry.v=value;

      updateDetailTotals();
      updateWeeklyTotals();

      const {error}=await supabaseClient
        .from('worker_entries')
        .update({
          amount:value
        })
        .eq('id',entry.id);

      if(error){

        console.error(error);

        toast('❌ No se pudo guardar');

      }

    };

    row.querySelector('.deleteEntry').onclick=async()=>{

      const {error}=await supabaseClient
        .from('worker_entries')
        .delete()
        .eq('id',entry.id);

      if(error){

        console.error(error);

        toast('❌ No se pudo eliminar');

        return;
      }

      arr.splice(i,1);

      await loadWorkers();

      renderWorkerDetail();
      renderWeekly();

    };

    root.appendChild(row);

  });

}


/* =========================
   ADD INVOICE / TIP
========================= */

async function addEntry(type){

  let w=current();

  if(!w)return;

  let key=
    type==='invoice'
      ?'invoices'
      :'tips';

  if(w[key].length>=100){

    toast(
      'Ya tienes el máximo de 100 registros en esta sección'
    );

    return;
  }

  const {data,error}=await supabaseClient
    .from('worker_entries')
    .insert({
      worker_id:w.id,
      entry_type:type,
      amount:0,
      position:w[key].length+1
    })
    .select()
    .single();

  if(error){

    console.error(error);

    toast(
      type==='invoice'
        ?'❌ No se pudo agregar la factura'
        :'❌ No se pudo agregar la propina'
    );

    return;
  }

  w[key].push({
    id:data.id,
    v:0,
    position:data.position
  });

  renderWorkerDetail();
  updateWeeklyTotals();

  let root=$(
    type==='invoice'
      ?'invoiceList'
      :'tipList'
  );

  let inputs=root.querySelectorAll('input');

  if(inputs.length){
    inputs[inputs.length-1].focus();
  }

  toast(
    type==='invoice'
      ?'Factura agregada'
      :'Propina agregada'
  );

}

$('addInvoice').onclick=()=>{
  addEntry('invoice');
};

$('addTip').onclick=()=>{
  addEntry('tip');
};


/* =========================
   TOTALS
========================= */

function updateDetailTotals(){

  let w=current();

  if(!w)return;

  let z=workerTotals(w);

  $('dFacturas').textContent=money(z.f);
  $('dForty').textContent=money(z.forty);
  $('dTips').textContent=money(z.t);
  $('dPay').textContent=money(z.pay);

  $('dInvoiceTotal').textContent=money(z.f);
  $('dTipTotal').textContent=money(z.t);

}

$('backWeekly').onclick=()=>{
  showView('weekly');
};


/* =========================
   VIEWS
========================= */

function showView(id){

  if(
    id==='weekly' &&
    !window.weeklyUnlocked
  ){

    openPin(
      'weekly',
      ()=>{
        window.weeklyUnlocked=true;
        showView('weekly');
      }
    );

    return;
  }

  document
    .querySelectorAll('.view')
    .forEach(v=>{
      v.classList.remove('active');
    });

  $(id).classList.add('active');

  document
    .querySelectorAll('.nav')
    .forEach(x=>{
      x.classList.remove('active');
    });

  let nav=document.querySelector(
    `.nav[data-v="${id}"]`
  );

  if(nav)nav.classList.add('active');

  scrollTo({
    top:0,
    behavior:'smooth'
  });

}

document
  .querySelectorAll('.nav')
  .forEach(b=>{

    b.onclick=()=>{

      showView(b.dataset.v);

      side.classList.remove('open');
      shade.classList.remove('show');

    };

  });


/* =========================
   CONVENIOS
========================= */

function getC(){
  return conveniosCloud;
}

function saveC(x){
  conveniosCloud=x;
}

function renderC(){

  let a=getC();

  let r=$('convList');

  r.innerHTML=
    a.length

      ?a.map((x,i)=>`
        <div class="convRow">

          <strong>
            ${escapeHtml(x.n)}
          </strong>

          <span>
            ${escapeHtml(x.b)}

            <button
              onclick="delC(${i})">
              🔒
            </button>
          </span>

        </div>
      `).join('')

      :`
        <div class="convRow">

          <span style="color:#777">
            No hay convenios agregados.
          </span>

          <span>—</span>

        </div>
      `;

}

window.delC=i=>{

  openPin(
    'convenios',
    async()=>{

      let x=getC()[i];

      if(!x)return;

      const {error}=await supabaseClient
        .from('convenios')
        .delete()
        .eq('id',x.id);

      if(error){

        console.error(error);

        toast('❌ No se pudo eliminar');

        return;
      }

      await loadConvenios();

      toast('Convenio eliminado');

    }
  );

};


$('addConv').onclick=()=>{

  openPin(
    'convenios',
    async()=>{

      let n=$('convName')
        .value
        .trim();

      if(!n){

        toast(
          'Escribe el nombre del convenio'
        );

        return;
      }

      let v=$('convBenefit').value;

      let b=
        v==='special'
          ?'Cajita a $250'
          :v+'% de descuento';

      const {error}=await supabaseClient
        .from('convenios')
        .insert({
          name:n,
          benefit:b
        });

      if(error){

        console.error(error);

        toast('❌ No se pudo agregar');

        return;
      }

      $('convName').value='';

      await loadConvenios();

      toast('Convenio agregado');

    }
  );

};


/* =========================
   MENU
========================= */

const side=$('side');
const shade=$('shade');

$('menu').onclick=()=>{
  side.classList.add('open');
  shade.classList.add('show');
};

$('close').onclick=()=>{
  side.classList.remove('open');
  shade.classList.remove('show');
};

shade.onclick=()=>{
  side.classList.remove('open');
  shade.classList.remove('show');
};


/* =========================
   START
========================= */

render();
renderCombos();
renderMenuPrices();
loadCalc();

loadWorkers();
loadConvenios();

// startRealtime();
